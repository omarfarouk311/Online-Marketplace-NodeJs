require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const { mongoConnect, store } = require('./util/database');
const { csrfSynchronisedProtection } = require('csrf-sync').csrfSync({
    getTokenFromRequest: req => req.body.csrfToken
});
const { storageEngine, fileFilter } = require('./util/multer configurations');
const multer = require('multer');
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const authRouter = require('./routes/auth');
const errorsController = require('./controllers/errors');
const { authenticateUser } = require('./controllers/auth');


const app = express();
app.set('view engine', 'ejs');

app.use(express.json());
app.use(multer({ storage: storageEngine, fileFilter: fileFilter }).single('image'));
app.use(express.urlencoded({ extended: true }));

//statically serving products images
app.use('/public', express.static(path.join(__dirname, 'public')));
//statically serving other public files
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: [process.env.COOKIE_SECRET1],
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.use(csrfSynchronisedProtection);

app.use(authenticateUser);

app.use(authRouter);

app.use('/admin', adminRouter);

app.use(shopRouter);

app.get('/error', errorsController.get500);

app.use(errorsController.get404);

app.use(errorsController.errorHandlingMiddleware);

mongoConnect()
    .then(() => {
        app.listen(process.env.PORT);
    })
    .catch(err => {
        console.error('failed to connect to the database', err);
        process.exit(1);
    });