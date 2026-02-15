const puppeteer = require('puppeteer');

(async () => {
    console.log("🚀 Starting Admin Dashboard Check...");
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized']
    });
    const page = (await browser.pages())[0];

    try {
        const adminEmail = "admin@gmail.com";
        const adminPassword = "admin@123";

        // 1. Login as Admin
        console.log("1️⃣  Logging in as Admin...");
        await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
        
        await page.type('#email', adminEmail);
        await page.type('#password', adminPassword);
        
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            page.click('button[type="submit"]')
        ]);
        console.log("   ✅ Admin Logged In");

        // 2. Go to Bookings Page
        console.log("2️⃣  Navigating to Admin Bookings...");
        await page.goto('http://localhost:3000/admin/bookings', { waitUntil: 'networkidle0' });
        
         // 3. Verify Content
        console.log("3️⃣  Verifying Content...");
        await page.waitForSelector('h1', { timeout: 5000 });
        
        const title = await page.$eval('h1', el => el.innerText);
        console.log(`   Page Title: ${title}`);
        
        // Take screenshot
        await page.screenshot({ path: 'admin_dashboard.png' });
        
        // Check for specific booking elements
        const rows = await page.$$('tr');
        console.log(`   Found ${rows.length} rows in the table (including header)`);

        const bodyText = await page.evaluate(() => document.body.innerText);
        if (bodyText.includes('Pending') || bodyText.includes('Confirmed')) {
             console.log("   ✅ Found booking status indicators.");
        } else {
             console.log("   ⚠️  No booking status found in text.");
        }

    } catch (err) {
        console.error("❌ TEST FAILED:", err);
        await page.screenshot({ path: 'admin_check_fail.png' });
    } finally {
        console.log("   Browser left open.");
        // await browser.close();
    }
})();
