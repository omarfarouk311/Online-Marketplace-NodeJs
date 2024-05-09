require('dotenv').config();
const express = require('express');
const path = require('path');
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const authRouter = require('./routes/auth');
const errorsController = require('./controllers/errors');
const session = require('express-session');
const { mongoConnect } = require('./util/database');
const { store } = require('./util/database');
const User = require('./models/user');
const flash = require('connect-flash');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: [process.env.COOKIE_SECRET1],
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { maxAge: 60 * 60 * 1000 }
}));

app.use(flash());

app.use(async (req, res, next) => {
    try {
        if (req.session.userId) {
            const user = await User.findById(req.session.userId);
            req.user = new User(user.email, user.password, user.products, user.cart, user.orders, user._id);
        }
        res.locals.isAuthenticated = req.session.isLoggedIn
        next();
    }
    catch (err) {
        console.log(err);
    }
});

app.use('/admin', adminRouter);

app.use(authRouter);

app.use(shopRouter);

app.use(errorsController.getPageNotFound);

mongoConnect(() => {
    app.listen(3000);
});
