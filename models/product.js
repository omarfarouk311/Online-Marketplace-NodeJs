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
    constructor(id, title, price, description, imageUrl) {
        this.id = (id ? id : Math.random().toString());
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
                products[idx] = this;
            }

            fs.writeFile(p, JSON.stringify(products), err => {
                console.log(err);
            });
        });
    }

    static delete(id) {
        getProductsFromFile(products => {
            const idx = products.findIndex(prod => prod.id === id);
            products.splice(idx, 1);

            fs.writeFile(p, JSON.stringify(products), err => {
                if (!err) {
                    Cart.deleteProduct(id);
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
