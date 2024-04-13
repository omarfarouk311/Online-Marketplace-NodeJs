const fs = require('fs');
const path = require('path');
const root_dir = require('../util/path');
const p = path.join(root_dir, 'data', 'cart.json');

module.exports = class Cart {
    static addProduct(id, price) {
        fs.readFile(p, (err, data) => {
            let cart = { products: [], totalPrice: 0.0 };
            if (!err) cart = JSON.parse(data);

            let product = cart.products.find(prod => prod.id === id);
            if (product) {
                ++product.qty;
            }
            else {
                cart.products.push({ id: id, qty: 1 });
            }
            cart.totalPrice += +price;

            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            });
        });
    }
}
