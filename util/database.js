const mongodb = require('mongodb');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
let db, client;
const uri = process.env.DB_URI;

exports.mongoConnect = async cb => {
    try {
        client = await mongodb.MongoClient.connect(uri);
        db = client.db('shop');
        cb();
    }
    catch (err) {
        console.log(err);
    }
};

exports.store = new MongoDbStore({
    uri: uri,
    databaseName: 'shop',
    collection: 'sessions'
});

exports.getDb = () => {
    if (db) return db;
    throw new Error("db isn't defined");
}

exports.getClient = () => {
    return client;
}
