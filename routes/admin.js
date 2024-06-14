const { Router } = require('express');
const router = Router();
const admin_controller = require('../controllers/admin');
const { requireUser } = require('../authorization/auth');
const { ProductValidation } = require('../validation/product');
const { authorizeProductModification } = require('../middlewares/authorization/user');

router.get('/add-product', requireUser, admin_controller.getAddProduct);

router.post('/add-product', requireUser, ProductValidation, admin_controller.postAddProduct);

router.get('/products', requireUser, admin_controller.getProducts);

router.get('/edit-product/:productId', requireUser, authorizeProductModification, admin_controller.getEditProduct);

router.post('/edit-product', requireUser, authorizeProductModification, ProductValidation, admin_controller.postEditProduct);

router.post('/delete-product', requireUser, authorizeProductModification, admin_controller.postDeleteProduct);

module.exports = router;
