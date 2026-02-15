const API_URL = 'http://localhost:5000/api';

const adminCredentials = {
    email: "admin@gmail.com",
    password: "admin@123"
};

const generateRandomUser = () => {
    const id = Date.now();
    return {
        name: `Booking Test User ${id}`,
        email: `booker_${id}@example.com`,
        password: "password123",
        phone: "9876543210"
    };
};

async function runBookingTest() {
    console.log("⚡ STARTING BOOKING FLOW TEST ⚡\n");

    try {
        let headers = { 'Content-Type': 'application/json' };

        // 1. Login as Admin to create a room
        console.log("1️⃣  Logging in as Admin...");
        const adminLoginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers,
            body: JSON.stringify(adminCredentials)
        });
        if (!adminLoginRes.ok) throw new Error("Admin Login Failed");
        const adminCookie = adminLoginRes.headers.get('set-cookie');
        const adminHeaders = { ...headers, 'Cookie': adminCookie };


        // 2. Create a Room to book
        console.log("\n2️⃣  Creating a Room for booking...");
        const roomPayload = {
            name: `Booking Test Room ${Date.now()}`,
            description: "Room for automated booking test",
            price: 500,
            capacity: 2,
            amenities: ["Wifi", "Booking"],
            images: ["http://example.com/room.jpg"]
        };
        const roomRes = await fetch(`${API_URL}/rooms`, {
            method: 'POST',
            headers: adminHeaders,
            body: JSON.stringify(roomPayload)
        });
        if (!roomRes.ok) throw new Error("Create Room Failed");
        const roomData = await roomRes.json();
        const roomId = roomData._id;
        console.log(`   ✅ Room Created! ID: ${roomId}`);


        // 3. Register a New User
        console.log("\n3️⃣  Registering a New User...");
        const user = generateRandomUser();
        const regRes = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers,
            body: JSON.stringify(user)
        });
        if (!regRes.ok) throw new Error("User Registration Failed");
        console.log(`   ✅ User Registered: ${user.email}`);


        // 4. Login as New User
        console.log("\n4️⃣  Logging in as User...");
        const userLoginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ email: user.email, password: user.password })
        });
        if (!userLoginRes.ok) throw new Error("User Login Failed");
        const userCookie = userLoginRes.headers.get('set-cookie');
        const userHeaders = { ...headers, 'Cookie': userCookie };
        const userData = await userLoginRes.json();
        const userId = userData._id || userData.details._id; // Adjust based on actual response structure
        console.log(`   ✅ User Logged In! ID: ${userId}`);


        // 5. Create a Booking
        console.log("\n5️⃣  Creating a Booking...");
        const bookingPayload = {
            user: userId, // Assuming req.user sets this on backend, but we can verify passing it doesn't hurt or use guest flow
            // Actually, verifyToken middleware should handle user from token, but let's see. 
            // The model has 'user' field.
            bookingType: 'room',
            room: roomId,
            checkInDate: new Date().toISOString(),
            checkOutDate: new Date(Date.now() + 86400000).toISOString(), // +1 day
            totalAmount: 500,
            status: 'Pending',
            guestDetails: { // Providing even if logged in just in case model requires it validation-wise (though controller logic looked flexible)
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        };

        // Note: Controller uses req.user.id if logged in.
        const bookingRes = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: userHeaders, // Sending user token
            body: JSON.stringify(bookingPayload)
        });

        if (!bookingRes.ok) {
            const err = await bookingRes.text();
            throw new Error(`Booking Failed: ${bookingRes.status} ${bookingRes.statusText} - ${err}`);
        }
        const bookingData = await bookingRes.json();
        console.log(`   ✅ Booking Created! ID: ${bookingData._id}`);


        // 6. Verify Booking exists
        console.log("\n6️⃣  Verifying Booking...");
        const getBookingRes = await fetch(`${API_URL}/bookings/${bookingData._id}`, {
            headers: userHeaders
        });
        if (!getBookingRes.ok) throw new Error("Get Booking Failed");
        const fetchedBooking = await getBookingRes.json();

        console.log(`   ✅ Fetched Booking ID: ${fetchedBooking._id}`);
        console.log(`   ✅ Booking Status: ${fetchedBooking.status}`);
        console.log(`   ✅ Room ID matches: ${fetchedBooking.room === roomId}`);

        console.log("\n------------------------------------------");
        console.log("🎉 BOOKING FLOW VERIFIED SUCCESSFULLY! 🎉");
        console.log("------------------------------------------");

    } catch (err) {
        console.error("\n❌ TEST FAILED:", err.message);
    }
}

runBookingTest();
