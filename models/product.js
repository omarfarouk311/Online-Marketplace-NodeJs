const { ObjectId } = require('mongodb');
const getDb = require('../util/database').getDb;

module.exports = class Products {
    constructor({ title, price, description, imageUrl, quantity, productId }) {
        this.title = title;
        this.price = +price;
        this.description = description;
        this.imageUrl = imageUrl;
        this.productQuantity = +quantity;
        this._id = productId ? ObjectId.createFromHexString(productId) : productId;
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products').find();
    }

    static findById(id) {
        const db = getDb();
        return db.collection('products').findOne({ _id: ObjectId.createFromHexString(id) });
    }
}
