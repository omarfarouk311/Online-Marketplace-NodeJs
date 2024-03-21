const express = require('express');
const router = express.Router();
const path = require('path');
const root_dir = require('../util/path');

router.get('/add-product', (req, res, next) => {
    res.sendFile(path.join(root_dir, 'views', 'add-product.html'));
});

router.post('/add-product', (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
});

module.exports = router;
