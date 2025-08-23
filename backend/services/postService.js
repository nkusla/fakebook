const { Post, User } = require('../models')
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

			const posts = await Post.findAll({ where: { authorUsername } });

			if (!posts || posts.length === 0) {
				return Result.notFound('No posts found');
			}

			return Result.ok(posts);
		} catch (error) {
			return Result.serverError(error.message);
		}
	}
}

module.exports = PostService;
