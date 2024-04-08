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
    constructor(title, price, description, image_url) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.image_url = image_url;
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
};
