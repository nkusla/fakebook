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
			},
			{
				postId: 22,
				username: 'sone123',
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				postId: 23,
				username: 'sone123',
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				postId: 24,
				username: 'sone123',
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				postId: 25,
				username: 'sone123',
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				postId: 25,
				username: 'luka123',
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				postId: 25,
				username: 'djuka123',
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				postId: 26,
				username: 'luka123',
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				postId: 26,
				username: 'djuka123',
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				postId: 27,
				username: 'luka123',
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				postId: 28,
				username: 'luka123',
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				postId: 29,
				username: 'luka123',
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				postId: 30,
				username: 'luka123',
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				postId: 27,
				username: 'sone123',
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				postId: 28,
				username: 'sone123',
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				postId: 29,
				username: 'sone123',
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				postId: 30,
				username: 'sone123',
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				postId: 31,
				username: 'sone123',
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				postId: 31,
				username: 'luka123',
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				postId: 32,
				username: 'luka123',
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				postId: 32,
				username: 'deki123',
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				postId: 32,
				username: 'djuka123',
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				postId: 32,
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