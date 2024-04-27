const mongodb = require('mongodb');
let db;

exports.mongoConnect = async cb => {
    try {
        const client = await mongodb.MongoClient.connect('mongodb+srv://omarfarouk219:omar2023@cluster0.nffrsqt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        db = client.db("shop");
        cb();
    }
    catch (err) {
        console.log(err);
    }
};

exports.getDb = () => {
    if (db) return db;
    throw new Error("db isn't defined");
}
