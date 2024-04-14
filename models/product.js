const fs = require('fs');
const path = require('path');
const root_dir = require('../util/path');
const p = path.join(root_dir, 'data', 'products.json');
const Cart = require('../models/cart');

function getProductsFromFile(cb) {
    fs.readFile(p, (err, data) => {
        if (err) cb([]);
        else cb(JSON.parse(data));
    });
};

module.exports = class Product {
    static cnt = 1;

    constructor(id, title, price, description, imageUrl) {
        this.id = (id ? id : (Product.cnt++).toString());
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    save() {
        getProductsFromFile(products => {
            const idx = products.findIndex(prod => prod.id === this.id);
            if (!products[idx]) {
                products.push(this);
            }
            else {
                const old_price = products[idx].price;
                const new_price = this.price;
                products[idx] = this;
                if (old_price !== new_price) {
                    Cart.modifyTotalPrice(this.id, old_price, new_price);
                }
            }

            fs.writeFile(p, JSON.stringify(products), err => {
                console.log(err);
            });
        });
    }

    static delete(id) {
        getProductsFromFile(products => {
            const idx = products.findIndex(prod => prod.id === id);
            const price = products[idx].price;
            products.splice(idx, 1);
            fs.writeFile(p, JSON.stringify(products), err => {
                if (!err) {
                    Cart.deleteProduct(id, price);
                }
            });
        });
    }

    static getAllProducts(cb) {
        getProductsFromFile(cb);
    }

    static getProductByID(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(prod => prod.id === id);
            cb(product);
        })
    }
};
