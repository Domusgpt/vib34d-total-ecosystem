/**
 * Check for missing resources causing 404 errors
 */

const puppeteer = require('puppeteer');

async function checkMissingResources() {
    console.log('🔍 Checking for Missing Resources...\n');
    
    let browser;
    try {
        browser = await puppeteer.launch({ 
            headless: false,
            defaultViewport: { width: 1200, height: 800 }
        });
        
        const page = await browser.newPage();
        
        // Capture failed requests
        const failedRequests = [];
        page.on('requestfailed', request => {
            failedRequests.push({
                url: request.url(),
                failure: request.failure().errorText
            });
        });
        
        // Capture response errors
        page.on('response', response => {
            if (!response.ok()) {
                console.log(`❌ Failed to load: ${response.url()} (${response.status()})`);
            }
        });
        
        console.log('📖 Loading dashboard...');
        await page.goto('http://localhost:8002/VIB34D_EDITOR_DASHBOARD.html', { 
            waitUntil: 'networkidle0',
            timeout: 30000 
        });
        
        console.log('\n📊 Failed Requests Summary:');
        if (failedRequests.length > 0) {
            failedRequests.forEach(req => {
                console.log(`  - ${req.url}: ${req.failure}`);
            });
        } else {
            console.log('  No failed requests detected');
        }
        
        // Wait longer for initialization
        console.log('\n⏳ Waiting for dashboard initialization...');
        await page.waitForTimeout(10000);
        
        // Check again for dashboard
        const editorStatus = await page.evaluate(() => {
            // Force DOMContentLoaded if needed
            if (document.readyState === 'complete') {
                console.log('Document ready state is complete');
            }
            
            return {
                readyState: document.readyState,
                hasEditorClass: typeof VIB34DEditorDashboard !== 'undefined',
                hasEditorInstance: typeof window.editorDashboard !== 'undefined'
            };
        });
        
        console.log(`✓ Document Ready State: ${editorStatus.readyState}`);
        console.log(`✓ Editor Class Available: ${editorStatus.hasEditorClass}`);
        console.log(`✓ Editor Instance Available: ${editorStatus.hasEditorInstance}`);
        
        // Manually trigger DOMContentLoaded if needed
        if (!editorStatus.hasEditorInstance && editorStatus.hasEditorClass) {
            console.log('\n🔧 Manually triggering dashboard initialization...');
            const result = await page.evaluate(() => {
                try {
                    window.editorDashboard = new VIB34DEditorDashboard();
                    console.log('🎨 VIB34D Editor Dashboard manually initialized!');
                    return { success: true, error: null };
                } catch (error) {
                    return { success: false, error: error.message };
                }
            });
            
            console.log(`✓ Manual initialization: ${result.success ? 'SUCCESS' : 'FAILED'}`);
            if (!result.success) {
                console.log(`  Error: ${result.error}`);
            }
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
checkMissingResources();