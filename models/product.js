const fs = require('fs');
const path = require('path');
const root_dir = require('../util/path');
const p = path.join(root_dir, 'data', 'products.json');

function getProductsFromFile(cb) {
    fs.readFile(p, (err, data) => {
        if (err) cb([]);
        else cb(JSON.parse(data));
    });
};

module.exports = class Product {
    static cnt = 1;

    constructor(title, price, description, imageUrl) {
        this.id = (Product.cnt++).toString();
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    save() {
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), err => {
                console.log(err);
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
