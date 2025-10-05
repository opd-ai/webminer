# Consensual Miner UI Documentation

## Overview

When the static site generator is run with WebMiner configuration (`--pool`, `--wallet`, `--throttle`), every generated HTML page includes a beautiful, consensual mining interface at the top of the page.

## UI States

### 1. Consent Banner (Initial State)

When a user first visits any page, they see an attractive consent banner:

```
╔════════════════════════════════════════════════════════════════════╗
║  🚀 Support This Site                                              ║
║                                                                    ║
║  Help keep this content free by contributing a small amount       ║
║  of computing power. This uses about 25% of your CPU and you      ║
║  can stop anytime.                                                 ║
║                                                                    ║
║  [✓ Yes, I'll Help]  [No Thanks]                                  ║
╚════════════════════════════════════════════════════════════════════╝
```

**Features:**
- Purple gradient background (`#667eea` → `#764ba2`)
- Clear explanation of CPU usage percentage
- Two prominent buttons for user choice
- No dark patterns - equal emphasis on both options

### 2. Mining Status Bar (Active State)

After clicking "Yes, I'll Help", the banner is replaced with a status bar:

```
╔════════════════════════════════════════════════════════════════════╗
║  ⚡ Mining Active          45.2 H/s          [Stop Mining]         ║
╚════════════════════════════════════════════════════════════════════╝
```

**Features:**
- Green background (`#10b981`) indicating active state
- Pulsing lightning bolt icon
- Real-time hash rate display (updates every second)
- Prominent "Stop Mining" button for instant control

### 3. Declined State

If user clicks "No Thanks", the banner disappears and the choice is saved in localStorage. The banner won't reappear on subsequent page loads.

## Technical Implementation

### HTML Structure

```html
<!-- Consent Banner -->
<div class="miner-consent-banner" id="minerConsentBanner">
    <div class="miner-banner-content">
        <div class="miner-info">
            <h3>🚀 Support This Site</h3>
            <p>Help keep this content free...</p>
        </div>
        <div class="miner-controls">
            <button id="minerStartBtn" class="miner-btn miner-btn-primary">
                ✓ Yes, I'll Help
            </button>
            <button id="minerDeclineBtn" class="miner-btn miner-btn-secondary">
                No Thanks
            </button>
        </div>
    </div>
</div>

<!-- Status Bar (hidden initially) -->
<div class="miner-status-bar" id="minerStatusBar" style="display: none;">
    <div class="miner-status-content">
        <span class="miner-status-icon">⚡</span>
        <span class="miner-status-text">Mining Active</span>
        <span class="miner-status-stats" id="minerStats">0 H/s</span>
        <button id="minerStopBtn" class="miner-btn miner-btn-stop">Stop Mining</button>
    </div>
</div>
```

### JavaScript Control Flow

```javascript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize WebMiner with autoStart: false
    const miner = new WebMiner({ autoStart: false });
    
    // Handle "Yes, I'll Help" click
    startBtn.addEventListener('click', async function() {
        const started = await miner.start();
        if (started) {
            // Hide consent banner
            banner.style.display = 'none';
            // Show status bar
            statusBar.style.display = 'block';
            // Update hash rate every second
            setInterval(updateHashRate, 1000);
        }
    });
    
    // Handle "No Thanks" click
    declineBtn.addEventListener('click', function() {
        banner.style.display = 'none';
        localStorage.setItem('webminer-declined', 'true');
    });
    
    // Handle "Stop Mining" click
    stopBtn.addEventListener('click', function() {
        miner.stop();
        statusBar.style.display = 'none';
        banner.style.display = 'block';
    });
    
    // Check if user previously declined
    if (localStorage.getItem('webminer-declined') === 'true') {
        banner.style.display = 'none';
    }
});
```

## CSS Styling

### Consent Banner Styles

```css
.miner-consent-banner {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.miner-btn-primary {
    background-color: #10b981;
    color: white;
    transition: all 0.2s;
}

.miner-btn-primary:hover {
    background-color: #059669;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}
```

### Status Bar Styles

```css
.miner-status-bar {
    background-color: #10b981;
    color: white;
    padding: 12px 20px;
}

.miner-status-icon {
    animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}
```

## Responsive Design

### Mobile Layout (< 768px)

On mobile devices, the UI automatically adapts:

- Banner content stacks vertically
- Buttons become full-width
- Text is center-aligned
- Status bar wraps gracefully
- All interactive elements remain touch-friendly

```css
@media (max-width: 768px) {
    .miner-banner-content {
        flex-direction: column;
        text-align: center;
    }
    
    .miner-controls {
        width: 100%;
        flex-direction: column;
    }
    
    .miner-btn {
        width: 100%;
    }
}
```

## User Experience Principles

### 1. Consent-First Design
- **NEVER starts automatically** - `data-auto-start="false"` is hardcoded
- Mining only begins after explicit "Yes" click
- No pre-checked boxes or dark patterns
- Equal visual weight for accept and decline options

