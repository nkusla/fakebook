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
			},
			{
				id: 4,
				name: 'Great Wall of China',
				country: 'China',
				city: 'Beijing',
				description: 'A series of fortifications that stretch across northern China.',
				hashtag: 'wall'
			},
			{
				id: 5,
				name: 'Sydney Opera House',
				country: 'Australia',
				city: 'Sydney',
				description: 'A multi-venue performing arts centre in Sydney.',
				hashtag: 'opera'
			},
			{
				id: 6,
				name: 'Machu Picchu',
				country: 'Peru',
				city: 'Cusco Region',
				description: 'An ancient Incan city set high in the Andes Mountains.',
				hashtag: 'inca'
			}
		]);

		await queryInterface.sequelize.query(
			`SELECT setval('"Places_id_seq"', (SELECT MAX("id") FROM "Places"));`
		);
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete('Places', null, {});
	}
};