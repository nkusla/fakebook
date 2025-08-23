'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Friendship extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Friendship.belongsTo(models.User, {
				foreignKey: 'username1',
				targetKey: 'username',
			});

			Friendship.belongsTo(models.User, {
				foreignKey: 'username2',
				targetKey: 'username',
			});
		}
	}
	Friendship.init({
		username1: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
		username2: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		}
	}, {
		sequelize,
		timestamps: false,
		modelName: 'Friendship',
	});
	return Friendship;
};