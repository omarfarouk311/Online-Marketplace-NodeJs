const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: req.query.edit,
        isAuthenticated: req.session.isLoggedIn
    });
};

exports.postAddProduct = async (req, res, next) => {
    const product = new Product(req.body.title, req.body.price, req.body.description, req.body.imageUrl,
        req.body.quantity);
    try {
        await req.user.saveProduct(product);
    }
    catch (err) {
        console.log(err);
    }
    res.redirect('/admin/products');
};

exports.getEditProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.productId);
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            product: product,
            editing: req.query.edit,
            isAuthenticated: req.session.isLoggedIn
        });
    }
    catch (err) {
        console.log(err);
    }
};

exports.postEditProduct = async (req, res, next) => {
    const product = new Product(req.body.title, req.body.price, req.body.description, req.body.imageUrl,
        req.body.quantity, req.body.productId);
    try {
        await req.user.saveProduct(product);
    }
    catch (err) {
        console.log(err);
    }
    res.redirect('/admin/products');
};

exports.postDeleteProduct = async (req, res, next) => {
    try {
        await req.user.deleteProduct(req.body.productId);
    }
    catch (err) {
        console.log(err);
    }
    res.redirect('/admin/products');
};

exports.getProducts = async (req, res, next) => {
    try {
        const products = await req.user.fetchUserProducts();
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products',
            isAuthenticated: req.session.isLoggedIn
        });
    }
    catch (err) {
        console.log(err);
    }
};
