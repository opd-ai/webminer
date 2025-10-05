
# WebMiner 🚀

## Simple Standalone Static Monero Webminer

> ✅ **Production Ready** - All core features implemented and tested

A lightweight, ethical, consent-based Monero webminer that runs entirely in modern browsers. Built as a single JavaScript file with no external dependencies for easy self-hosting and integration.

## ✨ Key Features

- **🛡️ Consent-First**: Explicit user permission required - no dark patterns
- **📱 Universal Compatibility**: Works in all modern browsers (Chrome 70+, Firefox 65+, Safari 14+, Edge 79+)
- **⚡ Single File Deployment**: One JavaScript file (89KB development, 54KB production)
- **🔧 Self-Hostable**: Deploy on any standard web server
- **🎛️ Configurable Resource Usage**: 10-50% CPU throttling options
- **🔒 Secure**: No eval(), CSP compatible, secure WebSocket connections
- **📊 Transparent**: Real-time performance monitoring and earnings estimates
- **🔋 Device-Friendly**: Intelligent battery protection, thermal throttling, and adaptive performance optimization
- **📊 Smart Monitoring**: Real-time performance tracking with health scoring and optimization recommendations
- **📱 Mobile-Optimized**: Touch-friendly interface, orientation handling, and mobile-specific power management

## 🎯 Philosophy

WebMiner prioritizes ethical implementation over mining efficiency. Every design decision puts user consent, transparent communication, and maintainable code first. Mining should never happen without explicit user permission, and users should always understand exactly what their browsers are doing.

## ⚠️ WebSocket-to-Stratum Proxy Required

**Important**: Most Monero pools use TCP Stratum protocol, which browsers cannot access directly. You need a WebSocket-to-Stratum proxy server to bridge the connection.

📖 **[Complete Proxy Setup Guide](docs/WEBSOCKET_PROXY.md)** - Includes Node.js proxy server code, Docker deployment, and production configuration.

```
Browser (WebMiner) --[WebSocket]--> Proxy Server --[TCP Stratum]--> Mining Pool
```

## 🚀 Quick Integration

Once your proxy is running, integration is simple:

```html
<!-- Development Version (webminer.js) - Full documentation, 89KB -->
<script src="webminer.js" 
        data-pool="wss://your-proxy.example.com"
        data-wallet="YOUR_MONERO_ADDRESS"
        data-throttle="0.25">
</script>

<!-- Production Version (webminer.min.js) - Optimized, 54KB -->
<script src="webminer.min.js" 
        data-pool="wss://your-proxy.example.com"
        data-wallet="YOUR_MONERO_ADDRESS"
        data-throttle="0.25">
</script>
```

Or programmatic control:

```javascript
WebMiner.init({
  pool: 'wss://your-proxy.example.com',
  wallet: 'YOUR_MONERO_ADDRESS',
  autoStart: false,
  throttle: 0.25
});
```

### 📦 Build Options

| Build | File | Size | Use Case |
|-------|------|------|----------|
| **Development** | `webminer.js` | 89 KB | Development, debugging, customization |
| **Production** | `webminer.min.js` | 54 KB | Live websites, CDN deployment |

Both builds include identical functionality - use development for debugging and production for deployment.

## 🛠️ Technical Approach

- **Mining Algorithm**: Monero's RandomX (CPU-optimized)
- **Performance**: WebAssembly + JavaScript fallback
- **Architecture**: Web Workers to prevent UI blocking
- **Connection**: WebSocket pool protocol
- **Compatibility**: Progressive enhancement with graceful degradation

## 🧪 Testing the Implementation

**All core features are complete!** Test the full mining system with consent management and adaptive optimizations:

1. **Local Testing:**

   ```bash
   # Clone and serve locally
   python3 -m http.server 9000
      # Open http://localhost:9000/examples/basic.html
   ```

2. **Try the Demo:**
   - Click "Show Consent Dialog" to test the consent system
   - Click "Start Mining" to test the complete flow
   - Observe the persistent mining indicator (now with real mining!)
   - Test the one-click stop functionality
   - Try the mining settings dialog for throttle adjustment

3. **Run Tests:**

   ```bash
   # Open the comprehensive test suite
   # http://localhost:9000/tests/test-suite.html
   ```

4. **Integration Testing:**

   ```html
   <script src="webminer.js" 
           data-pool="wss://pool.example.com"
           data-wallet="YOUR_MONERO_ADDRESS"
           data-throttle="0.25">
   </script>
   ```

5. **Test Optimization Features:**

   ```bash
   # Open the optimization test suite
   # http://localhost:9000/tests/optimization-tests.html
   # Test performance monitoring, adaptive throttling, mobile optimizations
   ```

