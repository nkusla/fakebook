const axios = require('axios');
const { Result } = require('../utils/result');

class KieService {
	constructor() {
		this.kieServerUrl = process.env.KIE_SERVER_URL;
		this.username = process.env.KIE_USERNAME;
		this.password = process.env.KIE_PASSWORD;
	}

	// Generic method for executing commands
	async executeCommands(commands) {
		try {
			const response = await axios.post(
				this.kieServerUrl,
				{ commands },
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
			{
				"insert": {
					"object": userFact,
				}
			},
			// { "fire-all-rules": {} }
		]);
	}
}

module.exports = new KieService();