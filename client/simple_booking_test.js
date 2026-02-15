const puppeteer = require('puppeteer');

(async () => {
    console.log("🚀 Starting Simplified User Booking Test...");
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized']
    });
    const page = (await browser.pages())[0];

    try {
        const timestamp = Date.now();
        const userEmail = `simple_user_${timestamp}@example.com`;
        const userName = `Simple User ${timestamp}`;

        // 1. Register User
        console.log("1️⃣  Registering User...");
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

        // 2. Login (if needed, usually redirects to login)
        // Register redirects to /login.
        console.log("2️⃣  Logging in...");
        if (page.url().includes('/login')) {
            await page.type('#email', userEmail);
            await page.type('#password', 'password123');
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'networkidle0' }),
                page.click('button[type="submit"]')
            ]);
            console.log("   ✅ Login successful");
        }

        // 3. Book Room
        console.log("3️⃣  Booking Room...");
        await page.goto('http://localhost:3000/rooms', { waitUntil: 'networkidle0' });

        // Find first room details link
        const roomLink = await page.$('a[href^="/rooms/"]');
        if (!roomLink) throw new Error("No rooms found to book!");

        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            roomLink.click()
        ]);

        // Fill Form
        const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
        const nextDay = new Date(); nextDay.setDate(nextDay.getDate() + 2);

        await page.type('input[name="checkInDate"]', tomorrow.toISOString().split('T')[0]);
        await page.type('input[name="checkOutDate"]', nextDay.toISOString().split('T')[0]);
        await page.type('input[name="purpose"]', 'Simple Test');

        // Submit
        await page.click('button[type="submit"]');
        console.log("   Submitted booking form...");

        // Wait for redirect to dashboard
        await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });

        if (page.url().includes('/dashboard')) {
            console.log("   ✅ Redirected to Dashboard");
        } else {
            console.error("   ❌ Failed to redirect to dashboard. Current URL: " + page.url());
        }

        // 4. Verify User can see the booking
        console.log("4️⃣  Verifying Booking Display...");

        // Look for the "Pending" status badge
        try {
            await page.waitForSelector('span.text-amber-700', { timeout: 5000 });
            const status = await page.$eval('span.text-amber-700', el => el.innerText);
            if (status === 'Pending') {
                console.log("   ✅ SUCCESS: Booking is visible and Pending!");
            } else {
                console.log(`   ⚠️ Found status span but text is '${status}'`);
            }
        } catch (e) {
            console.error("   ❌ verification failed - Pending badge not found.");
            const text = await page.evaluate(() => document.body.innerText);
            console.log("   Page Text Snapshot: " + text.substring(0, 200));
        }

    } catch (err) {
        console.error("❌ TEST FAILED:", err);
    } finally {
        // await browser.close(); 
        console.log("   Browser left open for inspection.");
    }
})();
