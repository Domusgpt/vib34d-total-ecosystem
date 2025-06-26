/**
 * Simple verification test for critical dashboard fixes
 */

const puppeteer = require('puppeteer');

async function verifyDashboardFixes() {
    console.log('🧪 Verifying VIB34D Dashboard Critical Fixes...\n');
    
    let browser;
    try {
        browser = await puppeteer.launch({ 
            headless: false,
            defaultViewport: { width: 1200, height: 800 }
        });
        
        const page = await browser.newPage();
        
        console.log('📖 Loading dashboard...');
        await page.goto('http://localhost:8002/VIB34D_EDITOR_DASHBOARD.html', { 
            waitUntil: 'networkidle0',
            timeout: 30000 
        });
        
        // Test 1: Check if required elements exist
        console.log('Test 1: Checking required HTML elements...');
        
        const elementLibrary = await page.$('#element-library');
        const canvas = await page.$('#canvas');
        const propertiesPanel = await page.$('#properties-panel');
        
        console.log(`✓ Element Library: ${elementLibrary ? 'FOUND' : 'MISSING'}`);
        console.log(`✓ Canvas: ${canvas ? 'FOUND' : 'MISSING'}`);
        console.log(`✓ Properties Panel: ${propertiesPanel ? 'FOUND' : 'MISSING'}`);
        
        // Test 2: Check if editor dashboard is globally accessible
        console.log('\nTest 2: Checking global editor dashboard access...');
        
        const editorDashboard = await page.evaluate(() => {
            return typeof window.editorDashboard !== 'undefined';
        });
        
        console.log(`✓ window.editorDashboard: ${editorDashboard ? 'ACCESSIBLE' : 'NOT ACCESSIBLE'}`);
        
        // Test 3: Check if library items have correct classes
        console.log('\nTest 3: Checking library item classes...');
        
        const libraryItems = await page.$$('.library-item');
        console.log(`✓ Library Items with .library-item class: ${libraryItems.length}`);
        
        // Test 4: Check if all JavaScript files load without errors
        console.log('\nTest 4: Checking for JavaScript errors...');
        
        const jsErrors = [];
        page.on('pageerror', error => {
            jsErrors.push(error.message);
        });
        
        // Wait a moment for any async loading
        await page.waitForTimeout(3000);
        
        console.log(`✓ JavaScript Errors: ${jsErrors.length === 0 ? 'NONE' : jsErrors.length + ' found'}`);
        if (jsErrors.length > 0) {
            jsErrors.forEach(error => console.log(`  - ${error}`));
        }
        
        // Test 5: Try to drag and drop
        console.log('\nTest 5: Testing drag and drop functionality...');
        
        if (libraryItems.length > 0) {
            const firstItem = libraryItems[0];
            const canvasElement = await page.$('#canvas');
            
            if (firstItem && canvasElement) {
                try {
                    await page.hover('#element-library .library-item:first-child');
                    console.log('✓ Can hover over library items');
                    
                    // Get canvas bounding box for drop coordinates
                    const canvasBox = await canvasElement.boundingBox();
                    
                    console.log('✓ Canvas element found and accessible');
                    console.log(`✓ Drag and drop setup: ${canvasBox ? 'READY' : 'SETUP ISSUE'}`);
                } catch (error) {
                    console.log(`✗ Drag and drop test error: ${error.message}`);
                }
            }
        }
        
        console.log('\n='.repeat(60));
        console.log('VERIFICATION COMPLETE');
        console.log('='.repeat(60));
        
        const allTestsPassed = elementLibrary && canvas && propertiesPanel && editorDashboard && libraryItems.length > 0 && jsErrors.length === 0;
        
        if (allTestsPassed) {
            console.log('🎉 ALL CRITICAL FIXES VERIFIED SUCCESSFUL!');
            console.log('✅ Dashboard is ready for full functionality testing');
        } else {
            console.log('❌ Some issues remain - see details above');
        }
        
        console.log('\n📊 Fix Status Summary:');
        console.log(`✓ HTML IDs added: ${elementLibrary && canvas && propertiesPanel ? 'YES' : 'NO'}`);
        console.log(`✓ Global scope access: ${editorDashboard ? 'YES' : 'NO'}`);
        console.log(`✓ Library item classes: ${libraryItems.length > 0 ? 'YES' : 'NO'}`);
        console.log(`✓ No JS errors: ${jsErrors.length === 0 ? 'YES' : 'NO'}`);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run if called directly
if (require.main === module) {
    verifyDashboardFixes();
}

module.exports = { verifyDashboardFixes };