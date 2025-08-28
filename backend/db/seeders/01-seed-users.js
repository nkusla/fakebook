'use strict';
const KieService = require('../../services/kieService');
const { Result, ResultStatus } = require('../../utils/result');

module.exports = {
	up: async (queryInterface, Sequelize) => {
		const users = [
			{
				name: 'Stefan',
				surname: 'Trkulja',
				username: 'trksi123',
				password: 'trksi123',
				email: 'trksi123@gmail.com',
				address: "Futog",
				role: 'user'
			},
			{
				name: 'Nemanja',
				surname: 'Zekanovic',
				username: 'zeka123',
				password: 'zeka123',
				email: 'zeka123@gmail.com',
				address: "Telep",
				role: 'user',

			},
			{
				name: 'Milos',
				surname: 'Milakovic',
				username: 'cico123',
				password: 'cico123',
				email: 'cico123@gmail.com',
				address: "Liman",
				role: 'user',
			},
			{
				name: 'Milos',
				surname: 'Medic',
				username: 'meda123',
				password: 'meda123',
				email: 'meda123@gmail.com',
				address: "Grbavica",
				role: 'user'
			},
			{
				name: 'Dejan',
				surname: 'Deki',
				username: 'deki123',
				password: 'deki123',
				email: 'deki123@gmail.com',
				address: "Detelinara",
				role: 'user'
			},
			{
				name: 'Dule',
				surname: 'Dule',
				username: 'dule123',
				password: 'dule123',
				email: 'dule123@gmail.com',
				address: "Detelinara",
				role: 'user'
			},
			{
				name: 'Luka',
				surname: 'Ostojic',
				username: 'luka123',
				password: 'luka123',
				email: 'luka123@gmail.com',
				address: "Detelinara",
				role: 'user'
			},
			{
				name: 'Strahinja',
				surname: 'Djukic',
				username: 'djuka123',
				password: 'djuka123',
				email: 'djuka123@gmail.com',
				address: "Detelinara",
				role: 'user'
			},
			{
				name: 'Nikola',
				surname: 'Kuslakovic',
				username: 'kule123',
				password: 'kule123',
				email: 'kule123@gmail.com',
				address: "Naselje",
				role: 'admin',
			},
		];

		const result = await queryInterface.bulkInsert('Users', users, {});
		await KieService.deleteAllFacts(); // Clear existing facts before inserting new ones

		for (const user of users) {
			const result = await KieService.insertUserFact(user);
			if (result.status === ResultStatus.FAIL) {
				console.warn(`Failed to insert user fact for username ${user.username}: ${result.message}`);
			}
		}

		return result;
	},

	down: async (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('Users', null, {});
	}
};