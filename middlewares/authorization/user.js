const { getDb } = require('../../util/database');
const { ObjectId } = require('mongodb');

exports.authorizeProductModification = (req, res, next) => {
    const db = getDb();
    const { productId } = (req.method === 'POST' ? req.body : req.params);

    try {
        const found = db.collection('products').findOne({ _id: ObjectId.createFromHexString(productId) });
        if (!found) {
            const err = new Error('Not found');
            err.statusCode = 404;
            throw err;
        }
    }
    catch (err) {
        return next(err);
    }

    if (!req.user.products.find(prodId => prodId.toString() == productId)) {
        const err = new Error('Access denied');
        err.statusCode = 403;
        return next(err);
    }

    return next();
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
    }
    catch (err) {
        return next(err);
    }

    return next();
}