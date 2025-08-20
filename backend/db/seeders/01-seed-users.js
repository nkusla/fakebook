'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('Users', [
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
				name: 'Aljosa',
				surname: 'Kicanski',
				username: 'kico123',
				password: 'kico123',
				email: 'kico123@gmail.com',
				address: "Grbavica",
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
		], {});
	},

	down: async (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('Users', null, {});
	}
};