/**
 * Test dashboard initialization timing
 */

const puppeteer = require('puppeteer');

async function testDashboardInit() {
    console.log('🔍 Testing Dashboard Initialization Timing...\n');
    
    let browser;
    try {
        browser = await puppeteer.launch({ 
            headless: false,
            defaultViewport: { width: 1200, height: 800 }
        });
        
        const page = await browser.newPage();
        
        // Capture console messages
        page.on('console', msg => {
            console.log(`📝 Console: ${msg.text()}`);
        });
        
        console.log('📖 Loading dashboard and waiting for initialization...');
        await page.goto('http://localhost:8002/VIB34D_EDITOR_DASHBOARD.html', { 
            waitUntil: 'networkidle0',
            timeout: 30000 
        });
        
        // Wait for DOMContentLoaded and initialization
        await page.waitForTimeout(5000);
        
        // Check if editor dashboard is available
        const editorDashboard = await page.evaluate(() => {
            console.log('Checking window.editorDashboard:', typeof window.editorDashboard);
            console.log('Window object keys:', Object.keys(window).filter(k => k.includes('editor')));
            return {
                available: typeof window.editorDashboard !== 'undefined',
                type: typeof window.editorDashboard
            };
        });
        
        console.log(`\n✓ Dashboard Available: ${editorDashboard.available}`);
        console.log(`✓ Dashboard Type: ${editorDashboard.type}`);
        
        // Try to access dashboard methods
        if (editorDashboard.available) {
            const dashboardInfo = await page.evaluate(() => {
                return {
                    hasElements: typeof window.editorDashboard.elements !== 'undefined',
                    elementsSize: window.editorDashboard.elements ? window.editorDashboard.elements.size : 'N/A',
                    hasSystemBridge: typeof window.editorDashboard.systemBridge !== 'undefined'
                };
            });
            
            console.log(`✓ Has Elements Map: ${dashboardInfo.hasElements}`);
            console.log(`✓ Elements Count: ${dashboardInfo.elementsSize}`);
            console.log(`✓ Has System Bridge: ${dashboardInfo.hasSystemBridge}`);
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run the test
testDashboardInit();