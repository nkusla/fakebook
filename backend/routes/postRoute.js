const { Result, ResultStatus } = require('../utils/result');
const jwtParser = require('../utils/jwtParser');
const postService = require('../services/postService');

const express = require('express');

const router = express.Router();

router.post('/',
	jwtParser.verifyToken(),
	async (req, res) => {
		const { content, hashtags } = req.body;
		const authorUsername = req.user.username;

		const result = await postService.createPost({ authorUsername, content, hashtags });

		if (result.status === ResultStatus.FAIL) {
			return res.status(result.code).json({ error: result.errors });
		}

		return res.status(201).json(result.data);
	}
)

router.get('/',
	jwtParser.verifyToken(),
	async (req, res) => {
		const authorUsername = req.user.username;

		const result = await postService.getPostsByUser(authorUsername);

		if (result.status === ResultStatus.FAIL) {
			return res.status(result.code).json({ error: result.errors });
		}

		return res.status(200).json(result.data);
	}
);

router.post('/:id/like',
	jwtParser.verifyToken(),
	async (req, res) => {
		const postId = req.params.id;
		const username = req.user.username;

		const result = await postService.likePost(postId, username);

		if (result.status === ResultStatus.FAIL) {
			return res.status(result.code).json({ error: result.errors });
		}

		return res.status(201).json(result.data);
	}
);

router.get('/feed',
	jwtParser.verifyToken(),
	async (req, res) => {
		const username = req.user.username;

		const result = await postService.getFeedPosts(username);

		if (result.status === ResultStatus.FAIL) {
			return res.status(result.code).json({ error: result.errors });
		}

		return res.status(200).json(result.data);
	}
);

router.post('/:id/report',
	jwtParser.verifyToken(),
	async (req, res) => {
		const postId = req.params.id;
		const reporterUsername = req.user.username;
		const { reason } = req.body;

		const result = await postService.reportPost(postId, reporterUsername, reason);

		if (result.status === ResultStatus.FAIL) {
			return res.status(result.code).json({ error: result.errors });
		}

		return res.status(201).json(result.data);
	}
);

module.exports = router;
