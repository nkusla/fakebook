'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('Friendships', [
			{
				username1: 'trksi123',
				username2: 'zeka123',
			},
			{
				username1: 'trksi123',
				username2: 'cico123',
			}
		], {});
	},

	down: async (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('Friendships', null, {});
	}
};