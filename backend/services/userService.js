const { Result, ResultStatus } = require("../utils/result");
const { User, Post, Friendship, Block, Suspension } = require('../models');
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

	static async searchUsers(usernameQuery, currentUsername) {
		try {
			if (!usernameQuery || usernameQuery.length < 2) {
				return Result.fail('Search query must be at least 2 characters', 400);
			}

			const blockedUsers = await Block.findAll({
				where: { username: currentUsername },
				attributes: ['blockedUsername']
			});

			const blockedUsernames = blockedUsers.map(block => block.blockedUsername);

			const users = await User.findAll({
				where: {
					username: {
						[Op.iLike]: `%${usernameQuery}%`,
					},
					role: {
						[Op.ne]: 'admin'
					}
				},
				attributes: ['username', 'name', 'surname', 'email'],
				limit: 10
			});

			const filteredUsers = users.filter(user => !blockedUsernames.includes(user.username));

			return Result.ok(filteredUsers);
		} catch (error) {
			return Result.serverError(error.message);
		}
	}

	static async blockUser(username, blockedUsername) {
		try {
			if (username === blockedUsername) {
				return Result.fail('You cannot block yourself', 400);
			}

			const user = await User.findOne({ where: { username } });
			if (!user) {
				return Result.notFound('User not found');
			}

			const blockedUser = await User.findOne({ where: { username: blockedUsername } });
			if (!blockedUser) {
				return Result.notFound('User to block not found');
			}

			const existingBlock = await Block.findOne({
				where: {
					username,
					blockedUsername
				}
			});

			if (existingBlock) {
				return Result.fail('User is already blocked', 400);
			}

			const block = await Block.create({ username, blockedUsername });

			const kieResult = await KieService.insertBlockFact(block);
			if (kieResult.status === ResultStatus.FAIL) {
				return kieResult;
			}

			return Result.ok(null, 200);
		} catch (error) {
			return Result.serverError(error.message);
		}
	}

	static async triggerUserSuspensions() {
		try {
			const result = await KieService.getUserSuspensions();
			if (result.status === ResultStatus.FAIL) {
				return result;
			}

			const suspensions = result.data;

			for (const suspension of suspensions) {
				await Suspension.upsert({
					username: suspension.username,
					suspendType: suspension.suspendType,
					suspendDuration: suspension.suspendDuration,
					reason: suspension.reason,
					expiresAt: suspension.expiresAt
				});
			}

			return result;
		} catch (error) {
			return Result.serverError(error.message);
		}
	}

	static async getUserSuspensions() {
		try {
			const suspensions = await Suspension.findAll();
			return Result.ok(suspensions);
		} catch (error) {
			return Result.serverError(error.message);
		}
	}

	static async checkUserSuspension(username) {
		try {
			const suspension = await Suspension.findByPk(username);

			if (suspension) {
				const now = new Date();
				// remove suspension if expired
				if (suspension.suspendType !== 'PERMANENT_BAN' && suspension.expiresAt <= now) {
					await Suspension.destroy({ where: { username } });
					return Result.ok(null);
				}
			}

			return Result.ok(suspension);
		} catch (error) {
			return Result.serverError(error.message);
		}
	}
}

module.exports = UserService;