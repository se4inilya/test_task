const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('movies', 'user', 'pass', {
  dialect: 'sqlite',
  host: './data/films.sqlite'
})

module.exports = sequelize;