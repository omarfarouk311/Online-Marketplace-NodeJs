const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { restrictLogin } = require('../route protection/auth');

router.get('/login', restrictLogin, authController.getLogin);

router.post('/login', restrictLogin, authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', restrictLogin, authController.getSignup);

router.post('/signup', restrictLogin, authController.postSignup);

router.get('/reset', restrictLogin, authController.getReset);

router.post('/reset', restrictLogin, authController.postReset);

router.get('/reset/:token', restrictLogin, authController.getChangePassword);

router.post('/new-password', restrictLogin, authController.postChangePassword);

module.exports = router;
