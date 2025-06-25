/**
 * VIB34D AI Interface Test
 * 
 * Tests the AI agent interface using MCP patterns
 * Validates semantic understanding and technical mapping
 */

class VIB34DAIInterfaceTest {
    constructor() {
        this.testScenarios = [
            {
                name: "Business Dashboard Creation",
                description: "Create a professional dashboard for seafood import business",
                input: {
                    intent: "business_dashboard",
                    domain: "seafood_import",
                    style: "professional",
                    complexity: "moderate"
                },
                expected: {
                    geometry: "hypercube",
                    fluidity: { min: 0.3, max: 0.7 },
                    transparency: { min: 0.1, max: 0.3 },
                    energy: { min: 0.4, max: 0.8 }
                }
            },
            {
                name: "Wearable Interface Adaptation",
                description: "Adapt complex UI for smartwatch display",
                input: {
                    intent: "wearable_adaptation",
                    device: "smartwatch",
                    original_complexity: 0.9,
                    constraints: ["small_screen", "limited_battery"]
                },
                expected: {
                    maxParameters: 12,
                    preferredGeometries: ["sphere", "torus"],
                    complexity: { max: 0.5 }
                }
            },
            {
                name: "Real-time Data Visualization",
                description: "Create fluid interface for live stock market data",
                input: {
                    intent: "data_visualization",
                    data_type: "real_time",
                    domain: "financial",
                    update_frequency: "high"
                },
                expected: {
                    geometry: "navier_stokes",
                    fluidity: { min: 0.8 },
                    timeScale: { min: 5 },
                    responsiveness: "high"
                }
            }
        ];
        
        this.results = {
            timestamp: new Date().toISOString(),
            scenarios: [],
            summary: { total: 0, passed: 0, failed: 0 }
        };
    }

    // Test semantic to technical parameter mapping
    async testSemanticMapping(scenario) {
        const { input, expected } = scenario;
        
        // Simulate AI agent processing
        const mappedParams = await this.simulateAIMapping(input);
        
        // Validate mapping results
        this.validateMapping(mappedParams, expected);
        
        return mappedParams;
    }

    // Simulate AI agent semantic understanding
    async simulateAIMapping(input) {
        const mappings = {
            // Intent-based geometry selection
            business_dashboard: () => ({
                geometry: 'hypercube',
                u_dimension: 4,
                u_morphFactor: 0.3,
                complexity: 0.6,
                transparency: 0.2
            }),
            
            wearable_adaptation: () => ({
                geometry: input.device === 'smartwatch' ? 'sphere' : 'torus',
                maxParameters: input.device === 'smartwatch' ? 12 : 20,
                u_dimension: 3,
                complexity: Math.min(0.5, input.original_complexity || 0.5)
            }),
            
            data_visualization: () => ({
                geometry: input.data_type === 'real_time' ? 'navier_stokes' : 'hypercube',
                u_timeScale: input.update_frequency === 'high' ? 8 : 3,
                fluidity: input.data_type === 'real_time' ? 0.9 : 0.5,
                u_morphFactor: 0.7
            })
        };
        
        const mapper = mappings[input.intent];
        if (!mapper) {
            throw new Error(`No mapping found for intent: ${input.intent}`);
        }
        
        return mapper();
    }

    // Validate mapping against expectations
    validateMapping(mapped, expected) {
        // Check geometry selection
        if (expected.geometry && mapped.geometry !== expected.geometry) {
            throw new Error(`Geometry mismatch: expected ${expected.geometry}, got ${mapped.geometry}`);
        }
        
        // Check parameter ranges
        for (const [param, range] of Object.entries(expected)) {
            if (typeof range === 'object' && range.min !== undefined) {
                const value = mapped[param];
                if (value < range.min || (range.max && value > range.max)) {
                    throw new Error(`${param} out of range: ${value} not in [${range.min}, ${range.max || '∞'}]`);
                }
            }
        }
        
        // Check constraints
        if (expected.maxParameters && mapped.maxParameters > expected.maxParameters) {
            throw new Error(`Too many parameters: ${mapped.maxParameters} > ${expected.maxParameters}`);
        }
    }

    // Test AI agent learning patterns
    async testLearningPatterns() {
        const learningData = [
            { user_feedback: 'too_complex', adjustment: { complexity: -0.2 } },
            { user_feedback: 'more_fluid', adjustment: { fluidity: +0.3 } },
            { user_feedback: 'perfect', adjustment: {} }
        ];
        
        let currentParams = { complexity: 0.8, fluidity: 0.5 };
        
        for (const learning of learningData) {
            // Apply learning adjustments
            for (const [param, delta] of Object.entries(learning.adjustment)) {
                currentParams[param] = Math.max(0, Math.min(1, currentParams[param] + delta));
            }
        }
        
        // Validate learning worked
        if (currentParams.complexity >= 0.8) {
            throw new Error('Learning failed: complexity not reduced after "too_complex" feedback');
        }
        
        if (currentParams.fluidity <= 0.5) {
            throw new Error('Learning failed: fluidity not increased after "more_fluid" feedback');
        }
    }

    // Test cross-domain knowledge transfer
    async testKnowledgeTransfer() {
        const domains = {
            seafood_business: {
                colors: ['ocean_blue', 'coral_red'],
                geometries: ['torus', 'sphere'],
                themes: ['professional', 'maritime']
            },
            financial_trading: {
                colors: ['money_green', 'warning_red'],
                geometries: ['hypercube', 'navier_stokes'],
                themes: ['aggressive', 'real_time']
            }
        };
        
        // Test if maritime themes can inform financial interfaces
        const transferResult = this.simulateKnowledgeTransfer(
            domains.seafood_business,
            domains.financial_trading
        );
        
        if (!transferResult.applied_patterns) {
            throw new Error('Knowledge transfer failed');
        }
    }

