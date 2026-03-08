const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on('console', msg => console.log('LOG:', msg.text()));
    page.on('pageerror', e => console.log('CRASH ERROR:', e.message, e.stack));

    console.log("Navigating...");
    await page.goto('http://localhost:3000/#/admin');
    await new Promise(r => setTimeout(r, 2000));

    console.log("Looking for UAE tab...");
    await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const uaeBtn = btns.find(b => b.textContent.includes('UAE') || b.textContent.includes('الإمارات'));
        if (uaeBtn) uaeBtn.click();
    });

    await new Promise(r => setTimeout(r, 1000));

    console.log("Adding a new slide...");
    await page.evaluate(() => {
        const inputs = document.querySelectorAll('input[type="text"]');
        if (inputs.length > 1) {
            inputs[1].value = "https://via.placeholder.com/150";
            inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
        }
    });

    await new Promise(r => setTimeout(r, 500));

    await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const addBtn = btns.find(b => b.textContent.includes('Add New Slide Batch') || b.textContent.includes('إضافة'));
        if (addBtn) addBtn.click();
    });

    await new Promise(r => setTimeout(r, 2000));

    const size = await page.evaluate(() => document.getElementById('root').innerHTML.length);
    console.log("HTML Size after adding:", size);

    await browser.close();
})();
