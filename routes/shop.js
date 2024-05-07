const express = require('express');
const router = express.Router();
const shop_controller = require('../controllers/shop');
const { requireUser } = require('../route protection/auth');

router.get('/', shop_controller.getIndex);

router.get('/products', shop_controller.getProducts);

router.get('/products/:productId', shop_controller.getProductDetails);

router.get('/cart', requireUser, shop_controller.getCart);

router.post('/cart', requireUser, shop_controller.addToCart);

router.post('/cart-delete-item', requireUser, shop_controller.deleteCartItem);

router.post('/create-order', requireUser, shop_controller.CreateOrder);

router.get('/orders', requireUser, shop_controller.getOrders);

module.exports = router;
