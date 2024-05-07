const Product = require('../models/product');

exports.getIndex = async (req, res, next) => {
    const products = await Product.fetchAll();
    res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
    });
};

exports.getProducts = async (req, res, next) => {
    const products = await Product.fetchAll();
    res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
    });
};

exports.getProductDetails = async (req, res, next) => {
    const product = await Product.findById(req.params.productId);
    res.render('shop/product-detail', {
        pageTitle: product.title,
        product: product,
        path: '/products',
    });
};

exports.getCart = async (req, res, next) => {
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
};

exports.addToCart = async (req, res, next) => {
    await req.user.addToCart(req.body.productId)
    res.redirect('/cart');
};

exports.deleteCartItem = async (req, res, next) => {
    await req.user.deleteFromCart(req.body.productId);
    res.redirect('/cart');
};

exports.CreateOrder = async (req, res, next) => {
    const done = req.user.createOrder();
    if (!done) res.redirect('/cart');
    res.redirect('/orders');
};

exports.getOrders = async (req, res, next) => {
    const user_orders = await req.user.getOrders();
    res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders',
        orders: user_orders,
    });
}
