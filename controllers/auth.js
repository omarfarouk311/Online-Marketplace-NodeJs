const bcrypt = require('bcryptjs');
const { getDb } = require('../util/database');
const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isAuthenticated: req.session.isLoggedIn
    });
}

exports.postLogin = (req, res, next) => {
    req.session.userId = '662d1f851af4b49fbe4f576c';
    req.session.isLoggedIn = true;
    req.session.save(err => {
        console.log(err);
        res.redirect('/');
    });
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
}

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        pageTitle: 'Signup',
        path: '/signup',
        isAuthenticated: req.session.isLoggedIn
    });
}

exports.postSignup = async (req, res, next) => {
    const db = getDb();
    const email = req.body.email;

    try {
        const userDoc = await db.collection('users').findOne({ email: email });
        if (userDoc) {
            return res.redirect('/signup');
        }
    }
    catch (err) {
        console.log(err);
    }

    const password = req.body.password;
    const confirmedPassword = req.body.confirmedPassword;
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
