const { Post, User, Like } = require('../models')
const { Result, ResultStatus } = require('../utils/result');
const UserService = require('./userService');
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
				order: [['createdAt', 'DESC']]
			});

			if (!posts || posts.length === 0) {
				return Result.notFound('No posts found');
			}

			const postsWithLikes = await Promise.all(
				posts.map(async post => {
					const likeResult = await PostService._likeCount(post.id);
					const likeCount = likeResult.status === ResultStatus.OK ? likeResult.data : 0;
					return {
						...post.toJSON(),
						hashtags: post.hashtags || [],
						likeCount
					};
				})
			);



			return Result.ok(postsWithLikes);
		} catch (error) {
			return Result.serverError(error.message);
		}
	}

	static async _likeCount(postId) {
		try {
			if (!postId) {
				return Result.fail('Post ID is required');
			}

			const likeCount = await Like.count({ where: { postId } });

			return Result.ok(likeCount);
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

			const result = await UserService.isUserNew(username);
			const isNew = result.data;

			const postsResult = isNew
				? await KieService.getAdvancedFeedPosts(username)
				: await KieService.getFeedPosts(username);

			if (postsResult.status === ResultStatus.FAIL) {
				return postsResult;
			}

			const sortedPosts = isNew
				? PostService._sortAdvancedFeedPosts(postsResult.data)
				: PostService._sortFeedPosts(postsResult.data);

			const feedPostsWithLikes = await Promise.all(
				sortedPosts.map(async p => {
					const likeResult = await PostService._likeCount(p.id);
					const likeCount = likeResult.status === ResultStatus.OK ? likeResult.data : 0;
					return {
						...p,
						likeCount
					};
				})
			);

			return Result.ok(feedPostsWithLikes);
		} catch (error) {
			return Result.serverError(error.message);
		}
	}

	static _sortFeedPosts(feedPosts) {
		return feedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
	}

	static _sortAdvancedFeedPosts(feedPosts) {
		return feedPosts
			.sort((a, b) => {
				if (b.score !== a.score) {
					return b.score - a.score;
				}

				return new Date(b.createdAt) - new Date(a.createdAt);
			})
			.slice(0, 20);
	}

}

module.exports = PostService;
