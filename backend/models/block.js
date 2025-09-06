"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Block extends Model {
		static associate(models) {
			// User who blocks
			Block.belongsTo(models.User, {
				foreignKey: "username",
				targetKey: "username"
			});
			// User who is blocked
			Block.belongsTo(models.User, {
				foreignKey: "blockedUsername",
				targetKey: "username"
			});
		}
	}
	Block.init({
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true,
		},
		blockedUsername: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true,
		},
		createdAt: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: () => new Date().toISOString().slice(0, 19),
		}
	}, {
		sequelize,
		timestamps: false,
		modelName: "Block",
	});
	return Block;
};
