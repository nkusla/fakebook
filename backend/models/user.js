'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Friendship, {
        foreignKey: 'username1',
      });

      User.hasMany(models.Friendship, {
        foreignKey: 'username2',
      });

      User.hasMany(models.Post, {
        foreignKey: 'authorUsername',
      });

      User.hasMany(models.Like, {
        foreignKey: 'username',
      });

      User.hasMany(models.Rating, {
        foreignKey: 'username',
      });

      User.hasMany(models.Block, {
        foreignKey: 'username',
        targetKey: 'username',
      });

      User.hasMany(models.Block, {
        foreignKey: 'blockedUsername',
        targetKey: 'username',
      });
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user',
    }
  }, {
    sequelize,
    timestamps: false,
    modelName: 'User',
  });
  return User;
};