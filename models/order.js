const Sequelize = require('sequelize');
const sequelize = require('../util/database');

module.exports = sequelize.define('order', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }
});
