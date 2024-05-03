const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: req.query.edit
    });
};

exports.postAddProduct = async (req, res, next) => {
    const product = new Product(req.body.title, req.body.price, req.body.description, req.body.imageUrl,
        req.body.quantity);
    await req.user.saveProduct(product);
    res.redirect('/admin/products');
};

exports.getEditProduct = async (req, res, next) => {
    const product = await Product.findById(req.params.productId);
    res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        product: product,
        editing: req.query.edit
    });
};

exports.postEditProduct = async (req, res, next) => {
    const product = new Product(req.body.title, req.body.price, req.body.description, req.body.imageUrl,
        req.body.quantity, req.body.productId);
    await req.user.saveProduct(product);
    res.redirect('/admin/products');
};

exports.postDeleteProduct = async (req, res, next) => {
    await req.user.deleteProduct(req.body.productId);
    res.redirect('/admin/products');
 };

exports.getProducts = async (req, res, next) => {
    const products = await req.user.fetchUserProducts();
    res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
    });
};
