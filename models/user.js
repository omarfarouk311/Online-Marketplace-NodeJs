const { ObjectId } = require('mongodb');
const getDb = require('../util/database').getDb;
const getClient = require('../util/database').getClient;

module.exports = class User {
    constructor({ email, password, products, cart, orders, resetToken, resetTokenExpiry, _id }) {
        this._id = _id;
        this.email = email;
        this.password = password;
        this.products = products;
        this.cart = cart;
        this.orders = orders;
        this.resetToken = resetToken;
        this.resetTokenExpiry = resetTokenExpiry;
    }

    async saveUser() {
        const db = getDb();
        await db.collection('users').insertOne(this);
    }

    async updateUser() {
        const db = getDb();
        await db.collection('users').updateOne(
            { _id: this._id },
            { $set: this }
        );
    }

    static async findById(id) {
        const db = getDb();
        return await db.collection('users').findOne({ _id: id });
    }

    static async findByEmail(email) {
        const db = getDb();
        return await db.collection('users').findOne({ email: email });
    }

    async saveProduct(product) {
        const db = getDb();
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

    fetchUserProducts() {
        const db = getDb();
        return db.collection('products').find({ _id: { $in: this.products } });
    }

    async deleteProduct(productId) {
        const db = getDb();
        await db.collection('products').deleteOne(
            { _id: ObjectId.createFromHexString(productId) }
        );

        await db.collection('users').updateOne(
            { _id: this._id },
            { $pull: { products: ObjectId.createFromHexString(productId) } }
        );
    }

    async getCart(session) {
        const db = getDb();
        const cartItems = [];
        const removed_products = [];
        const options = session ? { session } : {};

        for (const cartProduct of this.cart) {
            const product = await db.collection('products').findOne({ _id: cartProduct.productId }, options);
            if (product) {
                cartItems.push({ ...product, quantity: cartProduct.quantity });
            }
            else {
                removed_products.push(cartProduct.productId);
            }
        }

        //updating cart based on if there are products in it that has been removed by an admin
        await db.collection('users').updateOne(
            { _id: this._id },
            { $pull: { cart: { productId: { $in: removed_products } } } },
            options
        );
        return cartItems;
    }

    async addToCart(productId) {
        const db = getDb();
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

    async deleteFromCart(productId) {
        const db = getDb();
        await db.collection('users').updateOne(
            { _id: this._id },
            { $pull: { cart: { productId: ObjectId.createFromHexString(productId) } } }
        );
    }

    async createOrder() {
        const db = getDb();
        let cartProducts = []
        let totalPrice = 0;
        const client = getClient();
        const session = client.startSession();

        try {
            session.startTransaction();

            cartProducts = await this.getCart(session);
            if (!cartProducts.length) return true;

            for (const prod of cartProducts) {
                if (prod.productQuantity < prod.quantity) {
                    await session.abortTransaction();
                    return 0;
                }
                totalPrice += prod.price * prod.quantity;
            }

            const productsIds = cartProducts.map(cp => cp._id);
            await db.collection('products').updateMany(
                { _id: { $in: productsIds } },
                { $inc: { productQuantity: -cartProducts.quantity } },
                { session }
            )

            await session.commitTransaction();
        }
        catch (err) {
            await session.abortTransaction();
            throw err;
        }
        finally {
            await session.endSession();
        }

        const { insertedId } = await db.collection('orders').insertOne(
            {
                items: cartProducts,
                totalPrice: totalPrice
            }
        );

        await db.collection('users').updateOne(
            { _id: this._id },
            {
                $push: { orders: insertedId },
                $set: { cart: [] }
            }
        );

        return true;
    }

    getOrders() {
        const db = getDb();
        return db.collection('orders').find({ _id: { $in: this.orders } });
    }
}
