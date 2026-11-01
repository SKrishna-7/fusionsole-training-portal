import puppeteer from 'puppeteer';

async function testMobile() {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      defaultViewport: { width: 390, height: 844, isMobile: true, hasTouch: true },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'd:/fusionsole/artifacts/mobile-preview.png', fullPage: true });
    await browser.close();
    console.log('SUCCESS: Mobile screenshot captured at d:/fusionsole/artifacts/mobile-preview.png');
  } catch (err) {
    console.error('ERROR capturing mobile screenshot:', err);
  }
}

testMobile();
