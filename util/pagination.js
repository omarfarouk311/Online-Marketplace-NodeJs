const { getDb } = require('./database');
const Product = require('../models/product');

exports.fetchProducts = async (view, pageTitle, path, req, res, next) => {
    const db = getDb();
    const ITEMS_PER_PAGE = 3;
    const page = +req.query.page || 1;
    const numOfProducts = await db.collection('products').countDocuments({});
    const lastPage = Math.ceil(numOfProducts / ITEMS_PER_PAGE);
    const products = await Product.fetchAll()
        .skip(ITEMS_PER_PAGE * (page - 1))
        .limit(ITEMS_PER_PAGE)
        .toArray();
    res.render(view, {
        prods: products,
        pageTitle: pageTitle,
        path: path,
        currentPage: page,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: lastPage,
        hasNextPage: page < lastPage,
        hasPreviousPage: page > 1
    });
}