const { getDb } = require('../util/database');
const { ObjectId } = require('mongodb');
const Product = require('../models/product');

exports.checkOrderExistence = async (req, res, next) => {
    const db = getDb();
    const { orderId } = req.params;
    try {
        let order;
        if (orderId.length === 24) {
            order = await db.collection('orders').findOne({ _id: ObjectId.createFromHexString(orderId) });
        }

        if (!order) {
            const err = new Error('Order not found');
            err.statusCode = 404;
            throw err;
        }

        req.order = order;
        return next();
    }
    catch (err) {
        return next(err);
    }
};

exports.checkProductExistence = async (req, res, next) => {
    const { productId } = (req.method === 'POST' ? req.body : req.params);
    try {
        let product
        if (productId.length === 24) {
            product = await Product.findById(productId);
        }

        if (!product) {
            const err = new Error('Product not found');
            err.statusCode = 404;
            throw err;
        }

        req.product = product;
        return next();
    }
    catch (err) {
        return next(err);
    }
};