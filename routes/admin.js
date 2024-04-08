const express = require('express');
const router = express.Router();
const admin_controller = require('../controllers/admin');

router.get('/add-product', admin_controller.getAddProduct);

router.post('/add-product', admin_controller.postAddProduct);

router.get('/products', admin_controller.getProducts);

module.exports = router;
