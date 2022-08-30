const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');

class Movies extends Model {};

Movies.init({
        title: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false
        },
        year: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        format: {
          type: DataTypes.STRING,
        },
        actors: {
          type: DataTypes.STRING,
        }
}, {
  sequelize,
  modelName: 'movies',
  timestamps: false
})

module.exports = Movies;

// module.exports = (sequelize, DataTypes) => {
//     const movies = sequelize.define('movie', {
//       name: {
//         type: DataTypes.STRING,
//         unique: true,
//         allowNull: false
//       },
//       year: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//       },
//       format: {
//         type: DataTypes.STRING,
//       },
//       actors: {
//         type: DataTypes.STRING,
//       },
//     }, {});

//     return movies;
//   };