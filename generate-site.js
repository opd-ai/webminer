#!/usr/bin/env node

/**
 * Static Site Generator for WebMiner Documentation
 * Converts markdown files to HTML with navigation and styling
 */

const fs = require('fs');
const path = require('path');

/**
 * Parse .gitignore file and return array of patterns to exclude
 */
function parseGitignore() {
    const gitignorePath = path.join(__dirname, '.gitignore');
    if (!fs.existsSync(gitignorePath)) {
        return [];
    }
    
    const content = fs.readFileSync(gitignorePath, 'utf-8');
    return content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'))
        .map(pattern => {
            // Convert gitignore patterns to regex-friendly format
            pattern = pattern.replace(/\./g, '\\.');
            pattern = pattern.replace(/\*/g, '.*');
            return new RegExp('^' + pattern + '$');
        });
}

/**
 * Check if a filename should be excluded based on filtering rules
 */
function shouldExcludeFile(filename, gitignorePatterns) {
    // Exclude files with REVIEW in the name
    if (filename.includes('REVIEW')) {
        return true;
    }
    
    // Exclude files with PLAN in the name
    if (filename.includes('PLAN')) {
        return true;
    }
    
    // Check against .gitignore patterns
    for (const pattern of gitignorePatterns) {
        if (pattern.test(filename)) {
            return true;
        }
    }
    
    return false;
}

/**
 * Convert filename to human-readable title
 */
function filenameToTitle(filename) {
    if (filename === 'index.html') {
        return 'Home';
    }
    
    // Remove .html extension
    let title = filename.replace('.html', '');
    
    // Replace hyphens and underscores with spaces
    title = title.replace(/[-_]/g, ' ');
    
    // Capitalize each word
    title = title.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    
    return title;
}

/**
 * Generate navigation HTML
 */
function generateNavigation(pages, currentPage) {
    const navLinks = pages
        .sort((a, b) => {
            // Home always first
            if (a === 'index.html') return -1;
            if (b === 'index.html') return 1;
            return filenameToTitle(a).localeCompare(filenameToTitle(b));
        })
        .map(page => {
            const title = filenameToTitle(page);
            const activeClass = page === currentPage ? ' class="active"' : '';
            return `        <a href="${page}"${activeClass}>${title}</a>`;
        })
        .join('\n');
    
    return `    <nav class="site-nav">\n${navLinks}\n    </nav>`;
}

/**
 * Simple markdown to HTML converter
 * Handles common markdown patterns
 */
function markdownToHtml(markdown) {
    let html = markdown;
    
    // Convert headings (h1-h6)
    html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>');
    html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>');
    html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
    html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');
    
    // Convert code blocks (fenced with triple backticks)
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        const language = lang ? ` class="language-${lang}"` : '';
        const escapedCode = code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        return `<pre><code${language}>${escapedCode}</code></pre>`;
    });
    
    // Convert inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Convert bold text
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
    
    // Convert italic text
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.+?)_/g, '<em>$1</em>');
    
    // Convert links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    
    // Convert images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
    
    // Convert blockquotes
    html = html.replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>');
    
    // Convert horizontal rules
    html = html.replace(/^---$/gm, '<hr>');
    html = html.replace(/^\*\*\*$/gm, '<hr>');
    
    // Convert unordered lists
    html = html.replace(/^\*\s+(.+)$/gm, '<li>$1</li>');
    html = html.replace(/^-\s+(.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
    
    // Convert ordered lists
    html = html.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
    
    // Convert paragraphs (lines separated by blank lines)
    const lines = html.split('\n');
    let inBlock = false;
    let result = [];
    let paragraph = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        
        // Check if we're in a block element
        if (trimmed.match(/^<(h[1-6]|pre|ul|ol|blockquote|hr|table)/)) {
            if (paragraph.length > 0) {
                result.push('<p>' + paragraph.join(' ') + '</p>');
                paragraph = [];
            }
            result.push(line);
            inBlock = true;
        } else if (trimmed.match(/^<\/(pre|ul|ol|blockquote|table)/)) {
            result.push(line);
            inBlock = false;
        } else if (inBlock || trimmed.startsWith('<')) {
            result.push(line);
        } else if (trimmed === '') {
            if (paragraph.length > 0) {
                result.push('<p>' + paragraph.join(' ') + '</p>');
                paragraph = [];
            }
        } else {
            paragraph.push(trimmed);
        }
    }
    
    if (paragraph.length > 0) {
        result.push('<p>' + paragraph.join(' ') + '</p>');
    }
    
    return result.join('\n');
}

/**
 * Generate complete HTML document
 */
function generateHtmlDocument(title, content, navigation) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
${navigation}
    <main class="content">
${content}
    </main>
    <footer class="site-footer">
        <p>Generated with WebMiner Static Site Generator</p>
    </footer>
</body>
</html>`;
}

/**
 * Generate CSS stylesheet
 */
function generateStylesheet() {
    return `/* WebMiner Documentation Styles */

/* Base styles */
* {
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
                 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                 sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #fff;
    margin: 0;
    padding: 0;
}

.content {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
}

