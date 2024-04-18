const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: req.query.edit
    });
};

exports.postAddProduct = (req, res, next) => {
    const product = new Product(null, req.body.title, req.body.price, req.body.description, req.body.imageUrl);
    product.save()
        .then(() => {
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getEditProduct = (req, res, next) => {
    const edit_mode = req.query.edit;
    const id = req.params.productId;

    Product.getProductByID(id)
        .then(([rows, fields]) => {
            const product = rows[0];
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                product: product,
                editing: edit_mode
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postEditProduct = (req, res, next) => {
    const product = new Product(req.body.productId, req.body.title, req.body.price, req.body.description,
        req.body.imageUrl);
    product.save()
        .then(() => {
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postDeleteProduct = (req, res, next) => {
    Product.delete(req.body.productId)
        .then(() => {
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getProducts = (req, res, next) => {
    Product.getAllProducts()
        .then(([rows, fields]) => {
            res.render('admin/products', {
                prods: rows,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            });
        })
        .catch(err => {
            console.log(err);
        })
};
