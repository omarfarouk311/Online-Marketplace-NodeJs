const { body } = require('express-validator');
const User = require('../../models/user');

exports.loginValidation = [
    body('email', 'Invalid email or password')
        .isEmail()
    ,
    body('password', 'Invalid Email or password')
        .isLength({ min: 8 })
        .trim()
]

exports.signupValidation = [
    body('email')
        .isEmail()
        .withMessage('Invalid Email address')
        .bail()
        .custom(async email => {
            const user = await User.findByEmail(email);
            if (user) throw new Error('Email already exists');
            return true;
        })
    ,
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password length must be at least 8 characters')
        .trim()
    ,
    body('confirmPassword', "Password and confirmation password must match")
        .custom((confirmPassword, { req }) => {
            if (confirmPassword === req.body.password) return true;
            throw new Error();
        })
        .trim()
]

exports.resetValidation = [
    body('email', 'Invalid Email address')
        .isEmail()
        .bail()
        .custom(async email => {
            const user = await User.findByEmail(email);
            if (!user) throw new Error();
            return true;
        })
]

exports.changePasswordValidation = [
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password length must be at least 8 characters')
        .trim()
    ,
    body('confirmPassword', "Password and confirmation password doesn't match")
        .custom((confirmPassword, { req }) => {
            if (confirmPassword === req.body.password) return true;
            throw new Error();
        })
        .trim()
]
