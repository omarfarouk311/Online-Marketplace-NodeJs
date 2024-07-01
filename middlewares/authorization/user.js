exports.authorizeProductModification = (req, res, next) => {
    const { _id: productId } = req.product

    if (!req.user.products.some(prodId => prodId.toString() === productId.toString())) {
        const err = new Error('Access denied');
        err.statusCode = 403;
        return next(err);
    }
    return next();
};

exports.authorizeInvoiceViewing = (req, res, next) => {
    const { _id: userOrderId } = req.order;

    if (!req.user.orders.some(orderId => orderId.toString() === userOrderId.toString())) {
        const err = new Error('Access denied');
        err.statusCode = 403;
        return next(err);
    }
    return next();
};