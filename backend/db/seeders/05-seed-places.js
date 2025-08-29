'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert('Places', [
			{
				id: 1,
				name: 'Central Park',
				country: 'USA',
				city: 'New York',
				description: 'A large public park in New York City.',
				hashtag: 'park'
			},
			{
				id: 2,
				name: 'Eiffel Tower',
				country: 'France',
				city: 'Paris',
				description: 'A wrought-iron lattice tower on the Champ de Mars in Paris.',
				hashtag: 'tower'
			},
			{
				id: 3,
				name: 'Colosseum',
				country: 'Italy',
				city: 'Rome',
				description: 'An ancient amphitheater located in the center of Rome.',
				hashtag: 'amphitheater'
			}
		]);
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete('Places', null, {});
	}
};