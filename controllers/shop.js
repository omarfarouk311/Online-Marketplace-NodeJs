const Product = require('../models/product');

exports.getIndex = async (req, res, next) => {
    const products = await Product.fetchAll();
    res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
    });
};

exports.getProducts = async (req, res, next) => {
    const products = await Product.fetchAll();
    res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
    });
};

exports.getProductDetails = async (req, res, next) => {
    const product = await Product.findById(req.params.productId);
    res.render('shop/product-detail', {
        pageTitle: product.title,
        product: product,
        path: '/products'
    });
};

exports.getCart = async (req, res, next) => {
    const cartProducts = await req.user.getCart();

    let totalPrice = 0;
    for (const prod of cartProducts) {
        totalPrice += prod.price * prod.quantity;
    }

    res.render('shop/cart', {
        pageTitle: 'Cart',
        path: '/cart',
        products: cartProducts,
        totalPrice: totalPrice
    });
};

exports.addToCart = async (req, res, next) => {
    const added = await req.user.addToCart(req.body.productId)
    if (added) res.redirect('/cart');
    else res.redirect('/');
};

exports.deleteCartItem = async (req, res, next) => {
    await req.user.deleteFromCart(req.body.productId);
    res.redirect('/cart');
};

exports.CreateOrder = async (req, res, next) => {
    res.redirect('/orders');
};

exports.getOrders = async (req, res, next) => {
    const user_orders = [];
    res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders',
        orders: user_orders
    });
}
