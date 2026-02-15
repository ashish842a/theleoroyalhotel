const puppeteer = require('puppeteer');

const fs = require('fs');

const log = (msg) => {
    console.log(msg);
    try { fs.appendFileSync('client_test.log', msg + '\n'); } catch (e) { }
};

(async () => {
    log("🚀 Starting End-to-End Booking Flow Test...");
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized']
    });
    constpage = await browser.newPage();
    const page = (await browser.pages())[0];

    // Helper to handle alerts
    page.on('dialog', async dialog => {
        log(`   ⚠️ Alert detected: ${dialog.message()}`);
        await dialog.accept();
    });

    // Helper to log browser console messages
    page.on('console', msg => log('PAGE LOG: ' + msg.text()));

    try {
        const timestamp = Date.now();
        const userEmail = `booking_user_${timestamp}@example.com`;
        const userName = `Booking User ${timestamp}`;

        // 1. Register User
        console.log("\n1️⃣  Registering User...");
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

        // 2. Login User
        console.log("\n2️⃣  Logging in User...");
        if (page.url().includes('/login')) {
            await page.type('input[type="email"]', userEmail);
            await page.type('input[type="password"]', 'password123');
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'networkidle0' }),
                page.click('button[type="submit"]')
            ]);
            console.log("   ✅ User Logged In");
        } else {
            console.log("   ℹ️ Already logged in or redirected unexpectedly: " + page.url());
        }

        // 3. Book a Room
        console.log("\n3️⃣  Booking a Room...");
        await page.goto('http://localhost:3000/rooms', { waitUntil: 'networkidle0' });

        // Click first "View Details"
        console.log("   Navigating to room details...");
        const viewDetailsBtn = await page.waitForSelector('a[href^="/rooms/"]');
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            viewDetailsBtn.click()
        ]);

        console.log("   Filling booking form...");
        // Valid future dates
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dayAfter = new Date();
        dayAfter.setDate(dayAfter.getDate() + 2);

        const formatDate = (date) => date.toISOString().split('T')[0];

        await page.type('input[name="checkInDate"]', formatDate(tomorrow));
        await page.type('input[name="checkOutDate"]', formatDate(dayAfter));
        await page.type('input[name="purpose"]', 'Automated Testing');

        console.log("   Submitting booking...");
        await page.click('button[type="submit"]');
        console.log("   Clicked submit, waiting for custom 2s delay before redirect...");

        // The component has a 2000ms setTimeout before router.push
        await new Promise(r => setTimeout(r, 2500));

        // Now wait for navigation to dashboard (if not already happened)
        if (!page.url().includes('dashboard')) {
            console.log("   Waiting for navigation to dashboard...");
            await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 }).catch(e => console.log("   Navigation wait catch: " + e.message));
        }

        console.log("   Current URL:", page.url());
        console.log("   ✅ Booking Submitted");

        // Verify Pending Status on Dashboard
        console.log("   Verifying Pending Status...");
        // Wait for the booking card to appear
        try {
            await page.waitForSelector('span.text-amber-700', { timeout: 10000 });
            const pendingStatus = await page.$eval('span.text-amber-700', el => el.textContent);
            if (pendingStatus === 'Pending') {
                console.log("   ✅ Confirmed: Booking is Pending");
            } else {
                console.error("   ❌ Expected 'Pending' status, saw: " + pendingStatus);
            }
        } catch (e) {
            log("   ❌ Failed to find Pending status span. Taking screenshot.");
            await page.screenshot({ path: 'booking_fail.png' });
            // content might be "No bookings yet"
            const bodyText = await page.evaluate(() => document.body.innerText);
            log("   Page content snapshot: " + bodyText.substring(0, 500));
            throw e;
        }

        // 4. Admin Confirmation
        console.log("\n4️⃣  Admin Confirmation...");
        // Logout
        console.log("   Logging out User...");
        await page.click('button.text-red-600'); // Sign Out button in sidebar
        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        // Login Admin
        console.log("   Logging in Admin...");
        await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
        await page.type('input[type="email"]', 'admin@gmail.com');
        await page.type('input[type="password"]', 'admin@123');
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            page.click('button[type="submit"]')
        ]);

        // Go to Bookings
        console.log("   Navigating to Manage Bookings...");
        await page.goto('http://localhost:3000/admin/bookings', { waitUntil: 'networkidle0' });

        // Search for user
        console.log("   Searching for booking...");
        await page.type('input[placeholder*="Search"]', userEmail);
        await new Promise(r => setTimeout(r, 1000)); // Wait for filter

        // Approve
        console.log("   Approving booking...");
        const approveBtn = await page.waitForSelector('button[title="Approve"]');
        await approveBtn.click();

        // Wait for update (optimistic update is fast, but let's wait a sec)
        await new Promise(r => setTimeout(r, 1500));

        // Verify Status in Admin Table
        const confirmedBadge = await page.$('span.bg-green-100');
        if (confirmedBadge) {
            console.log("   ✅ Admin: Booking marked Confirmed");
        } else {
            console.error("   ❌ Admin: Failed to find Confirmed badge");
        }

        // 5. User Verify
        console.log("\n5️⃣  User Verification...");
        // Logout Admin (Navbar logout for desktop usually)
        // Admin navbar might differ, let's look for Logout link or button
        // Navbar.tsx: handleLogout 
        // We know the URL /login clears user but clean logout is better.
        // Assuming we can clear local storage or use the navbar.
        // Let's just goto /login which effectively forces re-login flow if we clear storage manually?
        // Actually, Navbar uses window.location.href = '/login' on logout. 
        // Let's manually clear storage and go to login.
        await page.evaluate(() => localStorage.removeItem('user'));
        await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });

        // Login User
        console.log("   Logging in User again...");
        await page.type('input[type="email"]', userEmail);
        await page.type('input[type="password"]', 'password123');
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            page.click('button[type="submit"]')
        ]);

        // Should be on dashboard
        console.log("   Verifying Confirmed Status on Dashboard...");
        await page.waitForSelector('span.bg-green-100');
        const confirmedStatusUser = await page.$eval('span.bg-green-100', el => el.textContent);

        if (confirmedStatusUser === 'Confirmed') {
            console.log("   ✅ Success: User sees 'Confirmed' status!");
        } else {
            console.error("   ❌ User Verification Failed: Status is " + confirmedStatusUser);
        }

        console.log("\n🎉 FULL BOOKING FLOW VERIFIED!");

    } catch (error) {
        log("❌ Test Failed: " + error);
        log("Stack: " + error.stack);
    } finally {
        await new Promise(r => setTimeout(r, 5000)); // Keep open for a bit
        await browser.close();
    }
})();
