const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.get('/', authController.getLogin);

router.post('/', authController.postLogin);

module.exports = router;