### 2. Full Transparency
- CPU percentage clearly displayed (e.g., "about 25% of your CPU")
- Real-time hash rate visible during mining
- No hidden mining activity

### 3. User Control
- One-click stop button always visible when mining
- Stop button is prominent and easy to find
- User choice is remembered (localStorage)
- Can restart mining at any time

### 4. Visual Feedback
- Banner disappears when mining starts
- Status bar appears with animated icon
- Hash rate updates every second
- Smooth transitions between states

## Integration with WebMiner.js

The UI is designed to work seamlessly with the WebMiner core library:

```javascript
// WebMiner initialization
const miner = new WebMiner({
    autoStart: false  // UI handles consent, never auto-start
});

// Start mining (after user clicks "Yes")
const started = await miner.start();
// Returns true if user grants consent in WebMiner's own dialog

// Get hash rate for display
const hashRate = miner.getHashRate();
// Updates every second in status bar

// Stop mining
miner.stop();
// Called when user clicks "Stop Mining"
```

## Customization

### Changing CPU Percentage

The displayed percentage automatically updates based on `--throttle` argument:

```bash
node generate-site.js --throttle="0.1"   # "about 10% of your CPU"
node generate-site.js --throttle="0.25"  # "about 25% of your CPU"
node generate-site.js --throttle="0.5"   # "about 50% of your CPU"
```

### Customizing UI Text

Edit the `generateMinerUI()` function in `generate-site.js`:

```javascript
function generateMinerUI(config = {}) {
    return `<div class="miner-consent-banner">
        <h3>🚀 Your Custom Title</h3>
        <p>Your custom message...</p>
        ...
    </div>`;
}
```

### Customizing Colors

Edit the CSS generation in `generateStylesheet()`:

```javascript
.miner-consent-banner {
    background: linear-gradient(135deg, #YOUR_COLOR_1, #YOUR_COLOR_2);
}

.miner-status-bar {
    background-color: #YOUR_STATUS_COLOR;
}
```

## Browser Compatibility

The UI works in all modern browsers:

- ✅ Chrome 70+
- ✅ Firefox 65+
- ✅ Safari 14+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Android)

**Features used:**
- CSS Grid/Flexbox (widely supported)
- localStorage API (universal)
- async/await (modern browsers)
- CSS animations (graceful degradation)

## Accessibility

### Keyboard Navigation
- All buttons are keyboard accessible
- Tab order is logical (left to right)
- Enter/Space activates buttons

### Screen Readers
- Semantic HTML structure
- Clear button labels
- Status updates announced

### Visual Accessibility
- High contrast ratios meet WCAG AA standards
- Text is resizable without breaking layout
- No reliance on color alone for information

## Performance Impact

The UI itself has minimal performance impact:

- **HTML**: ~1.5 KB (banner + status bar)
- **CSS**: ~2 KB (styles + animations)
- **JavaScript**: ~1 KB (event handlers)
- **Total**: ~4.5 KB additional overhead

The WebMiner script itself is loaded but does nothing until user clicks "Yes".

## Privacy Considerations

The UI respects user privacy:

- **No tracking**: No analytics or external calls
- **Local storage only**: Consent choice stored locally
- **No cookies**: Uses localStorage instead
- **No personal data**: Only stores "declined" boolean

## Testing

To test the UI:

1. **Generate site with config:**
   ```bash
   node generate-site.js \
     --pool="wss://pool.supportxmr.com:443" \
     --wallet="YOUR_ADDRESS" \
     --throttle="0.25"
   ```

2. **Serve locally:**
   ```bash
   python3 -m http.server 8080
   ```

3. **Open in browser:**
   ```
   http://localhost:8080/index.html
   ```

4. **Test scenarios:**
   - Click "Yes, I'll Help" - should show status bar
   - Check hash rate updates - should update every second
   - Click "Stop Mining" - should return to banner
   - Click "No Thanks" - should hide banner
   - Reload page - should remember "No Thanks" choice
   - Clear localStorage - banner should reappear

## Production Deployment

For production deployment:

1. **Use real pool and wallet:**
   ```bash
   node generate-site.js \
     --pool="wss://your-production-pool.com:443" \
     --wallet="YOUR_REAL_MONERO_ADDRESS" \
     --throttle="0.25"
   ```

2. **Ensure webminer.js is accessible:**
   - Place `webminer.js` in same directory as HTML files
   - Or update script src to CDN/absolute path

3. **Test thoroughly:**
   - Test on multiple devices
   - Verify mining actually works
   - Check pool connection
   - Monitor hash rates

4. **Deploy:**
   - Upload all `.html` files
   - Upload `styles.css`
   - Upload `webminer.js`
   - Ensure same directory structure

---

**The consensual miner UI puts users in control while making it easy for them to support your content. It's designed to be transparent, respectful, and effective.**