**Note:** The implementation includes complete mining functionality with WebAssembly RandomX, pool connections, real hash calculations, and comprehensive optimization features. The system intelligently adapts to device capabilities, protects battery life, and provides mobile-optimized experiences. Ready for production use with real pool URLs and wallet addresses.

## 📚 Documentation

- **API Reference:** [`docs/API.md`](docs/API.md)
- **Build Guide:** [`docs/BUILD.md`](docs/BUILD.md)
- **Demo Page:** [`examples/basic.html`](examples/basic.html)
- **Test Suite:** [`tests/test-suite.html`](tests/test-suite.html)

### 🌐 Static Site Generator

WebMiner includes a Node.js static site generator that converts markdown documentation to a navigable HTML website with **built-in consensual mining UI**:

```bash
# Generate HTML site from markdown files
node generate-site.js

# Generate with WebMiner integration (optional)
node generate-site.js \
  --pool="wss://pool.supportxmr.com:443" \
  --wallet="YOUR_MONERO_ADDRESS" \
  --throttle="0.25"
```

**Features:**
- Converts all `.md` files to `.html` (README.md → index.html)
- Automatically excludes files with `REVIEW` or `PLAN` in the name
- Respects `.gitignore` patterns
- Generates navigation bar with current page highlighting
- Creates responsive `styles.css` stylesheet
- Produces clean, accessible HTML5 documents
- **Optional:** Embeds webminer.js script with pool/wallet configuration
- **Consensual UI:** Beautiful banner asking for user permission before mining
- **Status Display:** Real-time hash rate and one-click stop button

**Output:** 17 HTML pages + styles.css ready for deployment

## 📋 Development Progress

### Milestone 1: Basic Framework ✅

- [x] Consent system implementation
- [x] Basic mining worker structure
- [x] Pool connection prototype
- [x] Simple UI controls

### Milestone 2: Core Mining ✅

- [x] WebAssembly RandomX integration
- [x] JavaScript fallback implementation
- [x] Hash rate calculation
- [x] Share submission system

### Milestone 3: Optimization ✅

- [x] Performance monitoring - Real-time device capability detection and health scoring
- [x] Adaptive throttling - Dynamic CPU usage adjustment based on device conditions  
- [x] Mobile optimizations - Touch-friendly UI and mobile-specific power management
- [x] Battery protection - Navigator Battery API integration with automatic mining pause

### Milestone 4: Single-File Build ✅

- [x] Build system for concatenation
- [x] WebAssembly embedding (inline Uint8Array)
- [x] Minification and optimization (40% size reduction)
- [x] Browser compatibility (vanilla ES6+, no transpilation)

### Milestone 5: Documentation ✅

- [x] Complete API documentation
- [x] Build system documentation
- [x] Integration examples
- [x] Comprehensive test suite

## 🎮 Use Cases

- **Content Creators**: Monetize websites with user consent
- **Developers**: Easy integration into web applications
- **Organizations**: Alternative revenue streams with transparency
- **Researchers**: Browser-based mining experimentation

## 🔒 Security & Ethics

- **User Control**: One-click stop functionality
- **Resource Limits**: Hard CPU usage caps
- **Privacy**: No personal data collection
- **Transparency**: Clear earnings expectations
- **Mobile Protection**: Battery and thermal safeguards

## 📚 Available Documentation

- **API Reference** - Complete documentation in `docs/API.md`
- **Build Guide** - Build system details in `docs/BUILD.md`
- **Integration Examples** - Working demos in `examples/` directory
- **Test Suites** - Comprehensive tests in `tests/` directory
- **Security Best Practices** - Documented in API reference
- **Mobile Device Guidelines** - Included in API documentation

## 🤝 Contributing

This project is in early development. Contribution guidelines will be available once the core framework is complete.

## ⚖️ License

License information will be provided with the initial release.

## 🎯 Project Goals - All Achieved ✅

1. ✅ **Single file deployment** - 89KB development, 54KB production (including embedded WebAssembly)
2. ✅ **Works in 95%+ of browsers** - Vanilla ES6+, modern browser support
3. ✅ **Consent-first approach** - No mining without explicit permission
4. ✅ **Configurable resource usage** - 10-50% CPU throttling options
5. ✅ **Production-ready reliability** - Handles network failures gracefully with auto-reconnect
6. ✅ **Clear documentation** - Developers can integrate in < 5 minutes
7. ✅ **Ethical implementation** - Transparent about earnings and impact

---

**Ready for production use!** This project sets a new standard for ethical browser-based cryptocurrency mining.

---

Built with 💜 for the open web
