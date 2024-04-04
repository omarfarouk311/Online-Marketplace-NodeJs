const express = require('express');
const router = express.Router();
const path = require('path');
const root_dir = require('../util/path');
const admin_data = require('./admin')

router.get('/', (req, res, next) => {
    res.render('shop', { prods: admin_data.products, pageTitle: 'shop' ,path: '/shop'});
});

module.exports = router;
