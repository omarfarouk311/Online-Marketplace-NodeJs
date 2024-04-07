const express = require('express');
const router = express.Router();
const shop_controller = require('../controllers/products');

router.get('/', shop_controller.getProducts);

module.exports = router;
