const express = require('express');
const router = express.Router();
const admin_controller = require('../controllers/admin');
const { requireUser } = require('../reused middlewares/auth');

router.get('/add-product', requireUser, admin_controller.getAddProduct);

router.post('/add-product', requireUser, admin_controller.postAddProduct);

router.get('/products', requireUser, admin_controller.getProducts);

router.get('/edit-product/:productId', requireUser, admin_controller.getEditProduct);

router.post('/edit-product', requireUser, admin_controller.postEditProduct);

router.post('/delete-product', requireUser, admin_controller.postDeleteProduct);

module.exports = router;
