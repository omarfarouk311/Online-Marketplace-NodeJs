const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/user');
const { ObjectId } = require('mongodb');
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const getDb = require('../util/database').getDb;

const transporter = nodemailer.createTransport(mg({
    auth: {
        api_key: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN
    }
}));

exports.getLogin = (req, res, next) => {
    const errors = req.flash('error');
    const [message, email, password] = errors;

    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        errorMessage: message,
        email: email,
        password: password
    });
}

exports.postLogin = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await User.findByEmail(email);
        if (!user || !await bcrypt.compare(password, user.password)) {
            req.flash('error', ['Invalid email or password', email, password]);
            return res.redirect('/login');
        }
        req.session.userId = user._id;
        req.session.isLoggedIn = true;
        req.session.save(err => {
            console.log(err);
            res.redirect('/');
        });
    }
    catch (err) {
        console.log(err);
        res.redirect('/login');
    }
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
}

exports.getSignup = (req, res, next) => {
    const errors = req.flash('error');
    const [message, email, password, confirmPassword] = errors;

    res.render('auth/signup', {
        pageTitle: 'Signup',
        path: '/signup',
        errorMessage: message,
        email: email,
        password: password,
        confirmPassword: confirmPassword
    });
}

exports.postSignup = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    try {
        const user = await User.findByEmail(email);
        if (user) {
            req.flash('error', ['Email already exists', email, password, confirmPassword]);
            return res.redirect('/signup');
        }
    }
    catch (err) {
        console.log(err);
    }

    if (password.length < 8) {
        req.flash('error', ['Password length must be at least 8 characters', email, password, confirmPassword]);
        return res.redirect('/signup');
    }

    if (confirmPassword !== password) {
        req.flash('error', ["Password and confirmation password doesn't match", email, password, confirmPassword]);
        return res.redirect('/signup');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 15);
        const user = new User(email, hashedPassword, [], [], []);
        await user.saveUser();
        res.redirect('/login');
    }
    catch (err) {
        console.log(err);
    }

    transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: 'Welcome to marketplace!',
        html: '<h2>Thank you for choosing our service!</h2>'
    }).catch(err => {
        console.log(err);
    });
}

exports.getReset = async (req, res, next) => {
    const errors = req.flash('error');
    const [message, email] = errors;
    res.render('auth/reset', {
        pageTitle: 'Reset password',
        path: '/reset',
        errorMessage: message,
        email: email
    });
}

exports.postReset = async (req, res, next) => {
    const email = req.body.email;

    try {
        const user = await User.findByEmail(email);
        if (!user) {
            req.flash('error', ["Email doesn't exist", email]);
            return res.redirect('/reset');
        }

        const updatedUser = new User(user.email, user.password, user.products, user.cart, user.orders,
            user.resetToken, user.resetTokenExpiry, user._id);
        crypto.randomBytes(32, async (err, buf) => {
            if (err) {
                console.log(err);
                return res.redirect('/reset');
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
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${updatedUser.resetToken}">link</a> to set a new password.</p>
          `
            }).catch(err => {
                console.log(err);
            });
        });
    }
    catch (err) {
        console.log(err);
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
        const errors = req.flash('error');
        const [message, password, confirmPassword] = errors;

        res.render('auth/new-password', {
            pageTitle: 'Reset password',
            path: '/reset',
            expired: expired,
            userId: user ? user._id.toString() : null,
            errorMessage: message,
            password: password,
            confirmPassword: confirmPassword,
            passwordToken: token
        });
    }
    catch (err) {
        console.log(err);
    }
}

exports.postChangePassword = async (req, res, next) => {
    const db = getDb();
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const resetToken = req.body.passwordToken;
    const userId = ObjectId.createFromHexString(req.body.userId);
    let email;

    try {
        const user = await db.collection('users').findOne(
            { _id: userId, resetToken: resetToken, resetTokenExpiry: { $gt: Date.now() } }
        );

        if (!user) {
            return res.redirect(`/reset/${resetToken}`);
        }

        if (password.length < 8) {
            req.flash('error', ['Password length must be at least 8 characters', password, confirmPassword]);
            return res.redirect(`/reset/${user.resetToken}`);
        }

        if (confirmPassword !== password) {
            req.flash('error', ["Password and confirmation password doesn't match", password, confirmPassword]);
            return res.redirect(`/reset/${user.resetToken}`);
        }

        email = user.email;
        const hashedPassword = await bcrypt.hash(password, 15);
        const updatedUser = new User(user.email, hashedPassword, user.products, user.cart, user.orders,
            null, null, user._id);
        await updatedUser.updateUser();
        res.redirect('/login');
    }
    catch (err) {
        console.log(err);
    }

    db.collection('sessions').deleteMany({ "session.userId": userId });
    transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: 'Password Reset',
        html: '<h2>Your password has been changed successfully</h2>'
    }).catch(err => {
        console.log(err);
    });
}
