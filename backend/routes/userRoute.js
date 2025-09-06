const { Result, ResultStatus } = require('../utils/result');
const jwtParser = require('../utils/jwtParser');
const UserService = require('../services/userService');

const ms = require('ms');
const express = require('express');

const router = express.Router();

router.get('/profile',
	jwtParser.verifyToken(),
	async (req, res) => {
		const user = req.user;
		const result = await UserService.getUserProfile(user.username);

		if (result.status === ResultStatus.FAIL) {
			return res.status(result.code).json({ errors: result.errors });
		}

		return res.status(200).json(result.data);
	}
);

router.post('/register',
	async (req, res) => {
		const user = req.body;
		const result = await UserService.register(user, 'user');

		if (result.status === ResultStatus.FAIL) {
			return res.status(result.code).json({ errors: result.errors });
		}

		return res.status(201).json({ message: 'User registered successfully!' });
	}
);

router.post("/login",
	async (req, res) => {
		const { username, password } = req.body;
		const result = await UserService.login(username, password);

		if (result.status === ResultStatus.FAIL) {
			return res.status(result.code).json({ errors: result.errors });
		}

		const user = result.data;
		const token = jwtParser.generateToken(user);
		res.cookie('token', token, {
			httpOnly: true,
			maxAge: ms(process.env.COOKIE_EXPIRES_IN)
		});

		return res.status(200).json({
			message: 'Login successful!',
			username: user.username,
			role: user.role
		});
	}
);

router.get('/search',
	jwtParser.verifyToken(),
	async (req, res) => {
		const { username } = req.query;

		const result = await UserService.searchUsers(username);

		if (result.status === ResultStatus.FAIL) {
			return res.status(result.code).json({ errors: result.errors });
		}

		return res.status(200).json(result.data);
	}
);

router.post('/logout',
	async (_, res) => {
		res.clearCookie('token');

		return res.status(200).json({ message: 'Logout successful!' });
	}
);

module.exports = router;