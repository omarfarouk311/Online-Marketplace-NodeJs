const { ObjectId } = require('mongodb');
const getDb = require('../util/database').getDb;

module.exports = class Products {
    constructor(title, price, description, imageUrl, productQuantity, id) {
        this.title = title;
        this.price = +price;
        this.description = description;
        this.imageUrl = imageUrl;
        this.productQuantity = +productQuantity;
        this._id = id ? ObjectId.createFromHexString(id) : id;
    }

    static async fetchAll() {
        const db = getDb();
        return await db.collection('products').find().toArray();
    }

    static async findById(id) {
        const db = getDb();
        return await db.collection('products').findOne({ _id: ObjectId.createFromHexString(id) });
    }
}
