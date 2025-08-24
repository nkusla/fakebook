const axios = require('axios');
const { Result, ResultStatus } = require('../utils/result');

class KieService {
	constructor() {
		this.kieServerUrl = process.env.KIE_SERVER_URL;
		this.axios = axios.create({
			baseURL: this.kieServerUrl,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	// Generic method for executing commands
	async insertFact(fact, path) {
		try {
			const response = await this.axios.post(path, fact);
			return Result.ok(response.data);
		} catch (error) {
			console.error('❌ KIE Server Error:', error.response?.data || error.message);
			return Result.serverError('Rules engine operation failed');
		}
	}

	async insertUserFact(user) {
		const userFact = {
			"username": user.username
		};

		return this.insertFact(userFact, '/user');
	}

	async insertPostFact(post) {
		const postFact = {
			"id": post.id,
			"authorUsername": post.authorUsername,
			"hashtags": post.hashtags,
			"createdAt": post.createdAt
		};

		return this.insertFact(postFact, '/post');
	}

	async insertFriendshipFact(friendship) {
		const friendshipFact = {
			"username1": friendship.username1,
			"username2": friendship.username2
		};

		return this.insertFact(friendshipFact, '/friendship');
	}

	async insertLikeFact(like) {
		const likeFact = {
			"postId": like.postId,
			"username": like.username,
			"createdAt": like.createdAt
		};

		return this.insertFact(likeFact, '/like');
	}

	async getFeedPosts(username) {
		try {
			const response = await this.axios.get(`/feed/${username}`);
			return Result.ok(response.data);
		} catch (error) {
			console.error('❌ KIE Server Error:', error.response?.data || error.message);
			return Result.serverError('Failed to retrieve feed');
		}
	}
}

module.exports = new KieService();