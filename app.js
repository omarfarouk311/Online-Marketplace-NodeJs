const express = require('express');
const BodyParser = require('body-parser');
const path = require('path');
const admin_router = require('./routes/admin');
const shop_router = require('./routes/shop');
const errors_controller = require('./controllers/errors');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const cart_item = require('./models/cart item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(BodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, res, next) => {
    try {
        req.user = await User.findByPk(1);
        req.user.cart = await req.user.getCart();
        next();
    }
    catch (err) {
        console.log(err);
    }
});

app.use('/admin', admin_router);

app.use(shop_router);

app.use(errors_controller.getPageNotFound);

User.hasMany(Product, { constraints: true, onDelete: 'CASCADE' });
User.hasOne(Cart, { constraints: true, onDelete: 'CASCADE' });
Cart.belongsToMany(Product, { through: cart_item });
Product.belongsToMany(Cart, { through: cart_item });

(async () => {
    try {
        await sequelize.sync();

        let user = await User.findByPk(1);
        if (!user) {
            user = await User.create({
                email: 'test@gmail.com',
                name: 'omar'
            });
        }

        const user_cart = await user.getCart();
        if (!user_cart) {
            await user.createCart();
        }

        app.listen(3000);
    }
    catch (err) {
        console.log(err);
    }
})();
