const { MongoClient } = require('mongodb');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const uri = process.env.DB_URI;
let db, client;

exports.mongoConnect = async () => {
    client = await MongoClient.connect(uri);
    db = client.db('shop');
}

exports.store = new MongoDbStore({
    uri: uri,
    databaseName: 'shop',
    collection: 'sessions'
}, err => undefined);

exports.getDb = () => {
    if (db) return db;
    throw new Error('Database connection not established');
}

exports.getClient = () => {
    return client;
}
