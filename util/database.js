const Sequelize = require('sequelize').Sequelize;

const sequelize = new Sequelize('online-marketplace', 'root', 'omar2003', { dialect: 'mysql', host: 'localhost' });

module.exports = sequelize;
