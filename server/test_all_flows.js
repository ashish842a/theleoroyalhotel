const API_URL = 'http://localhost:5000/api';

// Utilities
const generateRandomUser = () => {
    const id = Date.now();
    return {
        name: `Test User ${id}`,
        email: `test_user_${id}@example.com`,
        password: "password123",
        phone: "9999999999"
    };
};

const adminCredentials = {
    email: "admin@gmail.com",
    password: "admin@123"
};

async function runSystemTest() {
    console.log("⚡ STARTING AUTOMATED SYSTEM TEST ⚡\n");
    console.log("------------------------------------------");

    try {
        // ==========================================
        // 1. TEST REGISTRATION & USER LOGIN
        // ==========================================
        console.log("\n🧪 TEST 1: User Registration & Login");

        const newUser = generateRandomUser();
        console.log(`   Detailed: Registering user '${newUser.email}'...`);

        // Register
        const regRes = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        });

        if (!regRes.ok) {
            const err = await regRes.text();
            throw new Error(`Registration Failed: ${regRes.statusText} - ${err}`);
        }
        console.log("   ✅ Registration Successful");

        // Login as New User
        console.log(`   Detailed: Logging in as '${newUser.email}'...`);
        const userLoginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: newUser.email, password: newUser.password })
        });

        if (!userLoginRes.ok) throw new Error(`User Login Failed: ${userLoginRes.statusText}`);
        const userData = await userLoginRes.json();
        console.log(`   ✅ User Login Successful (Role: ${userData.role})`);


        // ==========================================
        // 2. TEST ADMIN LOGIN
        // ==========================================
        console.log("\n🧪 TEST 2: Admin Authentication");
        console.log(`   Detailed: Logging in as Admin '${adminCredentials.email}'...`);

        const adminLoginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(adminCredentials)
        });

        if (!adminLoginRes.ok) throw new Error(`Admin Login Failed: ${adminLoginRes.statusText}`);
        const adminData = await adminLoginRes.json();
        console.log(`   ✅ Admin Login Successful (Role: ${adminData.role})`);

        // Capture Admin Cookie/Token for subsequent requests
        const adminCookie = adminLoginRes.headers.get('set-cookie');
        const headers = {
            'Content-Type': 'application/json',
            'Cookie': adminCookie || ''
        };


        // ==========================================
        // 3. TEST ADDING ROOM
        // ==========================================
        console.log("\n🧪 TEST 3: Add Room (Admin)");
        const roomPayload = {
            name: `AutoTest Room ${Date.now()}`,
            description: "Automated test room",
            price: 550,
            capacity: 3,
            amenities: ["Wifi", "Automation"],
            images: ["http://example.com/auto-room.jpg"]
        };

        const roomRes = await fetch(`${API_URL}/rooms`, {
            method: 'POST', headers, body: JSON.stringify(roomPayload)
        });

        if (!roomRes.ok) throw new Error(`Add Room Failed: ${roomRes.statusText}`);
        const roomData = await roomRes.json();
        console.log(`   ✅ Room Created Successfully (ID: ${roomData._id})`);


        // ==========================================
        // 4. TEST ADDING HALL
        // ==========================================
        console.log("\n🧪 TEST 4: Add Hall (Admin)");
        const hallPayload = {
            name: `AutoTest Hall ${Date.now()}`,
            description: "Automated test hall",
            price: 5000,
            capacity: 200,
            amenities: ["Projector", "Speaker"],
            images: ["http://example.com/auto-hall.jpg"]
        };

        const hallRes = await fetch(`${API_URL}/halls`, {
            method: 'POST', headers, body: JSON.stringify(hallPayload)
        });

        if (!hallRes.ok) throw new Error(`Add Hall Failed: ${hallRes.statusText}`);
        const hallData = await hallRes.json();
        console.log(`   ✅ Hall Created Successfully (ID: ${hallData._id})`);


        // ==========================================
        // 5. TEST ADDING FOOD
        // ==========================================
        console.log("\n🧪 TEST 5: Add Food (Admin)");
        const foodPayload = {
            name: `AutoTest Food ${Date.now()}`,
            description: "Automated test meal",
            price: 150,
            category: "Main Course",
            images: ["http://example.com/auto-food.jpg"],
            isSpecial: false,
            isAvailable: true
        };

        const foodRes = await fetch(`${API_URL}/food`, {
            method: 'POST', headers, body: JSON.stringify(foodPayload)
        });

        if (!foodRes.ok) throw new Error(`Add Food Failed: ${foodRes.statusText}`);
        const foodData = await foodRes.json();
        console.log(`   ✅ Food Created Successfully (ID: ${foodData._id})`);

        console.log("\n------------------------------------------");
        console.log("🎉 ALL TESTS PASSED SUCCESSFULLY! 🎉");
        console.log("------------------------------------------");

    } catch (error) {
        console.error("\n❌ TEST FAILED:", error.message);
        process.exit(1);
    }
}

runSystemTest();
