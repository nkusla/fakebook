"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Place extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
  		Place.hasMany(models.Rating, {
				foreignKey: 'placeId',
				sourceKey: 'id'
			});
    }
  }
  Place.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    hashtag: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    timestamps: false,
    modelName: "Place",
  });
  return Place;
};
