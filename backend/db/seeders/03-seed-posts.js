'use strict';
const KieService = require('../../services/kieService');
const { Result, ResultStatus } = require('../../utils/result');

module.exports = {
	up: async (queryInterface, Sequelize) => {
		const posts = [
			{
				id: 1,
				authorUsername: 'meda123',
				content: 'This is a post by Meda from 🌲',
				hashtags: null,
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 2,
				authorUsername: 'meda123',
				content: 'This is a post by Meda from BIH',
				hashtags: null,
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 3,
				authorUsername: 'cico123',
				content: 'THE BEST SUMMER',
				hashtags: ['summer'],
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 4,
				authorUsername: 'cico123',
				content: 'ON THE BEACH',
				hashtags: ['summer'],
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 5,
				authorUsername: 'zeka123',
				content: 'I like Tesla cars',
				hashtags: ['car'],
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 6,
				authorUsername: 'dule123',
				content: 'I like carting 🏎️',
				hashtags: ['car'],
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 7,
				authorUsername: 'deki123',
				content: 'World of Warcraft ⚔️',
				hashtags: ['wow'],
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 8,
				authorUsername: 'deki123',
				content: 'World of Warcraft 🛡️',
				hashtags: ['wow'],
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 9,
				authorUsername: 'luka123',
				content: 'World of Warcraft 🧙‍♂️',
				hashtags: ['wow'],
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 10,
				authorUsername: 'luka123',
				content: 'Games 🎮',
				hashtags: ['game'],
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 11,
				authorUsername: 'djuka123',
				content: 'Games 🕹️',
				hashtags: ['game'],
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 12,
				authorUsername: 'djuka123',
				content: 'Games 🎲',
				hashtags: ['game'],
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 13,
				authorUsername: 'trksi123',
				content: 'MOTORIIIIIIIII 🏍️',
				hashtags: null,
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 14,
				authorUsername: 'gala123',
				content: 'Fallout 5 is coming out soon!',
				hashtags: ['game'],
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 15,
				authorUsername: "sremac123",
				content: 'I love biking!',
				hashtags: null,
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 16,
				authorUsername: "sremac123",
				content: 'I love biking! 2',
				hashtags: null,
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 17,
				authorUsername: "sremac123",
				content: 'I love biking! 3',
				hashtags: null,
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 18,
				authorUsername: "sremac123",
				content: 'I love biking! 4',
				hashtags: null,
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 19,
				authorUsername: "sremac123",
				content: 'Vozim brzo ta kolaaaaa brrrrr',
				hashtags: null,
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 20,
				authorUsername: "sremac123",
				content: 'Volim kolace',
				hashtags: ['food'],
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 21,
				authorUsername: "sremac123",
				content: 'Volim sladoled',
				hashtags: ['food'],
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 22,
				authorUsername: "deki123",
				content: 'BUREEEEEK',
				hashtags: ['food'],
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 23,
				authorUsername: "deki123",
				content: 'SIRNICAAAAA',
				hashtags: ['food'],
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 24,
				authorUsername: "deki123",
				content: 'KIFLICE',
				hashtags: ['food'],
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 25,
				authorUsername: "deki123",
				content: 'KEBAB SVI VOLE',
				hashtags: ['food'],
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 26,
				authorUsername: "sremac123",
				content: 'GIROS JE NAJBOLJIIII',
				hashtags: ['food'],
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 27,
				authorUsername: "cico123",
				content: 'Letnji raspust je najbolji',
				hashtags: null,
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 28,
				authorUsername: "cico123",
				content: 'Letnji raspust je najbolji 2',
				hashtags: null,
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 29,
				authorUsername: "cico123",
				content: 'Letnji raspust je najbolji 3',
				hashtags: null,
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 30,
				authorUsername: "cico123",
				content: 'Letnji raspust je najbolji 4',
				hashtags: null,
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 31,
				authorUsername: "gala123",
				content: 'Bosna u srcu',
				hashtags: null,
				createdAt: new Date().toISOString().slice(0, 19)
			},
			{
				id: 32,
				authorUsername: "gala123",
				content: 'Malesici najbolji',
				hashtags: null,
				createdAt: new Date().toISOString().slice(0, 19)
			}
		];

		const result = await queryInterface.bulkInsert('Posts', posts, {});

		await queryInterface.sequelize.query(
			`SELECT setval('"Posts_id_seq"', (SELECT MAX("id") FROM "Posts"));`
		);

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