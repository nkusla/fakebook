const axios = require('axios');

const kieServerUrl = 'http://localhost:8080/kie-server/services/rest/server/containers/instances/fakebook-rules';
const username = 'admin';
const password = 'admin';

async function insertAndGetUser(userFact) {
  try {
    const commands = [
      {
        "insert": {
          "object": userFact,
          "return-object": true,
          "out-identifier": ""
        }
      },
      {
        "fire-all-rules": {}
      }
    ];

    const response = await axios.post(
      kieServerUrl,
      { commands },
      {
        auth: { username, password },
        headers: { 'Content-Type': 'application/json' }
      }
    );

    console.log('Insert result:', JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    console.error('❌ Error inserting user:', error.response ? error.response.data : error.message);
  }
}

async function testStatefulBehavior() {

  const userFact = {
    "com.fakebook.model.User": {
      username: "test123"
    }
  };

  const insertedUser = await insertAndGetUser(userFact);
}

testStatefulBehavior();