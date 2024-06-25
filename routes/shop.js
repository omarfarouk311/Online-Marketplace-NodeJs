const { Router } = require('express');
const router = Router();
const shop_controller = require('../controllers/shop');
const { requireUser } = require('../middlewares/authorization/auth');

router.get('/', shop_controller.getIndex);

router.get('/products', shop_controller.getProducts);

router.get('/products/:productId', shop_controller.getProductDetails);

router.use(requireUser);

router.get('/cart', shop_controller.getCart);

router.post('/cart', shop_controller.addToCart);

router.post('/cart-delete-item', shop_controller.deleteCartItem);

router.post('/create-order', shop_controller.CreateOrder);

router.get('/orders', shop_controller.getOrders);

router.get('/orders/:orderId', shop_controller.getOrderInvoice);

module.exports = router;