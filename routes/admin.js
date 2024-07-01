const { Router } = require('express');
const router = Router();
const admin_controller = require('../controllers/admin');
const { requireUser } = require('../middlewares/authorization/auth');
const { ProductValidation } = require('../middlewares/validation/product');
const { authorizeProductModification } = require('../middlewares/authorization/user');
const { checkProductExistence } = require('../middlewares/check existence');

router.use(requireUser);

router.get('/add-product', admin_controller.getAddProduct);

router.post('/add-product', ProductValidation, admin_controller.postAddProduct);

router.get('/products', admin_controller.getProducts);

router.get('/edit-product/:productId', checkProductExistence, authorizeProductModification, admin_controller.getEditProduct);

router.post('/edit-product', checkProductExistence, authorizeProductModification, ProductValidation, admin_controller.postEditProduct);

router.post('/delete-product', checkProductExistence, authorizeProductModification, admin_controller.postDeleteProduct);

module.exports = router;