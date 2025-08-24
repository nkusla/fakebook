const axios = require('axios');
const { Result, ResultStatus } = require('../utils/result');

class KieService {
	constructor() {
		this.kieServerUrl = process.env.KIE_SERVER_URL;
		this.username = process.env.KIE_USERNAME;
		this.password = process.env.KIE_PASSWORD;
	}

	async setDummyGlobals(username = "testUser") {
		// const commands = [
		// 	{ "set-global": { "identifier": "currentUser", "object": { "com.fakebook.model.User": { "username": username } } } },
		// 	{ "set-global": { "identifier": "feedPosts", "object": [] } }
		// ];

		// return this.executeCommands(commands);
	}

	// Generic method for executing commands
	async executeCommands(commands) {

		const payload = {
			"lookup": "ksession-rules",
			"commands": commands
		};

		try {
			const response = await axios.post(
				this.kieServerUrl,
				payload,
				{
					auth: { username: this.username, password: this.password },
					headers: { 'Content-Type': 'application/json' }
				}
			);
			return Result.ok(response.data);
		} catch (error) {
			console.error('❌ KIE Server Error:', error.response?.data || error.message);
			return Result.serverError('Rules engine operation failed');
		}
	}

	async insertUserFact(user) {
		const userFact = {
			"com.fakebook.model.User": {
				"username": user.username
			}
		};

		return this.executeCommands([
			{ "insert": { "object": userFact } },
		]);
	}

	async insertPostFact(post) {
		const postFact = {
			"com.fakebook.model.Post": {
				"id": post.id,
				"authorUsername": post.authorUsername,
				"hashtags": post.hashtags,
				"createdAt": post.createdAt
			}
		};

		return this.executeCommands([
			{ "insert": { "object": postFact } },
			{ "set-focus": { "name": "popular" } },
			{ "fire-all-rules": {} }
		]);
	}

	async insertFriendshipFact(friendship) {
		const friendshipFact = {
			"com.fakebook.model.Friendship": {
				"username1": friendship.username1,
				"username2": friendship.username2
			}
		};

		return this.executeCommands([
			{ "insert": { "object": friendshipFact } },
		]);
	}

	async insertLikeFact(like) {
		const likeFact = {
			"com.fakebook.model.Like": {
				"postId": like.postId,
				"username": like.username,
				"createdAt": like.createdAt
			}
		};

		return this.executeCommands([
			{ "insert": { "object": likeFact } },
			{ "set-focus": { "name": "popular" } },
			{ "fire-all-rules": {} }
		]);
	}

	async getFeedPosts(username) {

		const commands = [
			//{ "set-global": { "identifier": "currentUser", "object": { "com.fakebook.model.User": { "username": "zeka123" } } } },
			// { "set-global": { "identifier": "feedPosts", "object": [] } },
			{ "set-focus": { "name": "feed" } },
			{ "fire-all-rules": {} },
			//{ "get-global": { "identifier": "feedPosts" } }
		];

		const result = await this.executeCommands(commands);

		if (result.status === ResultStatus.FAIL) {
			return result;
		}

		// const response = result.data;
		// const feedPosts = response.result['execution-results'].results[0].value;
		return Result.ok(result.data);
	}
}

module.exports = new KieService();