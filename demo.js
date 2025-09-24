import { chromium } from 'playwright';
import path from 'node:path';

const OUT_DIR = path.join(process.cwd(), 'snapshots');

async function main() {
  const browser = await chromium.launch({ headless: false, slowMo: 500 }); 
  const context = await browser.newContext();
  const page = await context.newPage();

  // 1. Go to Wikipedia
  await page.goto('https://www.wikipedia.org');

  // 2. Type “Black Holes” into the search box
  await page.fill('input[name=search]', 'Boxing');
  await page.keyboard.press('Enter');

  // 3. Wait and click the first result link
  await page.waitForSelector('#mw-content-text a');
  await page.click('#mw-content-text a');

  // 4. Scroll smoothly
  await page.mouse.wheel(0, 2000); 
  await page.waitForTimeout(1000);
  await page.mouse.wheel(0, 2000);
  await page.waitForTimeout(1000);

  // 5. Screenshot
  await page.screenshot({ path: path.join(OUT_DIR, 'info.png'), fullPage: true });
  console.log('✅ Screenshot saved in snapshots/info.png');

  await browser.close();
}

main();
