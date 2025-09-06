"use strict";
const KieService = require('../../services/kieService');
const { Result, ResultStatus } = require('../../utils/result');

module.exports = {
	up: async (queryInterface, Sequelize) => {
		const blocks = [
			{
				username: "zeka123",
				blockedUsername: "gala123",
				createdAt: new Date().toISOString().slice(0, 19),
			},
			{
				username: "dule123",
				blockedUsername: "gala123",
				createdAt: new Date().toISOString().slice(0, 19),
			},
			{
				username: "djuka123",
				blockedUsername: "gala123",
				createdAt: new Date().toISOString().slice(0, 19),
			},
			{
				username: "cico123",
				blockedUsername: "gala123",
				createdAt: new Date().toISOString().slice(0, 19),
			},
		]

		const result = await queryInterface.bulkInsert("Blocks", blocks, {});

		for (const block of blocks) {
			const result = await KieService.insertBlockFact(block);
			if (result.status === ResultStatus.FAIL) {
				console.warn(`Failed to insert block fact for user ${block.username}: ${result.message}`);
			}
		}

		return result;
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete("Blocks", null, {});
	},
};
