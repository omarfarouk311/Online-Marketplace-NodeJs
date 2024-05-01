const express = require('express');
const BodyParser = require('body-parser');
const path = require('path');
const admin_router = require('./routes/admin');
const shop_router = require('./routes/shop');
const errors_controller = require('./controllers/errors');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(BodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, res, next) => {
    const user = await User.findById('662d1f851af4b49fbe4f576c');
    req.user = new User(user.username, user.email, user.products, user.cart, user.orders, user._id);
    next();
})


app.use('/admin', admin_router);

app.use('/', shop_router);

app.use(errors_controller.getPageNotFound);

mongoConnect(() => {
    app.listen(3000);
});
