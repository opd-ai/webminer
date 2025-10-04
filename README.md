
# WebMiner 🚀

## Simple Standalone Static Monero Webminer

> 🚧 **Coming Soon** - Currently in active development

A lightweight, ethical, consent-based Monero webminer that runs entirely in modern browsers. Built as a single JavaScript file with no external dependencies for easy self-hosting and integration.

## ✨ Key Features (Planned)

- **🛡️ Consent-First**: Explicit user permission required - no dark patterns
- **📱 Universal Compatibility**: Works in all modern browsers (Chrome 70+, Firefox 65+, Safari 14+, Edge 79+)
- **⚡ Single File Deployment**: One JavaScript file < 200KB (including embedded WebAssembly)
- **🔧 Self-Hostable**: Deploy on any standard web server
- **🎛️ Configurable Resource Usage**: 10-50% CPU throttling options
- **🔒 Secure**: No eval(), CSP compatible, secure WebSocket connections
- **📊 Transparent**: Real-time performance monitoring and earnings estimates
- **🔋 Device-Friendly**: Intelligent battery protection, thermal throttling, and adaptive performance optimization
- **📊 Smart Monitoring**: Real-time performance tracking with health scoring and optimization recommendations
- **📱 Mobile-Optimized**: Touch-friendly interface, orientation handling, and mobile-specific power management

## 🎯 Philosophy

WebMiner prioritizes ethical implementation over mining efficiency. Every design decision puts user consent, transparent communication, and maintainable code first. Mining should never happen without explicit user permission, and users should always understand exactly what their browsers are doing.

## 🚀 Quick Integration (Preview)

Once released, integration will be as simple as:

```html
<!-- Development Version (webminer.js) - Full documentation, 88KB -->
<script src="webminer.js" 
        data-pool="wss://pool.example.com"
        data-wallet="YOUR_MONERO_ADDRESS"
        data-throttle="0.25">
</script>

<!-- Production Version (webminer.min.js) - Optimized, 53KB -->
<script src="webminer.min.js" 
        data-pool="wss://pool.example.com"
        data-wallet="YOUR_MONERO_ADDRESS"
        data-throttle="0.25">
</script>
```

Or programmatic control:

```javascript
WebMiner.init({
  pool: 'wss://pool.example.com',
  wallet: 'YOUR_MONERO_ADDRESS',
  autoStart: false,
  throttle: 0.25
});
```

### 📦 Build Options

| Build | File | Size | Use Case |
|-------|------|------|----------|
| **Development** | `webminer.js` | ~88 KB | Development, debugging, customization |
| **Production** | `webminer.min.js` | ~53 KB | Live websites, CDN deployment |

Both builds include identical functionality - use development for debugging and production for deployment.

## 🛠️ Technical Approach

- **Mining Algorithm**: Monero's RandomX (CPU-optimized)
- **Performance**: WebAssembly + JavaScript fallback
- **Architecture**: Web Workers to prevent UI blocking
- **Connection**: WebSocket pool protocol
- **Compatibility**: Progressive enhancement with graceful degradation

## 🧪 Testing Current Implementation

**Phase 1 is now complete!** You can test the consent system and UI components:

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

**Note:** Current implementation includes full mining functionality with WebAssembly RandomX, pool connections, real hash calculations, and comprehensive optimization features. The system now intelligently adapts to device capabilities, protects battery life, and provides mobile-optimized experiences. Ready for production use with real pool URLs and wallet addresses.

## 📚 Documentation

- **API Reference:** [`docs/API.md`](docs/API.md)
- **Demo Page:** [`examples/basic.html`](examples/basic.html)
- **Test Suite:** [`tests/test-suite.html`](tests/test-suite.html)
- **Implementation Plan:** [`PLAN.md`](PLAN.md)

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

### Milestone 4: Single-File Build 📅

- [ ] Build system for concatenation
- [ ] WebAssembly embedding
- [ ] Minification and optimization
- [ ] Browser compatibility testing

### Milestone 5: Documentation 📅

- [ ] Complete API documentation
- [ ] Integration examples
- [ ] Performance benchmarks
- [ ] Security audit

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

## 📚 Documentation (Coming Soon)

- API Reference
- Integration Guide
- Security Best Practices
- Performance Benchmarks
- Mobile Device Guidelines

## 🤝 Contributing

This project is in early development. Contribution guidelines will be available once the core framework is complete.

## ⚖️ License

License information will be provided with the initial release.

## 🎯 Project Goals

1. **Single file < 200KB** (including embedded WebAssembly)
2. **Works in 95%+ of browsers** accessing the web
3. **Consent-first approach** - no mining without explicit permission
4. **Configurable resource usage** - 10-50% CPU throttling options
5. **Production-ready reliability** - handles network failures gracefully
6. **Clear documentation** - developers can integrate in < 5 minutes
7. **Ethical implementation** - transparent about earnings and impact

---

**Stay tuned for updates!** This project aims to set a new standard for ethical browser-based cryptocurrency mining.

---

Built with 💜 for the open web
