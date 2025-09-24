import { chromium } from 'playwright';
import { readFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';

const OUT_DIR = path.join(process.cwd(), 'snapshots');

class WikiSniffer {
    constructor() {
        this.browser = null;
        this.context = null;
        this.page = null;
    }

    async initialize() {
        console.log('🚀 Launching browser...');
        this.browser = await chromium.launch({ 
            headless: false, 
            slowMo: 300 
        });
        this.context = await this.browser.newContext();
        this.page = await this.context.newPage();
        
        // Ensure output directory exists
        try {
            await access(OUT_DIR);
        } catch {
            await mkdir(OUT_DIR, { recursive: true });
            console.log(`📁 Created snapshots directory: ${OUT_DIR}`);
        }
    }

    async searchAndCapture(searchTerm) {
        console.log(`🔍 Searching for: "${searchTerm}"`);
        
        try {
            // 1. Go to Wikipedia
            await this.page.goto('https://www.wikipedia.org');
            
            // 2. Type search term into the search box
            await this.page.fill('input[name=search]', searchTerm);
            await this.page.keyboard.press('Enter');
            
            // 3. Wait and click the first result link
            await this.page.waitForSelector('#mw-content-text a', { timeout: 10000 });
            await this.page.click('#mw-content-text a');
            
            // Wait for the article page to load
            await this.page.waitForLoadState('networkidle');
            console.log(`✅ Loaded page: ${this.page.url()}`);
            
            // 4. Scroll smoothly to see more content
            console.log('📜 Scrolling down...');
            await this.page.mouse.wheel(0, 1500);
            await this.page.waitForTimeout(800);
            await this.page.mouse.wheel(0, 1500);
            await this.page.waitForTimeout(800);
            await this.page.mouse.wheel(0, 1000);
            await this.page.waitForTimeout(500);
            
            // 5. Take screenshot
            const sanitizedTerm = searchTerm.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
            const filename = `${sanitizedTerm}_${timestamp}.png`;
            const filepath = path.join(OUT_DIR, filename);
            
            await this.page.screenshot({ 
                path: filepath, 
                fullPage: true 
            });
            
            console.log(`📸 Screenshot saved: ${filename}`);
            return filepath;
            
        } catch (error) {
            console.error(`❌ Error processing "${searchTerm}":`, error.message);
            
            // Try to take a screenshot anyway for debugging
            try {
                const errorFilename = `error_${searchTerm.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
                await this.page.screenshot({ 
                    path: path.join(OUT_DIR, errorFilename), 
                    fullPage: false 
                });
                console.log(`🐛 Error screenshot saved: ${errorFilename}`);
            } catch (screenshotError) {
                console.log('📷 Could not take error screenshot');
            }
            
            return null;
        }
    }

    async processTermsFromFile(filePath) {
        try {
            console.log(`📖 Reading terms from: ${filePath}`);
            const content = await readFile(filePath, 'utf8');
            const terms = content.split('\n')
                .map(term => term.trim())
                .filter(term => term.length > 0);
            
            console.log(`Found ${terms.length} terms to process\n`);
            
            const results = [];
            
            for (let i = 0; i < terms.length; i++) {
                const term = terms[i];
                console.log(`--- Processing ${i + 1}/${terms.length}: ${term} ---`);
                
                const result = await this.searchAndCapture(term);
                results.push({ term, success: !!result, filepath: result });
                
                // Wait between searches to be respectful
                if (i < terms.length - 1) {
                    console.log('⏳ Waiting before next search...\n');
                    await this.page.waitForTimeout(2000);
                }
            }
            
            // Print summary
            console.log('\n📊 SUMMARY:');
            console.log('='.repeat(50));
            const successful = results.filter(r => r.success).length;
            console.log(`✅ Successful: ${successful}/${results.length}`);
            console.log(`❌ Failed: ${results.length - successful}/${results.length}`);
            
            if (successful > 0) {
                console.log('\n📸 Screenshots saved:');
                results
                    .filter(r => r.success)
                    .forEach(r => console.log(`  • ${path.basename(r.filepath)}`));
            }
            
            if (results.length - successful > 0) {
                console.log('\n❌ Failed terms:');
                results
                    .filter(r => !r.success)
                    .forEach(r => console.log(`  • ${r.term}`));
            }
            
            console.log('\n✨ All terms processed!');
            
        } catch (error) {
            console.error('❌ Error reading terms file:', error.message);
        }
    }

    async close() {
        if (this.browser) {
            console.log('🔚 Closing browser...');
            await this.browser.close();
        }
    }
}

// Main execution function
async function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log(`
📚 WikiSniffer - Wikipedia Search & Screenshot Tool

Usage:
  node wikisniffer.js <terms-file>
  node wikisniffer.js "search term"

Examples:
  node wikisniffer.js terms.txt
  node wikisniffer.js "artificial intelligence"

Features:
  • Automated Wikipedia search and navigation
  • Full-page screenshot capture with smooth scrolling
  • Batch processing from text files
  • Detailed progress reporting and summary
  • Error screenshots for debugging

The terms file should contain one search term per line.
Screenshots will be saved in the ./snapshots/ directory.
        `);
        return;
    }

    const sniffer = new WikiSniffer();
    
    try {
        await sniffer.initialize();
        
        const input = args[0];
        
        // Check if input is a file or a direct search term
        try {
            await access(input);
            // It's a file
            await sniffer.processTermsFromFile(input);
        } catch {
            // It's a search term
            console.log('🔍 Processing single search term...\n');
            await sniffer.searchAndCapture(input);
        }
        
    } catch (error) {
        console.error('❌ Fatal error:', error);
    } finally {
        await sniffer.close();
    }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n👋 Received interrupt signal, shutting down...');
    process.exit(0);
});

// Run the script
main().catch(console.error);