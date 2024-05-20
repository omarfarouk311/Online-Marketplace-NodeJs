const Product = require('../models/product');

exports.getIndex = async (req, res, next) => {
    try {
        const products = await Product.fetchAll();
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
        });
    }
    catch (err) {
        return next(err);
    }
};

exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.fetchAll();
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products',
        });
    }
    catch (err) {
        return next(err);
    }
};

exports.getProductDetails = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.productId);
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
        const user_orders = await req.user.getOrders();
        res.render('shop/orders', {
            pageTitle: 'Your Orders',
            path: '/orders',
            orders: user_orders,
        });
    }
    catch (err) {
        return next(err);
    }
}
