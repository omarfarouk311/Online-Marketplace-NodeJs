const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

module.exports = class Products {

    constructor(title, price, description, imageUrl, id) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id ? mongodb.ObjectId.createFromHexString(id) : id;
    }

    save() {
        const db = getDb();
        if (!this._id) return db.collection('products').insertOne(this);
        return db.collection('products').updateOne({ _id: this._id, }, { $set: this });
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products').find().toArray();
    }

    static findById(id) {
        const db = getDb();
        return db.collection('products').findOne({ _id: mongodb.ObjectId.createFromHexString(id) });
    }

    static deleteById(id) {
        const db = getDb();
        return db.collection('products').deleteOne({ _id: mongodb.ObjectId.createFromHexString(id) });
    }
}
