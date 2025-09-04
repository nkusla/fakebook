const { Result, ResultStatus } = require("../utils/result");
const { User, Post, Friendship } = require('../models');
const { Op } = require('sequelize');
const KieService = require('./kieService');

class UserService {
	static async register(user, role) {
		try {
			user.role = role;

			const createdUser = await User.create(user);

			const kieResult = await KieService.insertUserFact(createdUser);
			if (kieResult.status === ResultStatus.FAIL) {
				return kieResult;
			}

			return Result.ok(createdUser, 201);
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

	static async isUserNew(username) {
		try {
			const user = await User.findOne({ where: { username } });
			if (!user) {
				return Result.notFound();
			}

			const postCount = await Post.count({
      	where: { authorUsername: username }
    	});

			const friendCount = await Friendship.count({
				where: {
					[Op.or]: [
						{ username1: username },
						{ username2: username }
					]
				}
			});

			const isNew = (friendCount === 0 && postCount === 0);

			return Result.ok(isNew);
		} catch (error) {
			return Result.serverError(error.message);
		}
	}

	static async getUserProfile(username) {
		try {
			const user = await User.findOne({
				where: { username },
				attributes: { exclude: ['password', 'role'] }
			});

			if (!user) {
				return Result.notFound();
			}

			return Result.ok(user);
		}
		catch (error) {
			return Result.serverError(error.message);
		}
	}
}

module.exports = UserService;