const express = require('express');
const router = express.Router();
const path = require('path');
const root_dir = require('../util/path');

products = [];

router.get('/add-product', (req, res, next) => {
    res.render('add-product', { pageTitle: 'add product', path: '/add-product' });
});

router.post('/add-product', (req, res, next) => {
    this.products.push({ title: req.body.title });
    res.redirect('/');
});

exports.routes = router;
exports.products = products;
