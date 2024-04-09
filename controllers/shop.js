const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
    Product.getAllProducts(products => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/'
        });
    });
};

exports.getProducts = (req, res, next) => {
    Product.getAllProducts(products => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products'
        });
    });
};

exports.getProductDetails = (req, res, next) => {
    const product_ID = req.params.productID;
    Product.getProductByID(product_ID, product => {
        res.render('shop/product-detail', {
            pageTitle: product.title,
            product: product,
            path: '/products'
        });
    });
};

exports.getCart = (req, res, next) => {
    res.render('shop/cart', {
        pageTitle: 'Cart',
        path: '/cart'
    });
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
