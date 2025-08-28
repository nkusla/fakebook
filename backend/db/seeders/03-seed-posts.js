'use strict';
const KieService = require('../../services/kieService');
const { Result, ResultStatus } = require('../../utils/result');

module.exports = {
	up: async (queryInterface, Sequelize) => {
		const posts = [
			{
				id: 0,
				authorUsername: 'trksi123',
				content: 'This is a post by Stefan.',
				hashtags: ['welcome'],
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 1,
				authorUsername: 'zeka123',
				content: 'This is a post by Nemanja.',
				hashtags: null,
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 2,
				authorUsername: 'cico123',
				content: 'This is a post by Milos.',
				hashtags: ['welcome'],
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 3,
				authorUsername: 'kico123',
				content: 'This is a post by Aljosa.',
				hashtags: ['welcome'],
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 4,
				authorUsername: 'kico123',
				content: 'This is a post by Aljosa.',
				hashtags: null,
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 5,
				authorUsername: 'kico123',
				content: 'This is a post by Aljosa.',
				hashtags: null,
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 6,
				authorUsername: 'kico123',
				content: 'This is a post by Aljosa.',
				hashtags: null,
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 7,
				authorUsername: 'kico123',
				content: 'This is a post by Aljosa.',
				hashtags: null,
				createdAt: new Date().toISOString().slice(0, 19)
			}
		];

		const result = await queryInterface.bulkInsert('Posts', posts, {});

		for (const post of posts) {
			const result = await KieService.insertPostFact(post);
			if (result.status === ResultStatus.FAIL) {
				console.warn(`Failed to insert post fact for post ID ${post.id}: ${result.message}`);
			}
		}

		return result;
	},

	down: async (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('Posts', null, {});
	}
};