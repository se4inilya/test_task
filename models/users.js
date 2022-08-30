'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');
const bcrypt = require('bcrypt');

class Users extends Model {};

// Users.init({
//   name: {
//     type: DataTypes.STRING(64),
//     unique: true,
//     allowNull: false
//   },
//   password_hash: {
//     type: DataTypes.STRING(64),
//     allowNull: false
//   },
//   email: {
//     type: DataTypes.STRING(64),
//     unique: true,
//     allowNull: false
//   }}, {
//     sequelize,
//     modelName: 'users',
//     timestamps: false,
//     hooks: {
//       beforeCreate(user, options) {
//         const salt = bcrypt.genSaltSync();
//         user.password_hash = bcrypt.hashSync(user.password_hash, salt);
//       }
//     }
//   });

  const users = sequelize.define('users', {
    name: {
      type: DataTypes.STRING(64),
      unique: true,
      allowNull: false
    },
    password_hash: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(64),
      unique: true,
      allowNull: false
    },
  }, {
    timestamps: false,
    hooks: {
      beforeCreate(user, options) {
        const salt = bcrypt.genSaltSync();
        user.password_hash = bcrypt.hashSync(user.password_hash, salt);
      }
    }
  });

  // users.prototype.check_password = function (password, error) {
  //   if (error) {
  //     throw error;
  //   }
  //   return bcrypt.compareSync(password, this.password_hash);
  // };
// };
module.exports = users;
// module.exports = Users;