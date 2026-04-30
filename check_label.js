const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 270, height: 555 });
  await page.goto('http://localhost:8080/tools/uk-spouse-visa-cost-calculator.html', { waitUntil: 'networkidle0' });
  
  // Show step 4
  await page.evaluate(() => {
    document.getElementById('step1').style.display = 'none';
    document.getElementById('step4').style.display = 'block';
  });

  const rects = await page.evaluate(() => {
    const label = document.querySelector('label[for="pri-none"]');
    if (!label) return null;
    return {
      display: window.getComputedStyle(label).display,
      rect: label.getBoundingClientRect(),
      text: label.innerText
    };
  });

  console.log(JSON.stringify(rects, null, 2));
  await browser.close();
})();
