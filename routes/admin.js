const express = require('express');
const router = express.Router();
const shop_controller = require('../controllers/products');

router.get('/add-product', shop_controller.getAddProduct);

router.post('/add-product', shop_controller.postAddProduct);

module.exports = router;
