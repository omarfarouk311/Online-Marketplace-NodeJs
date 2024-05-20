const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/user');
const { ObjectId } = require('mongodb');
const getDb = require('../util/database').getDb;
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const { validationResult } = require('express-validator');

const transporter = nodemailer.createTransport(mg({
    auth: {
        api_key: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN
    }
}));

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        errorMessage: undefined,
        email: undefined,
        password: undefined,
        validationErrors: {}
    });
}

exports.postLogin = async (req, res, next) => {
    const { email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            pageTitle: 'Login',
            path: '/login',
            errorMessage: errors.array()[0].msg,
            email: email,
            password: password,
            validationErrors: { email: true, password: true }
        });
    }

    try {
        const user = await User.findByEmail(email);
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).render('auth/login', {
                pageTitle: 'Login',
                path: '/login',
                errorMessage: 'Invalid email or password',
                email: email,
                password: password,
                validationErrors: { email: true, password: true }
            });
        }

        req.session.userId = user._id;
        return req.session.save(err => {
            if (err) return next(err);
            res.redirect('/');
        });
    }
    catch (err) {
        return next(err);
    }
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) return next(err);
        res.redirect('/');
    });
}

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        pageTitle: 'Signup',
        path: '/signup',
        errorMessage: undefined,
        email: undefined,
        password: undefined,
        confirmPassword: undefined,
        validationErrors: {}
    });
}

exports.postSignup = async (req, res, next) => {
    const { email, password, confirmPassword } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const validationErrors = errors.mapped();
        return res.status(422).render('auth/signup', {
            pageTitle: 'Signup',
            path: '/signup',
            errorMessage: errors.array()[0].msg,
            email: email,
            password: password,
            confirmPassword: confirmPassword,
            validationErrors: validationErrors
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 15);
        const user = new User(email, hashedPassword, [], [], []);
        await user.saveUser();

        res.redirect('/login');
        transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to marketplace!',
            html: '<h2>Thank you for choosing our service!</h2>'
        }).catch(err => {
            console.log(err);
        });
    }
    catch (err) {
        return next(err);
    }
}

exports.getReset = async (req, res, next) => {
    res.render('auth/reset', {
        pageTitle: 'Reset password',
        path: '/reset',
        errorMessage: undefined,
        email: undefined,
        validationErrors: {}
    });
}

exports.postReset = async (req, res, next) => {
    const email = req.body.email;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const validationErrors = errors.mapped();
        return res.status(422).render('auth/reset', {
            pageTitle: 'Reset password',
            path: '/reset',
            errorMessage: errors.array()[0].msg,
            email: email,
            validationErrors: validationErrors
        });
    }

    try {
        const user = await User.findByEmail(email);
        const updatedUser = new User(user.email, user.password, user.products, user.cart, user.orders,
            user.resetToken, user.resetTokenExpiry, user._id);

        crypto.randomBytes(32, async (err, buf) => {
            if (err) {
                return res.status(500).render('auth/reset', {
                    pageTitle: 'Reset password',
                    path: '/reset',
                    errorMessage: 'Something went wrong, please try again',
                    email: email,
                    validationErrors: {}
                });
            }

            updatedUser.resetToken = buf.toString('hex');
            updatedUser.resetTokenExpiry = Date.now() + 1000 * 60 * 15;
            await updatedUser.updateUser();

            res.redirect('/');
            transporter.sendMail({
                to: req.body.email,
                from: process.env.SENDER_EMAIL,
                subject: 'Password reset',
                html: `
            <h2>You requested a password reset</h2>
            <h3>Click this <a href="http://localhost:3000/reset/${updatedUser.resetToken}">link</a> to set a new password.</h3>
          `
            }).catch(err => {
                console.log(err);
            });
        });
    }
    catch (err) {
        return next(err);
    }
}

exports.getChangePassword = async (req, res, next) => {
    const db = getDb();
    const token = req.params.token;

    try {
        const user = await db.collection('users').findOne(
            { resetToken: token, resetTokenExpiry: { $gt: Date.now() } }
        );
        const expired = user ? false : true;

        res.render('auth/new-password', {
            pageTitle: 'Reset password',
            path: '/reset',
            expired: expired,
            userId: user ? user._id.toString() : null,
            errorMessage: undefined,
            password: undefined,
            confirmPassword: undefined,
            passwordToken: token,
            validationErrors: {}
        });
    }
    catch (err) {
        return next(err);
    }
}

exports.postChangePassword = async (req, res, next) => {
    const db = getDb();
    const { password, confirmPassword, passwordToken } = req.body;
    const userId = ObjectId.createFromHexString(req.body.userId);

    try {
        const user = await db.collection('users').findOne(
            { _id: userId, resetToken: passwordToken, resetTokenExpiry: { $gt: Date.now() } }
        );

        if (!user) {
            return res.status(401).render('auth/new-password', {
                pageTitle: 'Reset password',
                path: '/reset',
                expired: true,
                userId: userId,
                errorMessage: 'Expired link',
                password: password,
                confirmPassword: confirmPassword,
                passwordToken: passwordToken,
                validationErrors: {}
            });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const validationErrors = errors.mapped();
            const expired = validationErrors.passwordToken ? true : false;

            return res.status(422).render('auth/new-password', {
                pageTitle: 'Reset password',
                path: '/reset',
                expired: expired,
                userId: userId,
                errorMessage: errors.array()[0].msg,
                password: password,
                confirmPassword: confirmPassword,
                passwordToken: passwordToken,
                validationErrors: validationErrors
            });
        }

        const email = user.email;
        const hashedPassword = await bcrypt.hash(password, 15);
        const updatedUser = new User(email, hashedPassword, user.products, user.cart, user.orders,
            null, null, user._id);
        await updatedUser.updateUser();

        res.redirect('/login');
        db.collection('sessions').deleteMany({ "session.userId": userId });
        transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Password Reset',
            html: '<h2>Your password has been changed successfully.</h2>'
        }).catch(err => {
            console.log(err);
        });
    }
    catch (err) {
        return next(err);
    }
}
