const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const cart_item = require('./models/cart item');

module.exports = () => {
    User.hasMany(Product, { constraints: true, onDelete: 'CASCADE' });
    User.hasOne(Cart, { constraints: true, onDelete: 'CASCADE' });
    Cart.belongsToMany(Product, { through: cart_item });
    Product.belongsToMany(Cart, { through: cart_item });
};
