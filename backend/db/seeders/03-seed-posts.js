'use strict';
const KieService = require('../../services/kieService');
const { Result, ResultStatus } = require('../../utils/result');

module.exports = {
	up: async (queryInterface, Sequelize) => {
		const posts = [
			{
				id: 0,
				authorUsername: 'meda123',
				content: 'This is a post by Meda from 🌲',
				hashtags: null,
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 1,
				authorUsername: 'meda123',
				content: 'This is a post by Meda from BIH',
				hashtags: null,
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 2,
				authorUsername: 'cico123',
				content: 'THE BEST SUMMER',
				hashtags: ['summer'],
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 3,
				authorUsername: 'cico123',
				content: 'ON THE BEACH',
				hashtags: ['summer'],
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 4,
				authorUsername: 'zeka123',
				content: 'I like Tesla cars',
				hashtags: ['car'],
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 5,
				authorUsername: 'dule123',
				content: 'I like carting 🏎️',
				hashtags: ['car'],
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 6,
				authorUsername: 'deki123',
				content: 'World of Warcraft ⚔️',
				hashtags: ['wow'],
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 7,
				authorUsername: 'deki123',
				content: 'World of Warcraft 🛡️',
				hashtags: ['wow'],
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 8,
				authorUsername: 'luka123',
				content: 'World of Warcraft 🧙‍♂️',
				hashtags: ['wow'],
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 9,
				authorUsername: 'luka123',
				content: 'Games 🎮',
				hashtags: ['game'],
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 10,
				authorUsername: 'djuka123',
				content: 'Games 🕹️',
				hashtags: ['game'],
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 11,
				authorUsername: 'djuka123',
				content: 'Games 🎲',
				hashtags: ['game'],
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