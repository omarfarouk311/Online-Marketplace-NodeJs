const express = require('express');
const BodyParser = require('body-parser');
const path = require('path');
const admin_router = require('./routes/admin');
const shop_router = require('./routes/shop');
const errors_controller = require('./controllers/errors');
const mongoConnect = require('./util/database').mongoConnect;

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(BodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', admin_router);

app.use(shop_router);

app.use(errors_controller.getPageNotFound);

mongoConnect(() => {
    app.listen(3000);
});
