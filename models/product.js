const Cart = require('../models/cart');
const db = require('../util/database');

module.exports = class Product {
    constructor(id, title, price, description, imageUrl) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    save() {
        if (!this.id) {
            return db.execute('INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ? , ?)',
                [this.title, this.price, this.description, this.imageUrl]);
        }
        else {
            return db.execute('UPDATE products SET title = ?, price = ?, description = ?, imageUrl = ? WHERE id = ?',
                [this.title, this.price, this.description, this.imageUrl, this.id]);
        }
    }

    static delete(id) {
        return db.execute('DELETE FROM products WHERE id = ?', [id]);
    }

    static getAllProducts() {
        return db.execute('SELECT * FROM products');
    }

    static getProductByID(id) {
        return db.execute('SELECT * FROM products WHERE id = ?', [id]);
    }
};
