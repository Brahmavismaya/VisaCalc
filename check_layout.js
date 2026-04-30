const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 252, height: 504 });
  await page.goto('http://localhost:8080/tools/uk-spouse-visa-cost-calculator.html', { waitUntil: 'networkidle0' });

  const rects = await page.evaluate(() => {
    const getRect = (selector) => {
      const el = document.querySelector(selector);
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return { 
        width: rect.width, 
        scrollWidth: el.scrollWidth,
        text: el.innerText ? el.innerText.substring(0, 20).replace(/\n/g, ' ') : '' 
      };
    };

    return {
      html: { width: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth },
      body: getRect('body'),
      main: getRect('main'),
      toolHero: getRect('.tool-hero'),
      h1: getRect('.tool-hero h1'),
      badges: getRect('.tool-hero__badges'),
      govLink: getRect('.tool-hero__badges a'),
      toolWrap: getRect('.tool-wrap'),
      wizardCard: getRect('.wizard-card'),
      progressBar: getRect('.progress-bar'),
      radioGroup: getRect('.radio-group'),
      locOutside: getRect('label[for="loc-outside"]'),
      locInside: getRect('label[for="loc-inside"]'),
      btn: getRect('.wizard-nav .btn--primary')
    };
  });

  console.log(JSON.stringify(rects, null, 2));
  await browser.close();
})();
