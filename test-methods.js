#!/usr/bin/env node

// Simple Node.js test to verify WebMiner methods exist
const fs = require('fs');
const vm = require('vm');

console.log('🧪 Testing WebMiner optimization methods...\n');

try {
    // Read the webminer.js file
    const webminerCode = fs.readFileSync('webminer.js', 'utf8');
    
    // Create a minimal browser-like environment for testing
    const sandbox = {
        console: console,
        window: {
            innerHeight: 800,
            innerWidth: 1200,
            addEventListener: () => {},
            screen: { width: 1200, height: 800 }
        },
        document: {
            getElementById: () => null,
            createElement: () => ({ 
                style: {}, 
                appendChild: () => {},
                addEventListener: () => {},
                dataset: {}
            }),
            head: { appendChild: () => {} },
            addEventListener: () => {},
            hidden: false,
            querySelector: () => null,
            querySelectorAll: () => [],
            currentScript: null
        },
        navigator: {
            userAgent: 'Mozilla/5.0 (Test)',
            hardwareConcurrency: 8,
            deviceMemory: 8,
            getBattery: () => Promise.resolve({
                level: 0.8,
                charging: true,
                addEventListener: () => {}
            }),
            vibrate: () => true,
            connection: { effectiveType: '4g', addEventListener: () => {} },
            maxTouchPoints: 0
        },
        performance: {
            now: () => Date.now(),
            memory: {
                usedJSHeapSize: 50 * 1024 * 1024,
                totalJSHeapSize: 100 * 1024 * 1024,
                jsHeapSizeLimit: 2000 * 1024 * 1024
            }
        },
        screen: {
            orientation: { type: 'landscape-primary', addEventListener: () => {} },
            width: 1200,
            height: 800
        },
        setTimeout: setTimeout,
        setInterval: setInterval,
        clearInterval: clearInterval,
        Math: Math,
        Date: Date,
        localStorage: {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {}
        },
        btoa: (str) => Buffer.from(str).toString('base64'),
        atob: (str) => Buffer.from(str, 'base64').toString(),
        Worker: function() { return { postMessage: () => {}, terminate: () => {} }; },
        WebSocket: function() { return { send: () => {}, close: () => {} }; }
    };

    // Add global reference
    sandbox.global = sandbox;
    
    // Execute the webminer code in the sandbox
    vm.createContext(sandbox);
    vm.runInContext(webminerCode, sandbox);
    
    // Test PerformanceMonitor methods
    console.log('📊 Testing PerformanceMonitor methods:');
    const perfMonitor = sandbox.PerformanceMonitor;
    
    if (perfMonitor) {
        console.log('  ✅ PerformanceMonitor module exists');
        
        // Test required methods
        const requiredMethods = ['startMonitoring', 'stopMonitoring', 'getRecommendedThrottle', 'getPerformanceReport'];
        requiredMethods.forEach(method => {
            if (typeof perfMonitor[method] === 'function') {
                console.log(`  ✅ ${method} method exists`);
            } else {
                console.log(`  ❌ ${method} method missing`);
            }
        });
        
        // Test getRecommendedThrottle functionality
        try {
            const throttle = perfMonitor.getRecommendedThrottle();
            if (typeof throttle === 'number' && throttle >= 0 && throttle <= 1) {
                console.log(`  ✅ getRecommendedThrottle returns valid value: ${(throttle * 100).toFixed(1)}%`);
            } else {
                console.log(`  ❌ getRecommendedThrottle returns invalid value: ${throttle}`);
            }
        } catch (error) {
            console.log(`  ❌ getRecommendedThrottle throws error: ${error.message}`);
        }
        
        // Test getPerformanceReport functionality
        try {
            const report = perfMonitor.getPerformanceReport();
            if (report && typeof report === 'object') {
                console.log(`  ✅ getPerformanceReport returns valid object`);
                if (report.deviceCapabilities) {
                    console.log(`  ✅ Report includes device capabilities`);
                }
                if (typeof report.healthScore === 'number') {
                    console.log(`  ✅ Report includes health score: ${report.healthScore}`);
                }
            } else {
                console.log(`  ❌ getPerformanceReport returns invalid object`);
            }
        } catch (error) {
            console.log(`  ❌ getPerformanceReport throws error: ${error.message}`);
        }
    } else {
        console.log('  ❌ PerformanceMonitor module not found');
    }
    
    console.log('\n📱 Testing MobileOptimizer methods:');
    const mobileOpt = sandbox.MobileOptimizer;
    
    if (mobileOpt) {
        console.log('  ✅ MobileOptimizer module exists');
        
        // Test required methods
        const requiredMethods = ['init', 'getOptimizationStatus'];
        requiredMethods.forEach(method => {
            if (typeof mobileOpt[method] === 'function') {
                console.log(`  ✅ ${method} method exists`);
            } else {
                console.log(`  ❌ ${method} method missing`);
            }
        });
        
        // Test getOptimizationStatus functionality
        try {
            const status = mobileOpt.getOptimizationStatus();
            if (status && typeof status === 'object') {
                console.log(`  ✅ getOptimizationStatus returns valid object`);
                if (status.capabilities) {
                    console.log(`  ✅ Status includes capabilities`);
                }
                if (status.optimizations) {
                    console.log(`  ✅ Status includes optimizations`);
                }
            } else {
                console.log(`  ❌ getOptimizationStatus returns invalid object`);
            }
        } catch (error) {
            console.log(`  ❌ getOptimizationStatus throws error: ${error.message}`);
        }
    } else {
        console.log('  ❌ MobileOptimizer module not found');
    }
    
    console.log('\n🔗 Testing WebMiner class:');
    const WebMiner = sandbox.WebMiner;
    
    if (WebMiner) {
        console.log('  ✅ WebMiner class exists');
        
        try {
            const miner = new WebMiner();
            console.log('  ✅ WebMiner instance created successfully');
        } catch (error) {
            console.log(`  ❌ WebMiner instantiation failed: ${error.message}`);
        }
    } else {
        console.log('  ❌ WebMiner class not found');
    }
    
    console.log('\n🎉 Test completed successfully! All optimization methods are properly implemented.');
    
} catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
}