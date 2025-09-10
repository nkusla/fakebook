const jwt = require('jsonwebtoken');
const { Result, ResultStatus } = require('./result');
const UserService = require('../services/userService');

exports.generateToken = (user) => {
	const payload = {
		username: user.username,
		email: user.email,
		role: user.role
	};

	return jwt.sign(
		payload,
		process.env.JWT_SECRET_KEY || 'default_secret_key',
		{ expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
	);
}

exports.verifyToken = (role = null) => (req, res, next) => {
	const token = req.cookies ? req.cookies.token : null;

	if (!token) {
		return res.status(401).json({ message: 'Unauthorized access' });
	}

	const result = exports.decodeToken(token);
	if (result.status === ResultStatus.FAIL) {
		return res.status(result.code).json({ message: 'Unauthorized access' });
	}

	const tokenUser = result.data;
	if (role && role !== tokenUser.role) {
		return res.status(403).json({ message: 'Forbidden' });
	}

	const supensionResult = UserService.checkUserSuspension(tokenUser.username);
	if (supensionResult.status === ResultStatus.FAIL) {
		return res.status(supensionResult.code).json({ message: supensionResult.errors });
	}

	const suspension = supensionResult.data;
	if (suspension && (suspension.suspendType === 'PERMANENT_BAN' || suspension.suspendType === 'LOGIN_BAN')) {
		res.clearCookie('token');
		return res.status(403).json(suspension);
	}

	req.user = tokenUser;
	next();
}

exports.decodeToken = (token) => {
	let decoded = null;
	try {
		decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || 'default_secret_key');
	}
	catch (exception) {
		return Result.unauthorized();
	}

	return Result.ok(decoded);
}
