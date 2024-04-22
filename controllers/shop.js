const Product = require('../models/product');

exports.getIndex = async (req, res, next) => {
    try {
        const products = await Product.findAll();
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/'
        });
    }
    catch (err) {
        console.log(err);
    }
};

exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.findAll();
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products'
        });
    }
    catch (err) {
        console.log(err);
    }
};

exports.getProductDetails = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.productID);
        res.render('shop/product-detail', {
            pageTitle: product.title,
            product: product,
            path: '/products'
        });
    }
    catch (err) {
        console.log(err);
    }
};

exports.getCart = async (req, res, next) => {
    try {
        let total_price = 0;
        const cart_products = await req.user.cart.getProducts();

        for (let product of cart_products) {
            total_price += product.price * product.cartItem.quantity;
        }
        console.log(total_price);

        res.render('shop/cart', {
            pageTitle: 'Cart',
            path: '/cart',
            products: cart_products
        });
    }
    catch (err) {
        console.log(err);
    }
};

exports.addToCart = async (req, res, next) => {
    try {
        const products = await req.user.cart.getProducts({ where: { id: req.body.productId } });
        if (!products.length) {
            const product = await Product.findByPk(req.body.productId);
            await req.user.cart.addProduct(product, { through: { quantity: 1 } });
        }
        else {
            await products[0].cartItem.increment('quantity', { by: 1 });
        }
        res.redirect('/cart');
    }
    catch (err) {
        console.log(err);
    }
};

exports.deleteCartItem = async (req, res, next) => {
    try {
        const products = await req.user.cart.getProducts({ where: { id: req.body.productId } });
        await req.user.cart.removeProduct(products[0]);
        res.redirect('/cart');
    }
    catch (err) {
        console.log(err);
    }
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    });
};

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders'
    });
};
