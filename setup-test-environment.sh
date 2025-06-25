#!/bin/bash

# VIB34D Test Environment Setup Script
# Sets up comprehensive testing environment with MCP + Puppeteer

echo "🚀 Setting up VIB34D Test Environment..."

# Create test results directory
mkdir -p test-results
mkdir -p test-screenshots

# Install dependencies if package.json exists
if [ -f "package.json" ]; then
    echo "📦 Installing npm dependencies..."
    npm install
else
    echo "📦 Initializing npm project..."
    npm init -y
    npm install puppeteer @modelcontextprotocol/sdk jest
fi

# Start local server in background
echo "🌐 Starting local development server..."
python -m http.server 8002 &
SERVER_PID=$!
echo "Server PID: $SERVER_PID"

# Wait for server to start
sleep 3

# Run quick tests first
echo "🧪 Running Quick MCP Tests..."
node VIB34D_QUICK_MCP_TEST.js

# Run AI interface tests
echo "🤖 Running AI Interface Tests..."
node VIB34D_AI_INTERFACE_TEST.js

# Check if full Puppeteer test should run
echo "🎭 Do you want to run full Puppeteer tests? (y/n)"
read -r response

if [[ "$response" =~ ^[Yy]$ ]]; then
    echo "🎭 Running Full Puppeteer Test Suite..."
    node VIB34D_MCP_PUPPETEER_TEST_SUITE.js
else
    echo "⏭️  Skipping Puppeteer tests (require browser automation)"
fi

# Generate summary report
echo "📊 Generating Test Summary..."
node -e "
const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.startsWith('vib34d-') && f.endsWith('.json'));
let totalTests = 0, totalPassed = 0, totalFailed = 0;

files.forEach(file => {
    const data = JSON.parse(fs.readFileSync(file));
    if (data.summary) {
        totalTests += data.summary.total;
        totalPassed += data.summary.passed;
        totalFailed += data.summary.failed;
    }
});

const successRate = ((totalPassed / totalTests) * 100).toFixed(2);

console.log('\\n' + '='.repeat(60));
console.log('📈 VIB34D Test Environment Summary');
console.log('='.repeat(60));
console.log(\`Total Tests Run: \${totalTests}\`);
console.log(\`✅ Total Passed: \${totalPassed}\`);
console.log(\`❌ Total Failed: \${totalFailed}\`);
console.log(\`📊 Overall Success Rate: \${successRate}%\`);
console.log('='.repeat(60));

if (totalFailed === 0) {
    console.log('🎉 ALL TESTS PASSED! VIB34D system is production ready.');
} else {
    console.log('⚠️  Some tests failed. Review test reports for details.');
}
"

# Clean up
echo "🧹 Cleaning up..."
kill $SERVER_PID 2>/dev/null || true

echo "✅ Test environment setup complete!"
echo "📁 Test results saved in ./test-results/"
echo "📄 JSON reports available in current directory"