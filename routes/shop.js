const express = require('express');
const router = express.Router();
const shop_controller = require('../controllers/shop');

router.get('/', shop_controller.getIndex);

router.get('/products', shop_controller.getProducts);

router.get('/cart', shop_controller.getCart);

router.get('/checkout', shop_controller.getCheckout);

module.exports = router;
