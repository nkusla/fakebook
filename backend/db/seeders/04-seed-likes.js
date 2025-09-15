'use strict';
const KieService = require('../../services/kieService');
const { Result, ResultStatus } = require('../../utils/result');

module.exports = {
	up: async (queryInterface, Sequelize) => {
		const likes = [
			{
				postId: 3,
				username: 'zeka123',
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				postId: 12,
				username: 'zeka123',
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				postId: 13,
				username: 'deki123',
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				postId: 13,
				username: 'luka123',
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				postId: 13,
				username: 'meda123',
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				postId: 13,
				username: 'djuka123',
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				postId: 13,
				username: 'cico123',
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				postId: 19,
				username: 'sone123',
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				postId: 19,
				username: 'luka123',
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				postId: 19,
				username: 'deki123',
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				postId: 19,
				username: 'meda123',
				createdAt: new Date().toISOString().slice(0, 19)
			}
		];

		const result = await queryInterface.bulkInsert('Likes', likes, {});

		for (const like of likes) {
			const result = await KieService.insertLikeFact(like);
			if (result.status === ResultStatus.FAIL) {
				console.warn(`Failed to insert like fact for post ID ${like.postId}: ${result.message}`);
			}
		}

		return result;
	},

	down: async (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('Likes', null, {});
	}
};