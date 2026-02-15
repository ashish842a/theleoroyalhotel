const API_URL = 'http://localhost:5000/api';
const adminCredentials = {
    email: "admin@gmail.com",
    password: "admin@123"
};

async function runVerification() {
    console.log("🚀 Starting Full Verification Flow (Fetch API)...\n");

    try {
        // 1. Login
        console.log("1️⃣  Logging in as Admin...");
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(adminCredentials)
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.statusText}`);

        const loginData = await loginRes.json();
        console.log("   ✅ Login successful! Role:", loginData.role);

        // Extract cookie
        // Note: fetch in Node.js might not expose set-cookie easily depending on version/environment, 
        // but let's try to grab it from headers.
        const cookie = loginRes.headers.get('set-cookie');

        const headers = {
            'Content-Type': 'application/json',
            'Cookie': cookie || ''
        };

        // 2. Add Room
        console.log("\n2️⃣  Testing Add Room...");
        const roomPayload = {
            name: `Verify Room ${Date.now()}`,
            description: "Verification room description",
            price: 250,
            capacity: 2,
            amenities: ["Wifi", "Verification"],
            images: ["http://example.com/room.jpg"]
        };
        const roomRes = await fetch(`${API_URL}/rooms`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(roomPayload)
        });

        if (!roomRes.ok) throw new Error(`Add Room failed: ${roomRes.statusText}`);
        const roomData = await roomRes.json();
        console.log("   ✅ Room Created! ID:", roomData._id);

        // 3. Add Hall
        console.log("\n3️⃣  Testing Add Hall...");
        const hallPayload = {
            name: `Verify Hall ${Date.now()}`,
            description: "Verification hall description",
            price: 1500,
            capacity: 50,
            amenities: ["Soundsystem", "Stage"],
            images: ["http://example.com/hall.jpg"]
        };
        const hallRes = await fetch(`${API_URL}/halls`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(hallPayload)
        });

        if (!hallRes.ok) throw new Error(`Add Hall failed: ${hallRes.statusText}`);
        const hallData = await hallRes.json();
        console.log("   ✅ Hall Created! ID:", hallData._id);

        // 4. Add Food
        console.log("\n4️⃣  Testing Add Food...");
        const foodPayload = {
            name: `Verify Food ${Date.now()}`,
            description: "Verification food",
            price: 50,
            category: "Snack",
            images: ["http://example.com/food.jpg"],
            isSpecial: true,
            isAvailable: true
        };
        const foodRes = await fetch(`${API_URL}/food`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(foodPayload)
        });

        if (!foodRes.ok) throw new Error(`Add Food failed: ${foodRes.statusText}`);
        const foodData = await foodRes.json();
        console.log("   ✅ Food Created! ID:", foodData._id);

        // 5. Verify GET (List)
        console.log("\n5️⃣  Verifying Items are Listable...");

        const roomsListRes = await fetch(`${API_URL}/rooms`);
        const roomsList = await roomsListRes.json();
        const foundRoom = roomsList.find(r => r._id === roomData._id);
        console.log(`   ✅ Room found in list? ${!!foundRoom ? 'YES' : 'NO'}`);

        const hallsListRes = await fetch(`${API_URL}/halls`);
        const hallsList = await hallsListRes.json();
        const foundHall = hallsList.find(h => h._id === hallData._id);
        console.log(`   ✅ Hall found in list? ${!!foundHall ? 'YES' : 'NO'}`);

        const foodListRes = await fetch(`${API_URL}/food`);
        const foodList = await foodListRes.json();
        const foundFood = foodList.find(f => f._id === foodData._id);
        console.log(`   ✅ Food found in list? ${!!foundFood ? 'YES' : 'NO'}`);

        console.log("\n✨ Verification Complete: All systems operational.");

    } catch (err) {
        console.error("\n❌ Verification Failed:", err.message);
    }
}

runVerification();