/* Navigation */
.site-nav {
    background-color: #f8f9fa;
    border-bottom: 2px solid #e9ecef;
    padding: 15px 20px;
    margin-bottom: 30px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.site-nav a {
    margin-right: 20px;
    text-decoration: none;
    color: #0066cc;
    padding: 5px 10px;
    border-radius: 4px;
    transition: background-color 0.2s, color 0.2s;
}

.site-nav a:hover {
    background-color: #e9ecef;
    color: #0052a3;
}

.site-nav a.active {
    font-weight: bold;
    color: #fff;
    background-color: #0066cc;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    line-height: 1.3;
    color: #222;
}

h1 {
    font-size: 2.5em;
    margin-top: 0;
    border-bottom: 2px solid #e9ecef;
    padding-bottom: 0.3em;
}

h2 {
    font-size: 2em;
    border-bottom: 1px solid #e9ecef;
    padding-bottom: 0.3em;
}

h3 {
    font-size: 1.5em;
}

h4 {
    font-size: 1.25em;
}

p {
    margin: 1em 0;
}

a {
    color: #0066cc;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

/* Code styling */
code {
    background-color: #f4f4f4;
    padding: 2px 6px;
    border-radius: 3px;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 0.9em;
    color: #e83e8c;
}

pre {
    background-color: #f4f4f4;
    padding: 15px;
    border-radius: 5px;
    overflow-x: auto;
    border: 1px solid #ddd;
    margin: 1.5em 0;
}

pre code {
    background-color: transparent;
    padding: 0;
    color: #333;
    font-size: 0.9em;
}

/* Lists */
ul, ol {
    margin: 1em 0;
    padding-left: 2em;
}

li {
    margin: 0.5em 0;
}

/* Blockquotes */
blockquote {
    margin: 1.5em 0;
    padding: 10px 20px;
    border-left: 4px solid #0066cc;
    background-color: #f8f9fa;
    color: #555;
    font-style: italic;
}

/* Horizontal rules */
hr {
    border: none;
    border-top: 2px solid #e9ecef;
    margin: 2em 0;
}

/* Images */
img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 1.5em auto;
}

/* Tables */
table {
    border-collapse: collapse;
    width: 100%;
    margin: 1.5em 0;
}

th, td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
}

th {
    background-color: #f8f9fa;
    font-weight: bold;
}

tr:nth-child(even) {
    background-color: #f8f9fa;
}

/* Footer */
.site-footer {
    max-width: 900px;
    margin: 40px auto 0;
    padding: 20px;
    border-top: 2px solid #e9ecef;
    text-align: center;
    color: #666;
    font-size: 0.9em;
}

/* Responsive design */
@media (max-width: 768px) {
    .content {
        padding: 15px;
    }
    
    .site-nav {
        padding: 10px 15px;
        flex-direction: column;
    }
    
    .site-nav a {
        margin-right: 0;
        margin-bottom: 5px;
        display: block;
    }
    
    h1 {
        font-size: 2em;
    }
    
    h2 {
        font-size: 1.5em;
    }
    
    pre {
        padding: 10px;
        font-size: 0.85em;
    }
}

@media (max-width: 480px) {
    h1 {
        font-size: 1.75em;
    }
    
    h2 {
        font-size: 1.35em;
    }
    
    h3 {
        font-size: 1.15em;
    }
}
`;
}

/**
 * Main site generation function
 */
function generateSite() {
    console.log('🚀 Starting WebMiner static site generation...\n');
    
    // Parse .gitignore
    const gitignorePatterns = parseGitignore();
    console.log(`📋 Loaded ${gitignorePatterns.length} .gitignore patterns`);
    
    // Read all markdown files from root directory
    const files = fs.readdirSync(__dirname);
    const markdownFiles = files.filter(file => file.endsWith('.md'));
    
    console.log(`📁 Found ${markdownFiles.length} markdown files\n`);
    
    // Filter files based on exclusion rules
    const filteredFiles = markdownFiles.filter(file => {
        if (shouldExcludeFile(file, gitignorePatterns)) {
            console.log(`⏭️  Skipping: ${file} (excluded by filter)`);
            return false;
        }
        return true;
    });
    
    console.log(`\n✅ Processing ${filteredFiles.length} files after filtering\n`);
    
    // Generate list of output HTML files for navigation
    const htmlPages = filteredFiles.map(file => {
        if (file === 'README.md') {
            return 'index.html';
        }
        return file.replace('.md', '.html');
    });
    
    // Process each markdown file
    filteredFiles.forEach(file => {
        console.log(`🔄 Processing: ${file}`);
        
        // Read markdown content
        const markdownPath = path.join(__dirname, file);
        const markdown = fs.readFileSync(markdownPath, 'utf-8');
        
        // Convert markdown to HTML
        const htmlContent = markdownToHtml(markdown);
        
        // Determine output filename
        const outputFilename = file === 'README.md' ? 'index.html' : file.replace('.md', '.html');
        
        // Extract title (use first h1 or filename)
        const titleMatch = markdown.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : filenameToTitle(outputFilename);
        
        // Generate navigation
        const navigation = generateNavigation(htmlPages, outputFilename);
        
        // Generate complete HTML document
        const htmlDocument = generateHtmlDocument(title, htmlContent, navigation);
        
        // Write HTML file
        const outputPath = path.join(__dirname, outputFilename);
        fs.writeFileSync(outputPath, htmlDocument, 'utf-8');
        
        console.log(`   ✓ Generated: ${outputFilename}`);
    });
    
    // Generate stylesheet
    console.log('\n🎨 Generating stylesheet...');
    const cssPath = path.join(__dirname, 'styles.css');
    fs.writeFileSync(cssPath, generateStylesheet(), 'utf-8');
    console.log('   ✓ Generated: styles.css');
    
    console.log('\n✨ Site generation complete!');
    console.log(`📊 Generated ${filteredFiles.length} HTML pages + 1 CSS file\n`);
}

// Run the generator
if (require.main === module) {
    try {
        generateSite();
    } catch (error) {
        console.error('❌ Error generating site:', error.message);
        process.exit(1);
    }
}

module.exports = { generateSite };
