const puppeteer = require('puppeteer');
const path = require('path');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', defaultViewport: { width: 1280, height: 600, deviceScaleFactor: 2 } });
  const page = await browser.newPage();
  await page.goto('file://' + path.join(__dirname, 'capturas', '_terminal.html').replace(/\\/g, '/'));
  await new Promise(r => setTimeout(r, 800));
  const el = await page.$('.term');
  await el.screenshot({ path: path.join(__dirname, 'capturas', '13-docker-compose-ps.png'), omitBackground: false });
  console.log('✓ 13-docker-compose-ps');
  await browser.close();
})();
