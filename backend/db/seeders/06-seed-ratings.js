'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert('Ratings', [
			{
				placeId: 1,
				username: 'trksi123',
				rating: 5,
				hashtag: 'great'
			},
			{
				placeId: 1,
				username: 'zeka123',
				rating: 4,
				hashtag: 'nice'
			},
			{
				placeId: 2,
				username: 'deki123',
				rating: 3,
				hashtag: 'average'
			},
			{
				placeId: 2,
				username: 'dule123',
				rating: 5,
				hashtag: 'excellent'
			},
			{
				placeId: 3,
				username: 'luka123',
				rating: 2,
				hashtag: 'poor'
			}
		]);
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete('Ratings', null, {});
	}
};