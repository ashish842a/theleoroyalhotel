const axios = require('axios');

async function testRegistration() {
    const url = 'http://localhost:5000/api/auth/register';

    // Generate random user to avoid duplicate email errors
    const randomId = Math.floor(Math.random() * 10000);
    const userData = {
        name: `Test User ${randomId}`,
        email: `test${randomId}@example.com`,
        password: 'password123',
        phone: '1234567890'
    };

    console.log("Testing Registration with URL:", url);
    console.log("Sending Data:", userData);

    try {
        const response = await axios.post(url, userData);
        console.log("\n✅ SUCCESS!");
        console.log("Status Code:", response.status);
        console.log("Response Data:", response.data);
    } catch (error) {
        console.log("\n❌ FAILED!");
        if (error.response) {
            console.log("Status Code:", error.response.status);
            console.log("Error Message:", error.response.data);
        } else if (error.request) {
            console.log("No response received from server. Is it running?");
            console.log("Error details:", error.message);
        } else {
            console.log("Error setup:", error.message);
        }
    }
}

testRegistration();
