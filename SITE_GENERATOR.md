# WebMiner Static Site Generator

## Overview

The WebMiner static site generator converts markdown documentation files into a beautiful, navigable HTML website. It's a single Node.js script with no external dependencies that creates a complete documentation site in seconds.

## Quick Start

```bash
# Generate the site (without webminer)
node generate-site.js

# Generate with WebMiner integration
node generate-site.js \
  --pool="wss://pool.supportxmr.com:443" \
  --wallet="YOUR_MONERO_ADDRESS" \
  --throttle="0.25"

# Preview locally
python3 -m http.server 8080
# Visit http://localhost:8080
```

## Features

### ⚙️ WebMiner Integration

The generator can automatically embed the WebMiner script into every generated HTML page with your pool and wallet configuration, **plus a beautiful consensual miner UI at the top of each page**.

```bash
node generate-site.js \
  --pool="wss://pool.supportxmr.com:443" \
  --wallet="YOUR_MONERO_ADDRESS" \
  --throttle="0.25"
```

**Generated HTML includes:**

1. **Consent Banner** (shown on page load):
   - Attractive gradient background
   - Clear explanation of CPU usage
   - "Yes, I'll Help" button to start mining
   - "No Thanks" button to decline
   - User choice is remembered in localStorage

2. **Status Bar** (shown when mining):
   - Real-time hash rate display
   - Mining active indicator
   - One-click "Stop Mining" button

3. **WebMiner Script** (embedded at page bottom):
```html
<script src="webminer.js" 
        data-pool="wss://pool.supportxmr.com:443"
        data-wallet="YOUR_MONERO_ADDRESS"
        data-throttle="0.25"
        data-auto-start="false">
</script>
```

**Options:**
- `--pool`: WebSocket pool URL (e.g., `wss://pool.supportxmr.com:443`)
- `--wallet`: Your Monero wallet address
- `--throttle`: CPU usage limit (0.1 = 10%, 0.5 = 50%, etc.)

All three parameters are optional. Omit them to generate a site without the webminer script or UI.

### 🔍 Smart File Filtering

The generator automatically:
- **Excludes** files with `REVIEW` in the filename
- **Excludes** files with `PLAN` in the filename  
- **Excludes** patterns from `.gitignore`
- **Converts** `README.md` → `index.html` (homepage)
- **Converts** all other `.md` files → corresponding `.html` files

### 🎨 Generated Output

| File Type | Description |
|-----------|-------------|
| `index.html` | Homepage (from README.md) |
| `*.html` | Individual documentation pages |
| `styles.css` | Responsive stylesheet |

### 🧭 Navigation Features

- **Automatic navigation bar** on every page
- **"Home" link** always appears first
- **Current page highlighting** shows where you are
- **Alphabetically sorted** links (except Home)
- **Human-readable titles** (e.g., "The Democracy Of Computing")

### 📱 Responsive Design

The generated site includes:
- Mobile-friendly responsive layout
- Touch-optimized navigation
- Readable typography across all devices
- Code syntax highlighting
- Accessible HTML5 structure

## Example Output

### Input Files
```
README.md
ABOUT.md
PROJECT_PLAN.md           ← Excluded (contains PLAN)
CODE_REVIEW.md            ← Excluded (contains REVIEW)
GUIDE.md
```

### Generated Files (Without WebMiner)
```bash
node generate-site.js
```

**Output:**
```
index.html                ← From README.md
ABOUT.html
GUIDE.html
styles.css
```

### Generated Files (With WebMiner)
```bash
node generate-site.js \
  --pool="wss://pool.supportxmr.com:443" \
  --wallet="YOUR_MONERO_ADDRESS" \
  --throttle="0.25"
```

**Output:** Same HTML files, but each includes:
```html
<script src="webminer.js" 
        data-pool="wss://pool.supportxmr.com:443"
        data-wallet="YOUR_MONERO_ADDRESS"
        data-throttle="0.25">
</script>
```

### Sample HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <nav class="site-nav">
        <a href="index.html" class="active">Home</a>
        <a href="ABOUT.html">About</a>
        <a href="GUIDE.html">Guide</a>
    </nav>
    <main class="content">
        <!-- Your markdown content converted to HTML -->
    </main>
    <footer class="site-footer">
        <p>Generated with WebMiner Static Site Generator</p>
    </footer>
</body>
</html>
```

## Markdown Support

The generator handles common markdown features:

### Supported Elements

✅ **Headings** (`# H1` through `###### H6`)
✅ **Bold** (`**text**` or `__text__`)  
✅ **Italic** (`*text*` or `_text_`)
✅ **Links** (`[text](url)`)
✅ **Images** (`![alt](url)`)
✅ **Code blocks** (triple backticks with language)
✅ **Inline code** (`` `code` ``)
✅ **Lists** (ordered and unordered)
✅ **Blockquotes** (`> quote`)
✅ **Horizontal rules** (`---` or `***`)

