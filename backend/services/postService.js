const { Post, User, Like } = require('../models')
const { Result, ResultStatus } = require('../utils/result');
const KieService = require('./kieService');

class PostService {

	static async createPost({ authorUsername, content, hashtags }) {
		try {
			if (!authorUsername || !content) {
				return Result.fail('Author username and content are required');
			}

			const user = await User.findOne({ where: { username: authorUsername } });

			if (!user) {
				return Result.notFound('User not found');
			}

			const post = await Post.create({
				authorUsername,
				content,
				hashtags
			});

			const kieResult = await KieService.insertPostFact(post);

			if (kieResult.status === ResultStatus.FAIL) {
				return kieResult;
			}

			return Result.ok(post, 201);
		} catch (error) {
			return Result.serverError(error.message);
		}
	}

	static async getPostsByUser(authorUsername) {
		try {
			if (!authorUsername) {
				return Result.fail('Author username is required');
			}

			const posts = await Post.findAll({
				where: { authorUsername },
				attributes: {
					include: [
						[
							// Sequelize.fn('COUNT', Sequelize.col('Likes.id')) will count likes for each post
							require('sequelize').fn('COUNT', require('sequelize').col('Likes.postId')),
							'likeCount'
						]
					]
				},
				include: [
					{
						model: Like,
						attributes: [],
					}
				],
				group: ['Post.id'],
				order: [['createdAt', 'DESC']]
			});

			if (!posts || posts.length === 0) {
				return Result.notFound('No posts found');
			}

			return Result.ok(posts);
		} catch (error) {
			return Result.serverError(error.message);
		}
	}

	static async likePost(postId, username) {
		try {
			if (!postId || !username) {
				return Result.fail('Post ID and username are required');
			}

			const post = await Post.findByPk(postId);

			if (!post) {
				return Result.notFound('Post not found');
			}

			const like = await Like.create({ postId, username });

			const kieResult = await KieService.insertLikeFact(like);
			if (kieResult.status === ResultStatus.FAIL) {
				return kieResult;
			}

			return Result.ok(like, 201);
		} catch (error) {
			return Result.serverError(error.message);
		}
	}

	static async getFeedPosts(username) {
		try {
			if (!username) {
				return Result.fail('Username is required');
			}

			const feedPosts = await KieService.getFeedPosts(username);

			if (feedPosts.status === ResultStatus.FAIL) {
				return feedPosts;
			}

			return Result.ok(feedPosts.data);
		} catch (error) {
			return Result.serverError(error.message);
		}
	}

}

module.exports = PostService;
