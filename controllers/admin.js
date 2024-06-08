const Product = require('../models/product');
const { validationResult } = require('express-validator');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: req.query.edit,
        errorMessage: undefined,
        hasError: false,
        validationErrors: {}
    });
};

exports.postAddProduct = async (req, res, next) => {
    const product = new Product(req.body);
    const image = req.file;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const validationErrors = errors.mapped();

        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            errorMessage: errors.array()[0].msg,
            hasError: true,
            validationErrors: validationErrors,
            product: product
        });
    }

    if (!image) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            errorMessage: (req.invalidFileType ? "Attached file isn't an image" : 'No image selected for the product'),
            hasError: true,
            validationErrors: {},
            product: product
        });
    }

    product.imageUrl = image.path;
    try {
        await req.user.saveProduct(product);
        return res.redirect('/admin/products');
    }
    catch (err) {
        return next(err);
    }
};

exports.getEditProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.redirect('/admin/products');
        }

        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: req.query.edit,
            errorMessage: undefined,
            hasError: false,
            validationErrors: {},
            product: product
        });
    }
    catch (err) {
        return next(err);
    }
};

exports.postEditProduct = async (req, res, next) => {
    const product = new Product(req.body);
    const image = req.file;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const validationErrors = errors.mapped();

        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: true,
            errorMessage: errors.array()[0].msg,
            hasError: true,
            validationErrors: validationErrors,
            product: product
        });
    }

    if (req.invalidFileType) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: true,
            errorMessage: "Attached file isn't an image",
            hasError: true,
            validationErrors: {},
            product: product
        });
    }

    if (image) {
        product.imageUrl = image.path;
    }

    try {
        await req.user.saveProduct(product);
        return res.redirect('/admin/products');
    }
    catch (err) {
        return next(err);
    }
};

exports.postDeleteProduct = async (req, res, next) => {
    try {
        await req.user.deleteProduct(req.body.productId);
        return res.redirect('/admin/products');
    }
    catch (err) {
        return next(err);
    }
};

exports.getProducts = async (req, res, next) => {
    try {
        const products = await req.user.fetchUserProducts();
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products',
        });
    }
    catch (err) {
        return next(err);
    }
};
