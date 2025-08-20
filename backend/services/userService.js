const { Result, ResultStatus } = require("../utils/result");
const { User } = require('../models');

class UserService {
	static async register(user, role) {
		try {
			user.role = role;

			const createdUser = await User.create(user);
			return new Result.ok(createdUser, 201);
		} catch (error) {
			return Result.serverError(error.message);
		}
	}

	static async login(username, password) {
		try {
			const user = await User.findOne({ where: { username } });
			if (!user) {
				return Result.notFound();
			}

			if (user.password !== password) {
				return Result.unauthorized();
			}

			return Result.ok(user);
		} catch (error) {
			return Result.serverError(error.message);
		}
	}
}

module.exports = UserService;