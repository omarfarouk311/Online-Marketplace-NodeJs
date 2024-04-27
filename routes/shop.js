const express = require('express');
const router = express.Router();
const shop_controller = require('../controllers/shop');

router.get('/', shop_controller.getIndex);

router.get('/products', shop_controller.getProducts);

router.get('/products/:productId', shop_controller.getProductDetails);

router.get('/cart', shop_controller.getCart);

router.post('/cart', shop_controller.addToCart);

router.post('/cart-delete-item', shop_controller.deleteCartItem);

router.post('/create-order', shop_controller.CreateOrder);

router.get('/orders', shop_controller.getOrders);

module.exports = router;
