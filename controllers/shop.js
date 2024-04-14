const Product = require('../models/product');
const Cart = require('../models/cart');

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
    const cart_products = [];
    let total_price = 0;
    Cart.getCart(cart => {
        Product.getAllProducts(products => {
            cart.forEach(element => {
                const product = products.find(prod => prod.id === element.id);
                cart_products.push({ productData: product, qty: element.qty });
                total_price += +product.price * element.qty;
            });

            console.log(total_price);
            res.render('shop/cart', {
                pageTitle: 'Cart',
                path: '/cart',
                products: cart_products
            });
        });
    });
};

exports.addToCart = (req, res, next) => {
    let product_id = req.body.productId;
    Product.getProductByID(product_id, product => {
        Cart.addProduct(product_id, product.price);
    })
    res.redirect('/cart');
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
