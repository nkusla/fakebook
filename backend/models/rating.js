"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Rating extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			Rating.belongsTo(models.Place, {
				foreignKey: 'placeId',
				targetKey: 'id'
			});

			Rating.belongsTo(models.User, {
				foreignKey: 'username',
				targetKey: 'username'
			});
		}
	}
	Rating.init({
		placeId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
		rating: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				min: 1,
				max: 5
			}
		},
		hashtag: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}, {
		sequelize,
		timestamps: false,
		modelName: "Rating",
	});
	return Rating;
};
