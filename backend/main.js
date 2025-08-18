const axios = require('axios');

const kieServerUrl = 'http://localhost:8080/kie-server/services/rest/server/containers/instances/user-rules-container';
const username = 'admin';
const password = 'admin';

// Simulate stateful behavior by maintaining facts across calls
let workingMemory = [];

async function executeRules(facts) {
  try {
    const commands = facts.map((fact, index) => ({
      insert: {
        object: fact,
        //"out-identifier": `user-${index}`,
        "return-object": true
      }
    }));

    commands.push({ "fire-all-rules": {} });
    commands.push({
      "get-objects": {
        "out-identifier": "allFacts"
      }
    });

    const response = await axios.post(
      kieServerUrl,
      { commands },
      {
        auth: { username, password },
        headers: { 'Content-Type': 'application/json' }
      }
    );

    console.log('Rules execution result:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('❌ Error:', error.response ? error.response.data : error.message);
  }
} async function testStatefulBehavior() {
  console.log('=== Testing Stateful-like Behavior ===\n');

  // Step 1: Add first user
  console.log('📥 Step 1: Adding first user (age 25)...');
  const user1 = {
    "com.fakebook.model.User": {
      name: "John Doe",
      age: 25,
      email: "john@example.com",
      active: true,
      role: "USER"
    }
  };
  workingMemory.push(user1);
  await executeRules([...workingMemory]);

  console.log('\n---\n');

  // Step 2: Add second user (should trigger admin rule)
  console.log('📥 Step 2: Adding second user (age 35 - should become admin)...');
  const user2 = {
    "com.fakebook.model.User": {
      name: "Jane Smith",
      age: 35,
      email: "jane@example.com",
      active: true,
      role: "USER"
    }
  };
  workingMemory.push(user2);
  await executeRules([...workingMemory]);

  console.log('\n---\n');

  // Step 3: Update first user's age (simulate state change)
  console.log('� Step 3: Updating first user age to 32 (should now become admin)...');
  workingMemory[0]["com.fakebook.model.User"].age = 32;
  await executeRules([...workingMemory]);

  console.log('\n---\n');

  // Step 4: Add a young user (should be deactivated)
  console.log('📥 Step 4: Adding young user (age 16 - should be deactivated)...');
  const user3 = {
    "com.fakebook.model.User": {
      name: "Bobby Young",
      age: 16,
      email: "bobby@example.com",
      active: true,
      role: "USER"
    }
  };
  workingMemory.push(user3);
  await executeRules([...workingMemory]);

  console.log('\n✅ Demo complete! This simulates stateful behavior by maintaining facts between rule executions.');
}

testStatefulBehavior();