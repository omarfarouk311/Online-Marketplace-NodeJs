const bcrypt = require('bcryptjs');
const { getDb } = require('../util/database');
const User = require('../models/user');

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
    const db = getDb();
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await db.collection('users').findOne({ email: email });
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
    const [message, email, password, confirmedPassword] = errors;

    res.render('auth/signup', {
        pageTitle: 'Signup',
        path: '/signup',
        errorMessage: message,
        email: email,
        password: password,
        confirmPassword: confirmedPassword
    });
}

exports.postSignup = async (req, res, next) => {
    const db = getDb();
    const email = req.body.email;
    const password = req.body.password;
    const confirmedPassword = req.body.confirmPassword;

    try {
        const userDoc = await db.collection('users').findOne({ email: email });
        if (userDoc) {
            req.flash('error', ['Email already exists', email, password, confirmedPassword]);
            return res.redirect('/signup');
        }
    }
    catch (err) {
        console.log(err);
    }

    if (password.length < 8) {
        req.flash('error', ['Password length must be at least 8 characters', email, password, confirmedPassword]);
        return res.redirect('/signup');
    }

    if (confirmedPassword !== password) {
        req.flash('error', ["Password and confirmation password doesn't match", email, password, confirmedPassword]);
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
}
