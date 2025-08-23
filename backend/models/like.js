'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Like extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Like.belongsTo(models.User, {
				foreignKey: 'username',
				targetKey: 'username',
			});

			Like.belongsTo(models.Post, {
				foreignKey: 'postId',
				targetKey: 'id',
			});
		}
	}
	Like.init({
		postId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true,
		},
		createdAt: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: () => new Date().toISOString().slice(0, 19), // YYYY-MM-DDTHH:mm:ss
		}
	}, {
		sequelize,
		timestamps: false,
		modelName: 'Like',
	});
	return Like;
};