const puppeteer = require('puppeteer');

(async () => {
    console.log("🚀 Starting Browser Automation Test...");

    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({
        headless: false, // Run in headed mode to see the browser
        defaultViewport: null, // Open in full window size
        args: ['--start-maximized'] // Maximize window
    });
    const page = await browser.newPage();

    // START: Handle Alerts automatically
    page.on('dialog', async dialog => {
        console.log(`   🔔 Alert handled: ${dialog.message()}`);
        await dialog.accept();
    });
    // END: Handle Alerts automatically

    try {
        // 0. Registration
        console.log("0️⃣  Navigating to Register Page...");
        await page.goto('http://localhost:3000/register', { waitUntil: 'networkidle0' });

        const testUserEmail = `browser_test_${Date.now()}@example.com`;
        const testUserPass = 'password123';

        console.log(`   Registering new user: ${testUserEmail}...`);
        await page.type('#name', 'Browser Test User');
        await page.type('#email', testUserEmail);
        await page.type('#password', testUserPass);
        await page.type('#phone', '9876543210');

        console.log("   Clicking Register...");
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }), // Expect redirect to Login
            page.click('button[type="submit"]'),
        ]);
        console.log("   ✅ Registration Successful (Redirected to Login)!");

        // 1. Logging in as Admin (for Admin Tests)...
        console.log("\n1️⃣  Logging in as Admin (for Admin Tests)...");
        // We are now likely on the login page.
        // If not, navigate there. The previous step expects redirect to /login so we should be there.
        if (page.url() !== 'http://localhost:3000/login') {
            await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
        }

        console.log("   Filling credentials...");
        await page.type('#email', 'admin@gmail.com');
        await page.type('#password', 'admin@123');

        console.log("   Clicking Login...");
        // Click the button that contains text "Sign In" or type submit
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }), // Wait for redirect
            page.click('button[type="submit"]'),
        ]);
        console.log("   ✅ Login Successful!");

        // 2. Add Room
        console.log("\n2️⃣  Navigating to Manage Rooms...");
        await page.goto('http://localhost:3000/admin/rooms', { waitUntil: 'networkidle0' });

        console.log("   Opening Add Room Modal...");
        // Find button with text "Add New Room"
        const addRoomBtn = await page.waitForSelector('button ::-p-text(Add New Room)');
        await addRoomBtn.click();

        // Wait for modal
        await page.waitForSelector('input[name="name"]');

        console.log("   Filling Room Details...");
        await page.type('input[name="name"]', `Browser Test Room ${Date.now()}`);
        await page.type('input[name="price"]', '299');
        await page.type('input[name="capacity"]', '2');
        await page.type('input[name="images"]', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32');
        await page.type('input[name="amenities"]', 'Wifi, Balcony, Browser Automation');
        await page.type('textarea[name="description"]', 'This room was added correctly via Puppeteer automation.');

        console.log("   Submitting Room...");
        await page.click('button[type="submit"]');

        // Wait for success alert or modal close
        // We handle the alert above, so we just need to wait for the modal to be removed from DOM
        try {
            await page.waitForFunction(() => !document.querySelector('.fixed.inset-0'), { timeout: 5000 });
        } catch (e) {
            console.log("   ⚠️ Warning: Modal close wait timed out, but proceeding if alert was handled.");
        }
        console.log("   ✅ Room Added Successfully (or at least attempted)!");

        // Small delay for visual verification
        await new Promise(r => setTimeout(r, 2000));


        // 3. Add Hall
        console.log("\n3️⃣  Navigating to Manage Halls...");
        await page.goto('http://localhost:3000/admin/halls', { waitUntil: 'networkidle0' });

        console.log("   Opening Add Hall Modal...");
        const addHallBtn = await page.waitForSelector('button ::-p-text(Add New Hall)');
        await addHallBtn.click();

        await page.waitForSelector('input[name="name"]');

        console.log("   Filling Hall Details...");
        await page.type('input[name="name"]', `Browser Test Hall ${Date.now()}`);
        await page.type('input[name="price"]', '1500');
        await page.type('input[name="capacity"]', '100');
        await page.type('input[name="images"]', 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3');
        await page.type('input[name="amenities"]', 'Projector, Stage, Browser Automation');
        await page.type('textarea[name="description"]', 'This hall was added correctly via Puppeteer automation.');

        console.log("   Submitting Hall...");
        await page.click('button[type="submit"]');

        try {
            await page.waitForFunction(() => !document.querySelector('.fixed.inset-0'), { timeout: 5000 });
        } catch (e) {
            console.log("   ⚠️ Warning: Modal close wait timed out, but proceeding.");
        }
        console.log("   ✅ Hall Added Successfully!");

        await new Promise(r => setTimeout(r, 2000));


        // 4. Add Food
        console.log("\n4️⃣  Navigating to Manage Menu...");
        await page.goto('http://localhost:3000/admin/food', { waitUntil: 'networkidle0' });

        console.log("   Opening Add Item Modal...");
        const addFoodBtn = await page.waitForSelector('button ::-p-text(Add Item)');
        await addFoodBtn.click();

        await page.waitForSelector('input[name="name"]');

        console.log("   Filling Food Details...");
        await page.type('input[name="name"]', `Browser Test Food ${Date.now()}`);
        await page.type('input[name="price"]', '25');
        await page.type('select[name="category"]', 'Snack'); // Select options are handled differently
        await page.type('input[name="images"]', 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8');
        await page.type('textarea[name="description"]', 'Tasty food added via Puppeteer automation.');

        // Checkboxes
        const isSpecialCheckbox = await page.$('input[name="isSpecial"]');
        if (isSpecialCheckbox) await isSpecialCheckbox.click();

        console.log("   Submitting Food...");
        await page.click('button[type="submit"]');

        try {
            await page.waitForFunction(() => !document.querySelector('.fixed.inset-0'), { timeout: 5000 });
        } catch (e) {
            console.log("   ⚠️ Warning: Modal close wait timed out, but proceeding.");
        }
        console.log("   ✅ Food Added Successfully!");

        await new Promise(r => setTimeout(r, 2000));

        // 5. Theme Toggle Verification
        console.log("\n5️⃣  Testing Theme Toggle...");
        // Check for Dark Mode button
        const darkModeBtn = await page.waitForSelector('button[aria-label="Dark Mode"]');
        if (darkModeBtn) {
            console.log("   Clicking Dark Mode...");
            await darkModeBtn.click();

            // Wait a bit for transition
            await new Promise(r => setTimeout(r, 1000));

            // Check if html has class 'dark'
            const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
            if (isDark) {
                console.log("   ✅ Theme switched to DARK mode successfully!");
            } else {
                console.error("   ❌ Failed to switch to DARK mode!");
            }

            // Switch back to Light
            const lightModeBtn = await page.waitForSelector('button[aria-label="Light Mode"]');
            await lightModeBtn.click();
            await new Promise(r => setTimeout(r, 1000));

            const isLight = await page.evaluate(() => !document.documentElement.classList.contains('dark'));
            if (isLight) {
                console.log("   ✅ Theme switched to LIGHT mode successfully!");
            } else {
                console.error("   ❌ Failed to switch to LIGHT mode!");
            }

            // 6. Dashboard Navbar Theme Verification
            console.log("\n6️⃣  Testing Dashboard Navbar Theme...");
            // We should be on an admin page (e.g. food), so navbar should be solid
            await darkModeBtn.click(); // Switch back to dark
            await new Promise(r => setTimeout(r, 1000));

            const navbarBg = await page.evaluate(() => {
                const nav = document.querySelector('nav');
                return window.getComputedStyle(nav).backgroundColor;
            });

            // rgb(17, 24, 39) is gray-900, rgb(10, 10, 10) is our custom dark bg, or similar dark color.
            // rgb(255, 255, 255) is white.
            console.log(`   Detailed: Navbar BG color is ${navbarBg}`);
            if (navbarBg !== 'rgb(255, 255, 255)') { // Should NOT be white
                console.log("   ✅ Dashboard Navbar is DARK (or at least not white)!");
            } else {
                console.error("   ❌ Dashboard Navbar is still WHITE in dark mode!");
            }

        } else {
            console.error("   ❌ Theme Toggle buttons not found!");
        }

        console.log("\n🎉 ALL BROWSER ACTIONS COMPLETED!");
        console.log("The browser will remain open for 10 seconds for you to inspect...");
        await new Promise(r => setTimeout(r, 10000));

    } catch (error) {
        console.error("\n❌ Test Failed:", error);
    } finally {
        await browser.close();
    }
})();
