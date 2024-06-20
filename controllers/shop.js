const Product = require('../models/product');
const fsPromises = require('fs').promises;
const fs = require('fs');
const path = require('path');
const PdfDocument = require('pdfkit');
const { getDb } = require('../util/database');
const { ObjectId } = require('mongodb');
const { fetchProducts } = require('../util/pagination');

exports.getIndex = async (req, res, next) => {
    try {
        await fetchProducts('shop/index', 'Shop', '/', req, res, next);
    }
    catch (err) {
        return next(err);
    }
};

exports.getProducts = async (req, res, next) => {
    try {
        await fetchProducts('shop/product-list', 'All Products', '/products', req, res, next);
    }
    catch (err) {
        return next(err);
    }
};

exports.getProductDetails = async (req, res, next) => {
    const { productId } = req.params;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            const err = new Error('Product not found');
            err.statusCode = 404;
            throw err;
        }

        res.render('shop/product-detail', {
            pageTitle: product.title,
            product: product,
            path: '/products',
        });
    }
    catch (err) {
        return next(err);
    }
};

exports.getCart = async (req, res, next) => {
    try {
        const cartProducts = await req.user.getCart();
        let totalPrice = 0;
        let canMakeOrder = true;

        cartProducts.forEach(cp => {
            totalPrice += cp.price;
            if (cp.productQuantity < cp.quantity) {
                canMakeOrder = false;
            }
        });

        res.render('shop/cart', {
            pageTitle: 'Cart',
            path: '/cart',
            products: cartProducts,
            totalPrice: totalPrice,
            canMakeOrder: canMakeOrder,
        });
    }
    catch (err) {
        return next(err);
    }
};

exports.addToCart = async (req, res, next) => {
    try {
        await req.user.addToCart(req.body.productId)
        res.redirect('/cart');
    }
    catch (err) {
        return next(err);
    }
};

exports.deleteCartItem = async (req, res, next) => {
    try {
        await req.user.deleteFromCart(req.body.productId);
        res.redirect('/cart');
    }
    catch (err) {
        return next(err);
    }
};

exports.CreateOrder = async (req, res, next) => {
    try {
        const done = await req.user.createOrder();
        if (!done) return res.redirect('/cart');
        res.redirect('/orders');
    }
    catch (err) {
        return next(err);
    }
};

exports.getOrders = async (req, res, next) => {
    try {
        const ITEMS_PER_PAGE = 3;
        const page = +req.query.page || 1;
        const numOfOrders = req.user.orders.length;
        const lastPage = Math.ceil(numOfOrders / ITEMS_PER_PAGE);
        const userOrders = await req.user.getOrders()
            .skip(ITEMS_PER_PAGE * (page - 1))
            .limit(ITEMS_PER_PAGE)
            .toArray();

        res.render('shop/orders', {
            pageTitle: 'Your Orders',
            path: '/orders',
            orders: userOrders,
            currentPage: page,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: lastPage,
            hasNextPage: page < lastPage,
            hasPreviousPage: page > 1
        });
    }
    catch (err) {
        return next(err);
    }
}

exports.getOrderInvoice = async (req, res, next) => {
    try {
        await fsPromises.mkdir('data/invoices', { recursive: true });
        const db = getDb();
        const { orderId } = req.params;
        const order = await db.collection('orders').findOne({ _id: ObjectId.createFromHexString(orderId) });
        const pdfDoc = new PdfDocument();
        const invoicePath = path.join('data', 'invoices', `invoice_${orderId}.pdf`);
        const writeStream = fs.createWriteStream(invoicePath)
        pdfDoc.pipe(writeStream);

        // Invoice Header
        pdfDoc
            .fillColor('#444444')
            .fontSize(20)
            .text('INVOICE', 50, 57)
            .fontSize(13)
            .text(`Order ID: ${orderId}`, 310, 60)
            .text(`Date: ${new Date().toLocaleDateString()}`, 310, 80)
            .moveDown();

        // Table Header
        pdfDoc
            .fillColor('#444444')
            .fontSize(18)
            .text('Product', 50, 135)
            .text('Quantity', 170, 135)
            .text('Price', 280, 135)
            .text('Total', 370, 135)
            .moveDown();

        // Table Rows
        let y = 170;
        order.items.forEach((prod) => {
            pdfDoc
                .fontSize(13)
                .text(prod.title, 60, y)
                .text(prod.quantity, 195, y)
                .text(`${prod.price}$`, 285, y)
                .text(`${(prod.price * prod.quantity).toFixed(2)}$`, 370, y)
                .moveDown();

            // Add product image if available
            if (prod.imageUrl) {
                try {
                    pdfDoc.image(prod.imageUrl, 450, y - 20, { fit: [80, 80] });
                }
                catch (err) {
                    console.error('Image not found', err);
                    return next(err);
                }
            }
            y += 40;
            pdfDoc
                .fontSize(20)
                .text('-------------------------------------------------------------------------', 40, y);
            y += 40
        });

        // Total Price
        pdfDoc
            .fontSize(16)
            .fillColor('#000000')
            .text('Total Price:', 50, y - 15)
            .text(`${order.totalPrice}$`, 135, y - 15);

        pdfDoc.end();

        writeStream.on('finish', () => {
            res.download(invoicePath, 'invoice.pdf', (err) => {
                console.error(err);
                if (err) return next(err);
            });
        });

        writeStream.on('error', (err) => {
            console.error(err);
            return next(err);
        });
    }
    catch (err) {
        return next(err);
    }
}