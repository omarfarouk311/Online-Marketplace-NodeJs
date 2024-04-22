const Sequelize = require('sequelize');
const sequelize = require('../util/database');

module.exports = sequelize.define('orderItem', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});
