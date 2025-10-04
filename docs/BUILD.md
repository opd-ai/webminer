# WebMiner Build System

## Overview

WebMiner provides both development and production builds to support different use cases:

- **Development Build** (`webminer.js`): Full documentation, human-readable code, debugging support
- **Production Build** (`webminer.min.js`): Optimized for deployment, 40% smaller file size

## Build Process

### Generating the Production Build

The minification process is handled by the `minify.js` script:

```bash
node minify.js
```

This will:
1. Read the source `webminer.js` file
2. Remove comments (preserving license and critical documentation)
3. Optimize whitespace and code structure
4. Generate `webminer.min.js` with production header
5. Validate syntax of the output file

### Build Characteristics

| Aspect | Development | Production |
|--------|-------------|------------|
| **File Size** | ~88 KB | ~53 KB (40% smaller) |
| **Comments** | Full documentation | License only |
| **Formatting** | Human-readable | Optimized |
| **Debugging** | Excellent | Limited |
| **Load Speed** | Slower | Faster |
| **Functionality** | 100% | 100% (identical) |

### What Gets Preserved

The minification process carefully preserves:

- **All functionality**: Every feature works identically
- **Consent system**: All ethical mining controls maintained  
- **API compatibility**: Same public interfaces
- **Error handling**: All error paths preserved
- **License information**: MIT license header retained
- **Critical comments**: Ethics and safety-related documentation

### What Gets Optimized

The minification process removes:

- **Development comments**: Implementation details and explanations
- **Debug logging**: `console.log` statements (except errors/warnings)
- **Excessive whitespace**: Extra blank lines and indentation
- **Non-critical documentation**: JSDoc that's not essential for production

## Usage Guidelines

### Development (`webminer.js`)

Use the development build when:
- Developing and debugging your integration
- Customizing WebMiner functionality
- Learning how the consent system works
- Contributing to the project
- Need detailed error messages and logging

```html
<script src="webminer.js" 
        data-pool="wss://pool.example.com"
        data-wallet="YOUR_ADDRESS"
        data-throttle="0.25">
</script>
```

### Production (`webminer.min.js`)

Use the production build when:
- Deploying to live websites
- Optimizing page load performance
- Serving from CDNs
- Minimizing bandwidth usage
- Final production deployment

```html
<script src="webminer.min.js" 
        data-pool="wss://pool.example.com"
        data-wallet="YOUR_ADDRESS"
        data-throttle="0.25">
</script>
```

## Performance Benefits

### File Size Reduction

The production build provides significant benefits:

- **40% smaller file size** (88KB → 53KB)
- **Faster initial page load** due to reduced download time
- **Lower bandwidth costs** for high-traffic sites
- **Better CDN caching** with smaller file sizes
- **Improved mobile experience** with reduced data usage

### Load Time Improvement

Estimated load time improvements:

| Connection | Development | Production | Improvement |
|------------|-------------|------------|-------------|
| **Broadband** | ~80ms | ~48ms | 40% faster |
| **3G Mobile** | ~320ms | ~192ms | 40% faster |
| **Slow 3G** | ~640ms | ~384ms | 40% faster |

## Browser Compatibility

Both builds support identical browser compatibility:

- **Chrome 70+**
- **Firefox 65+** 
- **Safari 14+**
- **Edge 79+**

## Content Security Policy

Both builds are CSP-compatible:

```http
Content-Security-Policy: script-src 'self' 'unsafe-inline'; connect-src 'self' wss://your-pool.com; worker-src 'self' blob:;
```

## Verification

The build process includes automatic verification:

1. **Syntax validation**: Ensures minified JavaScript is valid
2. **Functionality testing**: Verifies all APIs are accessible
3. **Size reporting**: Shows compression ratio achieved
4. **Error detection**: Catches any minification issues

## Examples

The `examples/` directory includes demonstrations of both builds:

- `basic.html` - Development build with full documentation
- `production.html` - Production build optimization showcase  
- `advanced.html` - Side-by-side comparison of both builds

## Maintenance

### Updating the Production Build

Whenever `webminer.js` is updated:

1. Test changes in development build
2. Run `node minify.js` to regenerate production build
3. Verify functionality with test examples
4. Update version numbers if needed
5. Deploy both files to production

### Version Management

Both builds include version information:
- Development: Full version metadata in comments
- Production: Version in header comment only

## Troubleshooting

### Common Issues

**Minification fails with syntax error:**
- Check for template literal issues in source
- Verify all brackets and parentheses are balanced
- Look for problematic regex patterns

**Production build missing features:**
- Ensure the source file is complete
- Check that no critical code was removed
- Verify API objects are properly exported

**File size not reduced as expected:**
- Source file may already be optimized
- Large template strings are preserved for functionality
- WebAssembly data cannot be further compressed

### Debug Commands

```bash
# Validate syntax of production build
node --check webminer.min.js

# Compare file sizes
ls -la webminer.js webminer.min.js

# Test both builds in browser
python3 -m http.server 8888
# Navigate to http://localhost:8888/examples/
```

---

Built with 💜 for ethical web mining • WebMiner Build System v1.0.0