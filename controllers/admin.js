const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    let edit_mode = req.query.edit;
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: edit_mode
    });
};

exports.postAddProduct = (req, res, next) => {
    const product = new Product(null, req.body.title, req.body.price, req.body.description, req.body.imageUrl);
    product.save();
    res.redirect('/');
};

exports.getEditProduct = (req, res, next) => {
    const edit_mode = req.query.edit;
    const id = req.params.productId;

    Product.getProductByID(id, product => {
        if (!product) return res.redirect('/');
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            product: product,
            editing: edit_mode
        });
    });
};

exports.postEditProduct = (req, res, next) => {
    const product = new Product(req.body.productId, req.body.title, req.body.price, req.body.description,
        req.body.imageUrl);
    product.save();
    res.redirect('/admin/products');
};

exports.postDeleteProduct = (req, res, next) => {
    Product.delete(req.body.productId);
    res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
    Product.getAllProducts(products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        });
    });
};
