const fs = require('fs');
const path = require('path');
const root_dir = require('../util/path');
const p = path.join(root_dir, 'data', 'cart.json');

module.exports = class Cart {
    static addProduct(id) {
        fs.readFile(p, (err, data) => {
            let cart = [];
            if (!err) cart = JSON.parse(data);

            const product = cart.find(prod => prod.id === id);
            if (product) {
                ++product.qty;
            }
            else {
                cart.push({ id: id, qty: 1 });
            }

            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            });
        });
    }

    static deleteProduct(id) {
        fs.readFile(p, (err, data) => {
            if (err) return;
            const cart = JSON.parse(data);
            const idx = cart.findIndex(prod => prod.id === id);
            if (idx === -1) return;
            cart.splice(idx, 1);

            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            });
        });
    }

    static getCart(cb) {
        fs.readFile(p, (err, data) => {
            if (err) cb(null);
            else cb(JSON.parse(data));
        });
    }
}
