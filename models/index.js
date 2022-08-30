'use strict';

const fs = require('fs');
const path = require('path');
const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('movies', 'user', 'pass', {
  dialect: 'sqlite',
  host: './data/films.db'
})

const basename = path.basename(__filename);
const db = {};

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize.modelManager.addModel(path.join(__dirname, file));
    db[file] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
