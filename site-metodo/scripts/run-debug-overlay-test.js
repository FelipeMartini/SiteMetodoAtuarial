const { chromium } = require('playwright');

(async () => {
  const url = 'http://localhost:3000/debug-overlay';
  console.log('Opening', url);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.on('console', (msg) => console.log('PAGE:', msg.text()));
  page.on('pageerror', (err) => console.error('PAGE ERROR:', err && err.stack ? err.stack : String(err)));
  try {
    await page.goto(url, { waitUntil: 'networkidle' });

    // click the first button with the label
    const btn = await page.waitForSelector('button:has-text("Trigger client error")', { timeout: 7000 });
    console.log('Found button, clicking...');
    await btn.click();

    // wait for a short while to let client reporter POST
    await page.waitForTimeout(3000);
    console.log('Done waiting, closing browser');
  } catch (e) {
    console.error('ERROR in script:', e);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
