const { Friendship, User } = require('../models');
const { Result, ResultStatus } = require('../utils/result');
const { Op } = require('sequelize');

class FriendshipService {
	static async createFriendship(username1, username2) {
		try {
			// Validation
			if (!username2) {
				return Result.fail('Username2 is required');
			}

			if (username1 === username2) {
				return Result.fail('Cannot create friendship with yourself');
			}

			const user2 = await User.findOne({ where: { username: username2 } });
			if (!user2) {
				return Result.notFound('User not found');
			}

			const existingFriendship = await Friendship.findOne({
				where: {
					username1: username1 < username2 ? username1 : username2,
					username2: username1 < username2 ? username2 : username1
				}
			});

			if (existingFriendship) {
				return Result.fail('Friendship already exists');
			}

			// Create friendship (always store with lexicographically smaller username first)
			const friendship = await Friendship.create({
				username1: username1 < username2 ? username1 : username2,
				username2: username1 < username2 ? username2 : username1
			});

			return Result.ok(friendship, 201);
		} catch (error) {
			return Result.serverError(error.message);
		}
	}

	static async getFriends(username) {
		try {
			const friendships = await Friendship.findAll({
				where: {
					[Op.or]: [
						{ username1: username },
						{ username2: username }
					]
				},
				include: [
					{
						model: User,
						as: 'user1',
						attributes: ['username', 'name', 'surname', 'email']
					},
					{
						model: User,
						as: 'user2',
						attributes: ['username', 'name', 'surname', 'email']
					}
				]
			});

			// Extract friends (the other user in each friendship)
			const friends = friendships.map(friendship => {
				if (friendship.username1 === username) {
					return friendship.user2;
				} else {
					return friendship.user1;
				}
			});

			return Result.ok(friends);
		} catch (error) {
			return Result.fail(error.message);
		}
	}

	static async removeFriendship(username1, username2) {
		try {
			if (!username2) {
				return new Result(ResultStatus.ERROR, null, 'Username2 is required');
			}

			// Find and delete the friendship
			const deletedCount = await Friendship.destroy({
				where: {
					username1: username1 < username2 ? username1 : username2,
					username2: username1 < username2 ? username2 : username1
				}
			});

			if (deletedCount === 0) {
				return Result.fail('Friendship not found');
			}

			return Result.ok();
		} catch (error) {
			return Result.fail(error.message);
		}
	}

	static async checkFriendship(username1, username2) {
		try {
			const friendship = await Friendship.findOne({
				where: {
					username1: username1 < username2 ? username1 : username2,
					username2: username1 < username2 ? username2 : username1
				}
			});

			return Result.ok({
				areFriends: !!friendship,
				friendship: friendship
			});
		} catch (error) {
			return Result.fail(error.message);
		}
	}
}

module.exports = FriendshipService;
