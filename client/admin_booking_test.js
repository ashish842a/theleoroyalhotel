const puppeteer = require('puppeteer');

(async () => {
    console.log("🚀 Starting Admin Booking Management Test...");
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized']
    });
    const page = (await browser.pages())[0];

    try {
        const timestamp = Date.now();
        const userEmail = `test_user_${timestamp}@example.com`;
        const userName = `Test User ${timestamp}`;
        const adminEmail = "admin@gmail.com";
        const adminPassword = "admin@123";

        // Step 1: Create a user and book a room
        console.log("\n1️⃣  Creating User and Booking...");
        await page.goto('http://localhost:3000/register', { waitUntil: 'networkidle0' });
        await page.type('#name', userName);
        await page.type('#email', userEmail);
        await page.type('#password', 'password123');
        await page.type('#phone', '1234567890');

        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            page.click('button[type="submit"]')
        ]);
        console.log("   ✅ User Registered");

        // Login
        if (page.url().includes('/login')) {
            await page.type('#email', userEmail);
            await page.type('#password', 'password123');
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'networkidle0' }),
                page.click('button[type="submit"]')
            ]);
            console.log("   ✅ User Logged In");
        }

        // Book a room
        await page.goto('http://localhost:3000/rooms', { waitUntil: 'networkidle0' });
        const roomLink = await page.$('a[href^="/rooms/"]');
        if (!roomLink) throw new Error("No rooms found!");

        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            roomLink.click()
        ]);

        const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
        const nextDay = new Date(); nextDay.setDate(nextDay.getDate() + 2);

        await page.type('input[name="checkInDate"]', tomorrow.toISOString().split('T')[0]);
        await page.type('input[name="checkOutDate"]', nextDay.toISOString().split('T')[0]);
        await page.type('input[name="purpose"]', 'Admin Test Booking');

        await page.click('button[type="submit"]');
        await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });
        console.log("   ✅ Booking Created");

        // Step 2: Logout and login as admin
        console.log("\n2️⃣  Logging in as Admin...");

        // Force logout by clearing cookies and local storage
        const client = await page.target().createCDPSession();
        await client.send('Network.clearBrowserCookies');
        await page.evaluate(() => localStorage.clear());

        console.log("   ✅ Cleared Cookies/Storage");
        await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });

        // Short wait to ensure UI updates
        await page.waitForTimeout(1000);

        // Login as admin
        await page.type('#email', adminEmail);
        await page.type('#password', adminPassword);
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            page.click('button[type="submit"]')
        ]);
        console.log("   ✅ Admin Logged In");

        // Step 3: Navigate to admin bookings page
        console.log("\n3️⃣  Navigating to Admin Bookings...");
        await page.goto('http://localhost:3000/admin/bookings', { waitUntil: 'networkidle0' });
        console.log("   ✅ On Admin Bookings Page");

        // Step 4: Find and confirm the booking
        console.log("\n4️⃣  Finding Pending Booking...");

        // Wait for bookings to load
        await page.waitForTimeout(2000);

        // Look for the pending booking
        const pendingBookings = await page.$$('span.text-amber-700');
        if (pendingBookings.length === 0) {
            console.error("   ❌ No pending bookings found!");
            const bodyText = await page.evaluate(() => document.body.innerText);
            console.log("   Page content:", bodyText.substring(0, 300));
            throw new Error("No pending bookings found");
        }
        console.log(`   ✅ Found ${pendingBookings.length} pending booking(s)`);

        // Click the confirm button for the first pending booking
        console.log("\n5️⃣  Confirming Booking...");
        const confirmButton = await page.$('button[title="Confirm"], button:has-text("✓")');
        if (!confirmButton) {
            console.error("   ❌ Confirm button not found!");
            throw new Error("Confirm button not found");
        }

        await confirmButton.click();
        await page.waitForTimeout(2000);
        console.log("   ✅ Clicked Confirm Button");

        // Verify the booking status changed to Confirmed
        console.log("\n6️⃣  Verifying Confirmation...");
        const confirmedBookings = await page.$$('span.text-green-700');
        if (confirmedBookings.length > 0) {
            console.log("   ✅ SUCCESS: Booking confirmed!");
        } else {
            console.log("   ⚠️  Could not verify confirmation status");
        }

        console.log("\n🎉 ADMIN BOOKING MANAGEMENT TEST COMPLETED!");

    } catch (err) {
        console.error("\n❌ TEST FAILED:", err.message);
        console.error(err.stack);
        await page.screenshot({ path: 'admin_booking_fail.png' });
    } finally {
        console.log("\n   Browser left open for inspection.");
        // await browser.close();
    }
})();
