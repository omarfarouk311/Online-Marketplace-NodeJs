require('dotenv').config();
const express = require('express');
const fs = require('fs').promises;
const crypto = require('crypto');
const path = require('path');
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const authRouter = require('./routes/auth');
const errorsController = require('./controllers/errors');
const session = require('express-session');
const { mongoConnect } = require('./util/database');
const { store } = require('./util/database');
const User = require('./models/user');
const { csrfSynchronisedProtection } = require('csrf-sync').csrfSync({
    getTokenFromRequest: req => req.body.csrfToken
});
const multer = require('multer');


const app = express();
app.set('view engine', 'ejs');

const storageEngine = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            await fs.mkdir('public/images', { recursive: true });
            cb(null, 'public/images');
        }
        catch (err) {
            cb(err);
        }
    },
    filename: (req, file, cb) => {
        crypto.randomBytes(8, (err, buf) => {
            if (err) return cb(err);
            cb(null, `${buf.toString('hex')}_${file.originalname}`);
        });
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    }
    else {
        cb(null, false);
        req.invalidFileType = true;
    }
}

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

app.use(async (req, res, next) => {
    res.locals.isAuthenticated = false;
    res.locals.csrfToken = req.csrfToken();

    if (!req.session.userId) return next();
    try {
        const user = await User.findById(req.session.userId);
        if (!user) return next();
        req.user = new User(user);
        res.locals.isAuthenticated = true;
        return next();
    }
    catch (err) {
        return next(err);
    }
});

app.use('/admin', adminRouter);

app.use(authRouter);

app.use(shopRouter);

app.use(errorsController.getPageNotFound);

app.use((err, req, res, next) => {
    if (!('isAuthenticated' in res.locals)) {
        res.locals.isAuthenticated = false;
    }

    if (err.statusCode === 403) {
        return res.render('errors/403', {
            pageTitle: 'Forbidden',
            path: '/403'
        });
    }

    if (err.statusCode === 404) {
        return res.render('errors/404', {
            pageTitle: 'Page not found',
            path: '/404'
        });
    }

    return res.render('errors/500', {
        pageTitle: 'Error',
        path: '/500'
    });
});

app.listen(process.env.PORT, () => {
    mongoConnect().catch(err => {
        console.log(err);
    });
});