const { Result, ResultStatus } = require('../utils/result');
const { Place, Rating } = require('../models');

class PlaceService {

	static async createPlace(placeData) {
		try {
			const { name, country, city, description, hashtag } = placeData;

			const place = await Place.create({
				name,
				country,
				city,
				description,
				hashtag
			});

			return Result.ok(place, 201);
		} catch (error) {
			return Result.serverError(error.message);
		}
	}

	static async addRatingToPlace(ratingData, username) {
		try {
			const { placeId, rating, hashtag } = ratingData;

			const newRating = await Rating.create({
				placeId,
				username,
				rating,
				hashtag
			});

			return Result.ok(newRating, 201);
		} catch (error) {
			return Result.serverError(error.message);
		}
	}

	static async getRatingsForPlace(placeId) {
		try {
			if (!placeId) {
				return Result.fail('placeId is required');
			}

			const ratings = await Rating.findAll({ where: { placeId } });
			return Result.ok(ratings);
		} catch (error) {
			return Result.serverError(error.message);
		}
	}
}

module.exports = PlaceService;