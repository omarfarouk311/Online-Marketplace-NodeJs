const express = require('express');
const router = express.Router();
const path = require('path');
const root_dir = require('../util/path');

products = [];

router.get('/add-product', (req, res, next) => {
    res.sendFile(path.join(root_dir, 'views', 'add-product.html'));
});

router.post('/add-product', (req, res, next) => {
    this.products.push({ pageTitle: req.body.title, path: '/add-product' });
    res.redirect('/');
});

exports.routes = router;
exports.products = products;
