const { Result, ResultStatus } = require('../utils/result');
const jwtParser = require('../utils/jwtParser');
const placeService = require('../services/placeService');

const express = require('express');

const router = express.Router();

router.post('/',
	jwtParser.verifyToken(),
	async (req, res) => {
		const user = req.user;
		if(user.role !== 'admin') {
			return res.status(403).json({ error: 'Forbidden: Admins only' });
		}

		const placeData = req.body;
		const result = await placeService.createPlace(placeData);

		if (result.status === ResultStatus.FAIL) {
			return res.status(result.code).json({ error: result.errors });
		}

		return res.status(201).json(result.data);
	}
);

router.get('/',
	jwtParser.verifyToken(),
	async (req, res) => {
		const result = await placeService.getAllPlaces();

		if (result.status === ResultStatus.FAIL) {
			return res.status(result.code).json({ error: result.errors });
		}

		return res.status(200).json(result.data);
	}
);

router.post('/:id/rating',
	jwtParser.verifyToken(),
	async (req, res) => {
		const placeId = req.params.id;
		const username = req.user.username;
		const { rating, hashtag } = req.body;
		const ratingData = { placeId, rating, hashtag };

		const result = await placeService.addRatingToPlace(ratingData, username);

		if (result.status === ResultStatus.FAIL) {
			return res.status(result.code).json({ error: result.errors });
		}

		return res.status(201).json(result.data);
	}
);

router.get('/:id/ratings',
	jwtParser.verifyToken(),
	async (req, res) => {
		const placeId = req.params.id;
		const result = await placeService.getRatingsForPlace(placeId);

		if (result.status === ResultStatus.FAIL) {
			return res.status(result.code).json({ error: result.errors });
		}

		return res.status(200).json(result.data);
	}
);

module.exports = router;
