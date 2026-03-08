const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on('console', msg => {
        for (let i = 0; i < msg.args().length; ++i)
            console.log(`PAGE LOG ${i}: ${msg.args()[i]}`);
    });
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

    try {
        await page.goto('http://localhost:3000/#/admin');
        await new Promise(r => setTimeout(r, 2000));
    } catch (e) {
        console.error('Nav error', e);
    }
    await browser.close();
})();
