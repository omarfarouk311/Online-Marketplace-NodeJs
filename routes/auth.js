const { Router } = require('express');
const router = Router();
const authController = require('../controllers/auth');
const { restrictLogin } = require('../route protection/auth');
const authValidation = require('../validation/auth');

router.get('/login', restrictLogin, authController.getLogin);

router.post('/login', restrictLogin, authValidation.loginValidation, authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', restrictLogin, authController.getSignup);

router.post('/signup', restrictLogin, authValidation.signupValidation, authController.postSignup);

router.get('/reset', restrictLogin, authController.getReset);

router.post('/reset', restrictLogin, authValidation.resetValidation, authController.postReset);

router.get('/reset/:token', authController.getChangePassword);

router.post('/new-password', authValidation.changePasswordValidation, authController.postChangePassword);

module.exports = router;
