/**
 * Test if the VIB34DEditorDashboard class can be instantiated
 */

const puppeteer = require('puppeteer');

async function testClassDefinition() {
    console.log('🔍 Testing VIB34DEditorDashboard Class Definition...\n');
    
    let browser;
    try {
        browser = await puppeteer.launch({ 
            headless: false,
            defaultViewport: { width: 1200, height: 800 }
        });
        
        const page = await browser.newPage();
        
        // Capture all console messages including errors
        page.on('console', msg => {
            console.log(`📝 Console ${msg.type()}: ${msg.text()}`);
        });
        
        page.on('pageerror', error => {
            console.log(`❌ Page Error: ${error.message}`);
        });
        
        console.log('📖 Loading dashboard...');
        await page.goto('http://localhost:8002/VIB34D_EDITOR_DASHBOARD.html', { 
            waitUntil: 'domcontentloaded',
            timeout: 30000 
        });
        
        // Wait a bit for scripts to load
        await page.waitForTimeout(3000);
        
        // Check what's actually available in the window
        const windowAnalysis = await page.evaluate(() => {
            // Check if scripts loaded
            const scripts = Array.from(document.querySelectorAll('script')).map(s => s.src || 'inline');
            
            // Check if VIB34D classes exist
            const vib34dObjects = Object.keys(window).filter(key => key.includes('VIB34D'));
            
            // Check if the editor class is defined
            const editorClassDefined = typeof VIB34DEditorDashboard !== 'undefined';
            
            return {
                scripts,
                vib34dObjects,
                editorClassDefined,
                documentReady: document.readyState
            };
        });
        
        console.log('📊 Window Analysis:');
        console.log(`✓ Document Ready: ${windowAnalysis.documentReady}`);
        console.log(`✓ Scripts Loaded: ${windowAnalysis.scripts.length}`);
        windowAnalysis.scripts.forEach(script => console.log(`  - ${script}`));
        console.log(`✓ VIB34D Objects: ${windowAnalysis.vib34dObjects.length}`);
        windowAnalysis.vib34dObjects.forEach(obj => console.log(`  - ${obj}`));
        console.log(`✓ Editor Class Defined: ${windowAnalysis.editorClassDefined}`);
        
        // If class is not defined, let's see if there are syntax errors
        if (!windowAnalysis.editorClassDefined) {
            console.log('\n🔧 Attempting to manually eval the class...');
            const manualResult = await page.evaluate(() => {
                try {
                    // Try to manually define a simple version of the class
                    eval(`
                        class VIB34DEditorDashboard {
                            constructor() {
                                console.log('Test class constructor called');
                                this.elements = new Map();
                            }
                        }
                    `);
                    return { success: true, error: null };
                } catch (error) {
                    return { success: false, error: error.message };
                }
            });
            
            console.log(`Manual eval result: ${manualResult.success ? 'SUCCESS' : 'FAILED'}`);
            if (!manualResult.success) {
                console.log(`Error: ${manualResult.error}`);
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
testClassDefinition();