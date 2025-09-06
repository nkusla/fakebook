const { Result, ResultStatus } = require('../utils/result');
const jwtParser = require('../utils/jwtParser');
const friendshipService = require('../services/friendshipService');

const express = require('express');

const router = express.Router();

router.post('/',
	jwtParser.verifyToken(),
	async (req, res) => {
		const { username2 } = req.body;
		const username1 = req.user.username;

		const result = await friendshipService.createFriendship(username1, username2);

		if (result.status === ResultStatus.FAIL)
			return res.status(result.code).json({ errors: result.errors });

		return res.status(201).json({ message: 'Friendship created successfully' });
	}
);

router.get('/',
	jwtParser.verifyToken(),
	async (req, res) => {
		const username = req.user.username;

		const result = await friendshipService.getFriends(username);

		if (result.status === ResultStatus.FAIL) {
			return res.status(result.code).json({ errors: result.errors });
		}

		return res.status(200).json(result.data);
	}
);

router.delete('/:username',
	jwtParser.verifyToken(),
	async (req, res) => {
		const username2 = req.params.username;
		const username1 = req.user.username;

		const result = await friendshipService.removeFriendship(username1, username2);

		if (result.status === ResultStatus.FAIL) {
			return res.status(result.code).json({ errors: result.errors });
		}

		return res.status(200);
	}
);

router.get('/:username',
	jwtParser.verifyToken(),
	async (req, res) => {
		const username1 = req.user.username;
		const username2 = req.params.username;

		const result = await friendshipService.checkFriendship(username1, username2);

		if (result.status === ResultStatus.FAIL) {
			return res.status(result.code).json({ errors: result.errors });
		}

		return res.status(200).json(result.data);
	}
);

module.exports = router;