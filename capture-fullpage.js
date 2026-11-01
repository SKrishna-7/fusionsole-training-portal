import puppeteer from 'puppeteer';

async function capture() {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: 'd:/fusionsole/artifacts/full-page-recreation.png', fullPage: true });
    await browser.close();
    console.log('SUCCESS: Full-page screenshot captured at d:/fusionsole/artifacts/full-page-recreation.png');
  } catch (err) {
    console.error('ERROR capturing screenshot:', err);
  }
}

capture();