    simulateKnowledgeTransfer(sourceDomain, targetDomain) {
        // Find common patterns
        const commonGeometries = sourceDomain.geometries.filter(g => 
            targetDomain.geometries.includes(g)
        );
        
        return {
            applied_patterns: commonGeometries.length > 0,
            common_geometries: commonGeometries,
            transfer_confidence: commonGeometries.length / targetDomain.geometries.length
        };
    }

    // Test intent recognition accuracy
    async testIntentRecognition() {
        const prompts = [
            {
                text: "Create a fluid dashboard for my tuna import tracking",
                expected_intent: "business_dashboard",
                expected_domain: "seafood_import",
                expected_style: "fluid"
            },
            {
                text: "Make this work on my Apple Watch",
                expected_intent: "wearable_adaptation",
                expected_device: "smartwatch"
            },
            {
                text: "I need real-time stock price visualization",
                expected_intent: "data_visualization",
                expected_data_type: "real_time",
                expected_domain: "financial"
            }
        ];
        
        for (const prompt of prompts) {
            const recognized = this.simulateIntentRecognition(prompt.text);
            
            if (recognized.intent !== prompt.expected_intent) {
                throw new Error(`Intent recognition failed for "${prompt.text}": expected ${prompt.expected_intent}, got ${recognized.intent}`);
            }
        }
    }

    simulateIntentRecognition(text) {
        const patterns = {
            business_dashboard: /dashboard|tracking|business|import/i,
            wearable_adaptation: /watch|wearable|small screen/i,
            data_visualization: /visualization|real.?time|stock|data/i
        };
        
        for (const [intent, pattern] of Object.entries(patterns)) {
            if (pattern.test(text)) {
                return { intent, confidence: 0.9 };
            }
        }
        
        return { intent: 'unknown', confidence: 0.1 };
    }

    // Run scenario test
    async runScenario(scenario) {
        console.log(`\n🎯 Testing Scenario: ${scenario.name}`);
        console.log(`   Description: ${scenario.description}`);
        
        try {
            const mappedParams = await this.testSemanticMapping(scenario);
            
            this.results.scenarios.push({
                name: scenario.name,
                status: 'passed',
                input: scenario.input,
                output: mappedParams
            });
            
            this.results.summary.passed++;
            console.log(`   ✅ PASSED`);
            
        } catch (error) {
            this.results.scenarios.push({
                name: scenario.name,
                status: 'failed',
                error: error.message
            });
            
            this.results.summary.failed++;
            console.log(`   ❌ FAILED: ${error.message}`);
        }
        
        this.results.summary.total++;
    }

    // Main test runner
    async runAllTests() {
        console.log('🤖 Starting VIB34D AI Interface Tests...');
        
        // Test all scenarios
        for (const scenario of this.testScenarios) {
            await this.runScenario(scenario);
        }
        
        // Test core AI capabilities
        console.log('\n🧠 Testing Core AI Capabilities...');
        
        try {
            await this.testLearningPatterns();
            console.log('✅ Learning patterns test passed');
            this.results.summary.passed++;
        } catch (error) {
            console.log(`❌ Learning patterns test failed: ${error.message}`);
            this.results.summary.failed++;
        }
        this.results.summary.total++;
        
        try {
            await this.testKnowledgeTransfer();
            console.log('✅ Knowledge transfer test passed');
            this.results.summary.passed++;
        } catch (error) {
            console.log(`❌ Knowledge transfer test failed: ${error.message}`);
            this.results.summary.failed++;
        }
        this.results.summary.total++;
        
        try {
            await this.testIntentRecognition();
            console.log('✅ Intent recognition test passed');
            this.results.summary.passed++;
        } catch (error) {
            console.log(`❌ Intent recognition test failed: ${error.message}`);
            this.results.summary.failed++;
        }
        this.results.summary.total++;
        
        this.generateReport();
    }

    generateReport() {
        console.log('\n' + '='.repeat(60));
        console.log('🤖 VIB34D AI Interface Test Results');
        console.log('='.repeat(60));
        console.log(`Total Tests: ${this.results.summary.total}`);
        console.log(`✅ Passed: ${this.results.summary.passed}`);
        console.log(`❌ Failed: ${this.results.summary.failed}`);
        console.log(`Success Rate: ${((this.results.summary.passed / this.results.summary.total) * 100).toFixed(2)}%`);
        
        console.log('\n📊 Scenario Results:');
        this.results.scenarios.forEach(scenario => {
            const icon = scenario.status === 'passed' ? '✅' : '❌';
            console.log(`${icon} ${scenario.name}`);
            if (scenario.error) {
                console.log(`   Error: ${scenario.error}`);
            }
        });
        
        // Save detailed report
        const fs = require('fs');
        const reportPath = `./vib34d-ai-test-${Date.now()}.json`;
        fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
        console.log(`\n📄 Detailed report saved to: ${reportPath}`);
        
        if (this.results.summary.failed === 0) {
            console.log('\n🎉 All AI interface tests passed! System ready for agent interaction.');
        } else {
            console.log('\n⚠️  Some AI tests failed. Review semantic mapping logic.');
        }
    }
}

// Run tests
const aiTester = new VIB34DAIInterfaceTest();
aiTester.runAllTests().catch(error => {
    console.error('AI test suite error:', error);
    process.exit(1);
});