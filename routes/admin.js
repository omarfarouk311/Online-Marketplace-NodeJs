const express = require('express');
const router = express.Router();
const admin_controller = require('../controllers/admin');

router.get('/add-product', admin_controller.getAddProduct);

router.post('/add-product', admin_controller.postAddProduct);

router.get('/products', admin_controller.getProducts);

router.get('/edit-product/:productId', admin_controller.getEditProduct);

router.post('/edit-product', admin_controller.postEditProduct);

router.post('/delete-product', admin_controller.postDeleteProduct);

module.exports = router;
