#!/usr/bin/env node

/**
 * WebMiner Minification Tool
 * 
 * Creates a production-ready minified version of webminer.js
 * while preserving all ethical mining features and functionality.
 * 
 * This tool:
 * - Removes comments and unnecessary whitespace
 * - Preserves critical functionality and error handling
 * - Maintains readability for debugging when needed
 * - Optimizes string literals and code structure
 * - Keeps consent and ethics systems intact
 */

const fs = require('fs');
const path = require('path');

class WebMinerMinifier {
    constructor() {
        this.preservedStrings = new Map();
        this.stringCounter = 0;
    }

    /**
     * Minify the WebMiner JavaScript file
     * @param {string} inputPath - Path to source file
     * @param {string} outputPath - Path for minified output
     */
    minify(inputPath, outputPath) {
        console.log('🔧 Starting WebMiner minification...');
        
        let code = fs.readFileSync(inputPath, 'utf8');
        console.log(`📁 Source file size: ${(code.length / 1024).toFixed(2)} KB`);

        // Step 1: Remove multi-line comments (but preserve license)
        code = this.removeComments(code);
        
        // Step 2: Remove single-line comments
        code = this.removeSingleLineComments(code);
        
        // Step 3: Remove excessive whitespace
        code = this.removeExcessiveWhitespace(code);
        
        // Step 4: Add production header
        code = this.addProductionHeader() + code;
        
        // Write minified file
        fs.writeFileSync(outputPath, code, 'utf8');
        
        console.log(`✅ Minified file size: ${(code.length / 1024).toFixed(2)} KB`);
        console.log(`📉 Size reduction: ${(((fs.readFileSync(inputPath, 'utf8').length - code.length) / fs.readFileSync(inputPath, 'utf8').length) * 100).toFixed(1)}%`);
        console.log(`💾 Minified file saved: ${outputPath}`);
        
        return code;
    }

    /**
     * Remove multi-line comments but preserve license and critical docs
     */
    removeComments(code) {
        return code.replace(/\/\*[\s\S]*?\*\//g, (match) => {
            if (match.includes('@license') || 
                match.includes('WebMiner - Ethical Browser-Based') ||
                match.includes('CRITICAL') || 
                match.includes('ETHICS')) {
                return match; // Keep important documentation
            }
            return '';
        });
    }

    /**
     * Remove single-line comments safely
     */
    removeSingleLineComments(code) {
        return code.replace(/\/\/(?!.*(?:TODO|FIXME|CRITICAL|ETHICS|CONSENT)).*$/gm, '');
    }

    /**
     * Remove excessive whitespace while preserving structure
     */
    removeExcessiveWhitespace(code) {
        // Remove extra blank lines
        code = code.replace(/\n\n\n+/g, '\n\n');
        
        // Remove trailing whitespace
        code = code.replace(/[ \t]+$/gm, '');
        
        // Remove leading whitespace (but preserve indentation structure)
        code = code.replace(/^[ \t]+/gm, (match) => {
            // Keep some indentation for readability
            return match.length > 8 ? '    ' : match.length > 4 ? '  ' : '';
        });
        
        return code;
    }

    /**
     * Add production build header
     */
    addProductionHeader() {
        return `/*!
 * WebMiner v1.0.0 - Ethical Browser-Based Monero Mining
 * 
 * Consent-first, transparent mining with user control and resource transparency.
 * 
 * @license MIT
 * @author WebMiner Team
 * @build ${new Date().toISOString()}
 */
`;
    }
}

// Main execution
if (require.main === module) {
    const minifier = new WebMinerMinifier();
    const inputFile = path.join(__dirname, 'webminer.js');
    const outputFile = path.join(__dirname, 'webminer.min.js');
    
    if (!fs.existsSync(inputFile)) {
        console.error('❌ Error: webminer.js not found in current directory');
        process.exit(1);
    }
    
    try {
        minifier.minify(inputFile, outputFile);
        
        // Verify the minified file can be parsed
        try {
            new (require('vm').Script)(fs.readFileSync(outputFile, 'utf8'));
            console.log('✅ Minified file syntax validation passed');
        } catch (syntaxError) {
            console.error('❌ Syntax error in minified file:', syntaxError.message);
            process.exit(1);
        }
        
        console.log('\n🎉 Minification completed successfully!');
        console.log('📋 Next steps:');
        console.log('   • Test webminer.min.js in your examples');
        console.log('   • Update HTML files to use production version');
        console.log('   • Deploy to your web server');
        
    } catch (error) {
        console.error('❌ Minification failed:', error.message);
        process.exit(1);
    }
}

module.exports = WebMinerMinifier;