const express = require('express');
const BodyParser = require('body-parser');
const path = require('path');
const admin_data = require('./routes/admin');
const shop_router = require('./routes/shop');
const app = express();

app.set('view engine', 'ejs');

app.set('views', 'views');

app.use(BodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', admin_data.routes);

app.use(shop_router);

app.use((req, res) => {
    res.status(404).render('404', { pageTitle: 'page not found', path: '/404' })
});

app.listen(3000);
