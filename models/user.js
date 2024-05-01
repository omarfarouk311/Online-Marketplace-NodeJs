const { ObjectId } = require('mongodb');
const getDb = require('../util/database').getDb;
const getClient = require('../util/database').getClient;

module.exports = class User {
    constructor(username, email, products, cart, orders, id) {
        this.username = username;
        this.email = email;
        this.products = products;
        this.cart = cart;
        this.orders = orders;
        this._id = id;
    }

    async saveUser() {
        const db = getDb();
        try {
            await db.collection('users').insertOne(this);
        }
        catch (err) {
            console.log(err);
        }
    }

    async saveProduct(product) {
        const db = getDb();
        try {
            if (!product._id) {
                const result = await db.collection('products').insertOne(product);
                await db.collection('users').updateOne(
                    { _id: this._id },
                    { $push: { products: result.insertedId } }
                );
                this.products.push(result.insertedId);
            }
            else {
                await db.collection('products').updateOne(
                    { _id: product._id },
                    { $set: product }
                );
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    static findById(id) {
        const db = getDb();
        return db.collection('users').findOne({ _id: ObjectId.createFromHexString(id) });
    }

    async fetchUserProducts() {
        const db = getDb();
        try {
            return await db.collection('products').find({ _id: { $in: this.products } }).toArray();
        }
        catch (err) {
            console.log(err);
        }
    }

    async deleteProduct(productId) {
        const db = getDb();
        try {
            const result = await db.collection('products').deleteOne(
                { _id: ObjectId.createFromHexString(productId) }
            );

            if (result.deletedCount) {
                await db.collection('users').updateOne(
                    { _id: this._id },
                    { $pull: { products: ObjectId.createFromHexString(productId) } }
                );
                this.products = this.products.filter(prodId => prodId != productId);
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    async getCart() {
        const db = getDb();
        const cartItems = [];
        const removed_products = [];

        for (const cartProduct of this.cart) {
            try {
                const product = await db.collection('products').findOne({ _id: cartProduct.productId });
                if (product) {
                    cartItems.push({ ...product, quantity: cartProduct.quantity });
                }
                else {
                    removed_products.push(cartProduct.productId);
                }
            }
            catch (err) {
                console.log(err);
            }
        }

        //updating cart based on if there are products in it that has been removed by an admin
        try {
            const result = await db.collection('users').updateOne(
                { _id: this._id },
                { $pull: { cart: { productId: { $in: removed_products } } } }
            );
            if (result.modifiedCount) {
                this.cart = this.cart.filter(cp => !removed_products.includes(cp.productId));
            }
        }
        catch (err) {
            console.log(err);
        }

        return cartItems;
    }

    async addToCart(productId) {
        const db = getDb();
        const client = getClient();
        const session = client.startSession();

        try {
            await session.startTransaction();

            const product = await db.collection('products').findOne(
                { _id: ObjectId.createFromHexString(productId) },
                { session }
            );

            if (!product.productQuantity) {
                await session.abortTransaction();
                session.endSession();
                return 0;
            }

            await db.collection('products').updateOne(
                { _id: ObjectId.createFromHexString(productId) },
                { $inc: { productQuantity: -1 } },
                { session }
            );

            await session.commitTransaction();
            session.endSession();
        }
        catch (err) {
            console.log(err);
            await session.abortTransaction();
            session.endSession();
        }

        try {
            const idx = this.cart.findIndex(cp => cp.productId == productId);
            if (idx != -1) {
                const result = await db.collection('users').updateOne(
                    { _id: this._id, 'cart.productId': ObjectId.createFromHexString(productId) },
                    { $inc: { 'cart.$.quantity': 1 } }
                );

                if (result.modifiedCount) {
                    this.cart[idx].quantity++;
                }
            }
            else {
                const newDoc = { productId: ObjectId.createFromHexString(productId), quantity: 1 };
                const result = await db.collection('users').updateOne(
                    { _id: this._id },
                    { $push: { cart: newDoc } }
                );

                if (result.modifiedCount) {
                    this.cart.push(newDoc)
                }
            }

            return 1;
        }
        catch (err) {
            console.log(err);
        }
    }

    async deleteFromCart(productId) {
        const db = getDb();
        try {
            const result = await db.collection('users').updateOne(
                { _id: this._id },
                { $pull: { cart: { productId: ObjectId.createFromHexString(productId) } } }
            );

            if (result.modifiedCount) {
                let quantity;
                this.cart = this.cart.filter(cp => {
                    if (cp.productId == productId) {
                        quantity = cp.quantity;
                        return false;
                    }
                    return true;
                });

                await db.collection('products').updateOne(
                    { _id: ObjectId.createFromHexString(productId) },
                    { $inc: { productQuantity: quantity } }
                );
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    async createOrder() {
        const db = getDb();

    }

    async getOrders() {
        const db = getDb();

    }
}
