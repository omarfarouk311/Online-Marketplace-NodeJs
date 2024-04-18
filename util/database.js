const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'online-marketplace',
    password: 'omar2003'
});

module.exports = pool.promise()
