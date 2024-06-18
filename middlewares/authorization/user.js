const { getDb } = require('../../util/database');
const { ObjectId } = require('mongodb');

exports.authorizeProductModification = async (req, res, next) => {
    const db = getDb();
    const { productId } = (req.method === 'POST' ? req.body : req.params);

    try {
        const found = await db.collection('products').findOne({ _id: ObjectId.createFromHexString(productId) });
        if (!found) {
            const err = new Error('Not found');
            err.statusCode = 404;
            throw err;
        }

        if (!req.user.products.find(prodId => prodId.toString() == productId)) {
            const err = new Error('Access denied');
            err.statusCode = 403;
            throw err;
        }

        return next();
    }
    catch (err) {
        return next(err);
    }
}

exports.authorizeInvoiceViewing = async (req, res, next) => {
    const db = getDb();
    const { orderId } = req.params;

    try {
        let found = await db.collection('orders').findOne({ _id: ObjectId.createFromHexString(orderId) });
        if (!found) {
            const err = new Error('Not Found');
            err.statusCode = 404;
            throw err;
        }

        found = await db.collection('users').findOne({
            _id: req.user._id,
            orders: ObjectId.createFromHexString(orderId)
        });
        if (!found) {
            const err = new Error('Access denied');
            err.statusCode = 403;
            throw err;
        }

        return next();
    }
    catch (err) {
        return next(err);
    }
}