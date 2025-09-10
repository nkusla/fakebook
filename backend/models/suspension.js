'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Suspension extends Model {
    static associate(models) {
      // Define association here
      Suspension.belongsTo(models.User, {
        foreignKey: 'username',
        targetKey: 'username',
        as: 'user'
      });
    }
  }

  Suspension.init({
    username: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    suspendType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    suspendDuration: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Suspension',
    timestamps: false,
  });

  return Suspension;
};
