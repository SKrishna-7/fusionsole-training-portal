import puppeteer from 'puppeteer';
import path from 'path';

async function testMobile() {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 }); // iPhone 14

  await page.goto('http://localhost:5173/admin', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.resolve('artifacts', 'admin_verification', '17_mobile_admin_closed.png') });

  // Open sidebar
  await page.click('#openSidebarBtn');
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.resolve('artifacts', 'admin_verification', '18_mobile_admin_sidebar_open.png') });

  await browser.close();
  console.log('Mobile screenshots captured successfully.');
}

testMobile();
