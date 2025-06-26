const puppeteer = require('puppeteer');

async function testMinimal() {
    let browser;
    try {
        browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        
        page.on('console', msg => console.log(`Console: ${msg.text()}`));
        page.on('pageerror', error => console.log(`Error: ${error.message}`));
        
        await page.goto('http://localhost:8002/minimal_test.html');
        await page.waitForTimeout(2000);
        
        const result = await page.evaluate(() => {
            return {
                editorAvailable: typeof window.editorDashboard !== 'undefined',
                elements: document.querySelectorAll('#element-library, #canvas, #properties-panel').length
            };
        });
        
        console.log('Result:', result);
        
    } catch (error) {
        console.error('Test failed:', error.message);
    } finally {
        if (browser) await browser.close();
    }
}

testMinimal();