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

    static async findById(id) {
        const db = getDb();
        try {
            return await db.collection('users').findOne({ _id: ObjectId.createFromHexString(id) });
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
            await db.collection('users').updateOne(
                { _id: this._id },
                { $pull: { cart: { productId: { $in: removed_products } } } }
            );
        }
        catch (err) {
            console.log(err);
        }

        return cartItems;
    }

    async addToCart(productId) {
        const db = getDb();
        try {
            const idx = this.cart.findIndex(cp => cp.productId == productId);
            if (idx != -1) {
                await db.collection('users').updateOne(
                    { _id: this._id, 'cart.productId': ObjectId.createFromHexString(productId) },
                    { $inc: { 'cart.$.quantity': 1 } }
                );
            }
            else {
                const newDoc = { productId: ObjectId.createFromHexString(productId), quantity: 1 };
                await db.collection('users').updateOne(
                    { _id: this._id },
                    { $push: { cart: newDoc } }
                );
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    async deleteFromCart(productId) {
        const db = getDb();
        try {
            await db.collection('users').updateOne(
                { _id: this._id },
                { $pull: { cart: { productId: ObjectId.createFromHexString(productId) } } }
            );
        }
        catch (err) {
            console.log(err);
        }
    }

    async createOrder() {
        const db = getDb();
        const client = getClient();
        const session = client.startSession();
        let cartProducts = []
        let totalPrice = 0;

        try {
            session.startTransaction();

            cartProducts = await this.getCart();
            if (!cartProducts.length) return 1;

            for (const prod of cartProducts) {
                if (prod.productQuantity < prod.quantity) {
                    await session.abortTransaction();
                    return 0;
                }
                totalPrice += prod.price * prod.quantity;
            }

            for (const cp of cartProducts) {
                await db.collection('products').updateOne(
                    { _id: cp._id },
                    { $inc: { productQuantity: -cp.quantity } },
                    { session }
                );
            }

            await session.commitTransaction();
        }
        catch (err) {
            console.log(err);
            await session.abortTransaction();
        }
        finally {
            await session.endSession();
        }

        try {
            const result = await db.collection('orders').insertOne(
                { items: cartProducts, totalPrice: totalPrice }
            );

            await db.collection('users').updateOne(
                { _id: this._id },
                { $push: { orders: result.insertedId } }
            );

            await db.collection('users').updateOne(
                { _id: this._id },
                { $set: { cart: [] } }
            );

            return 1;
        }
        catch (err) {
            console.log(err);
        }
    }

    async getOrders() {
        const db = getDb();
        const orders = await db.collection('orders').find(
            { _id: { $in: this.orders } }
        ).toArray();
        return orders;
    }
}
