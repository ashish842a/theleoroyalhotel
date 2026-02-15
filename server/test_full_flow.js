const axios = require('axios');

const client = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true
});

async function testBookingFlow() {
    try {
        console.log("1. Logging in...");
        const loginRes = await client.post('/auth/login', {
            email: 'ashish@gmail.com',
            password: 'ashish@123'
        });
        const user = loginRes.data;
        console.log(`   Logged in as: ${user.name} (${user._id})`);

        // Extract cookies from login response
        const cookies = loginRes.headers['set-cookie'];
        if (!cookies) throw new Error("No cookies returned from login!");
        const cookieHeader = cookies.join('; ');
        console.log("   Cookies obtained:", cookieHeader);

        console.log("2. Fetching a room...");
        const roomsRes = await client.get('/rooms');
        if (roomsRes.data.length === 0) throw new Error("No rooms found!");
        const room = roomsRes.data[0];
        console.log(`   Found room: ${room.name} (${room._id})`);

        console.log("3. Creating a booking...");
        const bookingPayload = {
            user: user._id,
            bookingType: 'room',
            room: room._id,
            checkInDate: new Date(),
            checkOutDate: new Date(Date.now() + 86400000), // +1 day
            totalAmount: room.price
        };
        const bookingRes = await client.post('/bookings', bookingPayload, {
            headers: { Cookie: cookieHeader }
        });
        console.log(`   Booking created! ID: ${bookingRes.data._id}`);

        console.log("4. Verifying Booking History...");
        const historyRes = await client.get(`/bookings/user/${user._id}`, {
            headers: { Cookie: cookieHeader }
        });
        const myBookings = historyRes.data;
        console.log(`   Fetched ${myBookings.length} bookings for user.`);

        const found = myBookings.find(b => b._id === bookingRes.data._id);
        if (found) {
            console.log("✅ SUCCESS: New booking is visible in history!");
        } else {
            console.log("❌ FAILURE: New booking NOT found in history.");
        }

    } catch (error) {
        console.error("❌ Error:", error.response?.data || error.message);
    }
}

testBookingFlow();
