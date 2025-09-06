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
			"content": post.content,
			"hashtags": post.hashtags || [],
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

	async insertBlockFact(block) {
		const blockFact = {
			"username": block.username,
			"blockedUsername": block.blockedUsername,
			"createdAt": block.createdAt
		};

		return this.insertFact(blockFact, '/block');
	}

	async insertReportFact(report) {
		const reportFact = {
			"postId": report.postId,
			"username": report.username,
			"createdAt": report.createdAt
		};

		return this.insertFact(reportFact, '/report');
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

	async getAdvancedFeedPosts(username) {
		try {
			const response = await this.axios.get(`/feed/advanced/${username}`);
			return Result.ok(response.data);
		} catch (error) {
			console.error('❌ KIE Server Error:', error.response?.data || error.message);
			return Result.serverError('Failed to retrieve feed');
		}
	}

	async deleteAllFacts() {
		try {
			const response = await this.axios.delete(`/facts`);
			return Result.ok(response.data);
		} catch (error) {
			console.error('❌ KIE Server Error:', error.response?.data || error.message);
			return Result.serverError('Failed to delete all facts');
		}
	}
}

module.exports = new KieService();