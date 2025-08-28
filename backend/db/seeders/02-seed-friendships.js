'use strict';
const KieService = require('../../services/kieService');
const { Result, ResultStatus } = require('../../utils/result');

module.exports = {
	up: async (queryInterface, Sequelize) => {
		const friendships = [
			{
				username1: 'trksi123',
				username2: 'kico123',
			},
			{
				username1: 'trksi123',
				username2: 'cico123',
			}
		];

		const result = await queryInterface.bulkInsert('Friendships', friendships, {});

		for (const friendship of friendships) {
			const result = await KieService.insertFriendshipFact(friendship);
			if (result.status === ResultStatus.FAIL) {
				console.warn(`Failed to insert friendship fact between ${friendship.username1} and ${friendship.username2}: ${result.message}`);
			}
		}

		return result;
	},

	down: async (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('Friendships', null, {});
	}
};