const db = require('../util/database');

module.exports = class Cart {
    static addProduct(id) {
        return db.execute('SELECT * FROM cart WHERE id = ?', [id])
            .then(([rows, fields]) => {
                if (!rows.length) {
                    return db.execute('INSERT INTO cart VALUES(?,?)', [id, 1]);
                }
                else {
                    const quantity = rows[0].quantity;
                    return db.execute('UPDATE cart SET quantity = ? WHERE id = ?', [quantity + 1, id]);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    static deleteProduct(id) {
        return db.execute('DELETE FROM cart WHERE id = ?', [id]);
    }

    static getCart() {
        return db.execute('SELECT * FROM products JOIN cart ON products.id = cart.id');
    }
}
