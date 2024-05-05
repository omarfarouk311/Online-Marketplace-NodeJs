require('dotenv').config();
const express = require('express');
const BodyParser = require('body-parser');
const path = require('path');
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const authRouter = require('./routes/auth');
const errorsController = require('./controllers/errors');
const session = require('express-session');
const { mongoConnect } = require('./util/database');
const { store } = require('./util/database');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');

app.use(BodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: [process.env.SESSION_SECRET],
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { maxAge: 60 * 60 * 1000 }
}));

app.use(async (req, res, next) => {
    if (req.session && req.session.userId) {
        const user = await User.findById(req.session.userId);
        req.user = new User(user.username, user.email, user.products, user.cart, user.orders, user._id);
    }
    next();
})

app.use('/admin', adminRouter);

app.use('/login', authRouter);

app.use(shopRouter);

app.use(errorsController.getPageNotFound);

mongoConnect(() => {
    app.listen(3000);
});
