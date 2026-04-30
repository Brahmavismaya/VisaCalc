const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  await page.goto('http://localhost:8080/tools/uk-spouse-visa-cost-calculator.html', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'test_screenshot.png' });
  await browser.close();
  console.log('Screenshot saved to test_screenshot.png');
})();
