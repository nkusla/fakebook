'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Post extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			// A post belongs to a user
			Post.belongsTo(models.User, {
				foreignKey: 'authorUsername',
				targetKey: 'username',
				as: 'author'
			});
		}
	}
	Post.init({
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		authorUsername: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		content: {
			type: DataTypes.TEXT,
			allowNull: false,
			validate: {
				notEmpty: true,
				len: [1, 1000]
			}
		},
		hashtags: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			allowNull: true,
		},
		createdAt: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: () => new Date().toISOString().slice(0, 19), // YYYY-MM-DDTHH:mm:ss
		}
	}, {
		sequelize,
		timestamps: false,
		modelName: 'Post',
	});
	return Post;
};