### Code Highlighting Example

```javascript
// Code blocks preserve formatting and language hints
const miner = new WebMiner({
    pool: 'wss://pool.example.com',
    wallet: 'YOUR_ADDRESS',
    throttle: 0.25
});
```

## Styling

The generated `styles.css` provides:

- **Clean typography** with modern system fonts
- **Readable line height** (1.6) for comfortable reading
- **Code styling** with distinct background colors
- **Navigation hover effects** with smooth transitions
- **Responsive breakpoints** at 768px and 480px
- **Accessible color contrast** meeting WCAG standards

### Customization

To customize the styling:

1. Generate the initial site: `node generate-site.js`
2. Edit `styles.css` to match your brand
3. Regenerate anytime without losing CSS changes (unless you modify the generator)

## File Exclusion Rules

### Pattern Matching

Files are excluded if:
1. Filename contains `REVIEW` (case-sensitive)
   - ✅ Excludes: `REVIEW.md`, `code-REVIEW.md`, `REVIEW_AUDIT.md`
2. Filename contains `PLAN` (case-sensitive)
   - ✅ Excludes: `PLAN.md`, `ESSAY_PLANNING.md`, `WORKFLOW_PLAN.md`
3. Filename matches `.gitignore` patterns
   - ✅ Excludes: `*.log`, `temp/`, etc.

### Adding Custom Exclusions

To exclude additional patterns, add them to `.gitignore`:

```gitignore
# Existing patterns
*.log
node_modules/

# Custom exclusions for site generator
DRAFT_*.md
WIP_*.md
*.backup.md
```

## Console Output

The generator provides clear progress reporting:

```
🚀 Starting WebMiner static site generation...

📋 Loaded 4 .gitignore patterns
📁 Found 23 markdown files

⏭️  Skipping: ESSAY_PLANNING.md (excluded by filter)
⏭️  Skipping: REVIEW.md (excluded by filter)

✅ Processing 16 files after filtering

🔄 Processing: README.md
   ✓ Generated: index.html
🔄 Processing: ABOUT.md
   ✓ Generated: ABOUT.html

🎨 Generating stylesheet...
   ✓ Generated: styles.css

✨ Site generation complete!
📊 Generated 16 HTML pages + 1 CSS file
```

## Deployment

### Local Testing

```bash
# Python 3
python3 -m http.server 8080

# Node.js (install http-server globally first)
npx http-server -p 8080

# PHP
php -S localhost:8080
```

Then visit `http://localhost:8080`

### Static Hosting

The generated site is pure HTML/CSS with no server-side requirements. Deploy to:

- **GitHub Pages**: Push to `gh-pages` branch
- **Netlify**: Drag and drop the directory
- **Vercel**: Deploy from git repository
- **AWS S3**: Upload as static website
- **Any web server**: Just copy the `.html` and `.css` files

### Automation

Add to your CI/CD pipeline:

```yaml
# GitHub Actions example
- name: Generate documentation site
  run: node generate-site.js
  
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./
    publish_branch: gh-pages
```

## Technical Details

### Dependencies

- **Node.js** (any recent version)
- **No npm packages required** - pure Node.js built-in modules

### Architecture

The generator uses:
- `fs` module for file system operations
- `path` module for cross-platform paths
- Regular expressions for markdown parsing
- Template strings for HTML generation

### Performance

- Processes 20+ markdown files in under 1 second
- Single-pass parsing for efficiency
- No external process spawning
- Minimal memory footprint

### Limitations

This is a **simple** markdown converter focused on documentation. It does not support:

- ❌ Complex markdown tables (basic tables only)
- ❌ GitHub Flavored Markdown extensions
- ❌ Markdown inside HTML tags
- ❌ Custom markdown processors
- ❌ Live reload during development

For advanced markdown features, consider using a full static site generator like Hugo, Jekyll, or Eleventy.

## Troubleshooting

### Problem: Files not being generated

**Solution**: Check that files end with `.md` extension and don't match exclusion rules.

### Problem: Navigation links broken

**Solution**: Ensure all HTML files are in the same directory. The generator doesn't support subdirectories.

### Problem: Styles not loading

**Solution**: Verify `styles.css` exists in the same directory as your HTML files. Check browser console for 404 errors.

### Problem: Markdown not converting properly

**Solution**: The parser is simple and may not handle complex nesting. Simplify your markdown or use standard patterns.

## Contributing

The generator is a single file (`generate-site.js`) with clear documentation. To extend it:

1. Read the inline comments explaining each function
2. Test changes with `node generate-site.js`
3. Verify output in a browser
4. Submit a pull request with your improvements

## License

Same license as the WebMiner project.

---

**Questions?** Open an issue on the GitHub repository.

**Built with** 💜 **for documentation that just works.**
