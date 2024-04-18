const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req, res, next) => {
    Product.getAllProducts()
        .then(([rows, fields]) => {
            res.render('shop/index', {
                prods: rows,
                pageTitle: 'Shop',
                path: '/'
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getProducts = (req, res, next) => {
    Product.getAllProducts()
        .then(([rows, fields]) => {
            res.render('shop/product-list', {
                prods: rows,
                pageTitle: 'All Products',
                path: '/products'
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getProductDetails = (req, res, next) => {
    Product.getProductByID(req.params.productID)
        .then(([rows, fields]) => {
            const product = rows[0];
            res.render('shop/product-detail', {
                pageTitle: product.title,
                product: product,
                path: '/products'
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getCart = (req, res, next) => {
    Cart.getCart()
        .then(([rows, fields]) => {
            let total_price = 0;
            const cart_products = [];

            for (let row of rows) {
                cart_products.push({
                    productData: new Product(row.id, row.title, row.price, row.description, row.imagUrl),
                    qty: row.quantity
                });
                total_price += row.price * row.quantity;
            }

            console.log(total_price);
            res.render('shop/cart', {
                pageTitle: 'Cart',
                path: '/cart',
                products: cart_products
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.addToCart = (req, res, next) => {
    Cart.addProduct(req.body.productId)
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.deleteCartItem = (req, res, next) => {
    Cart.deleteProduct(req.body.productId)
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
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
