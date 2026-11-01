import puppeteer from 'puppeteer';
import fs from 'fs';

async function processLogo() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-web-security']
  });
  const page = await browser.newPage();
  
  const base64Data = fs.readFileSync('artifacts/logo.jpeg').toString('base64');
  const dataUri = `data:image/jpeg;base64,${base64Data}`;

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body style="margin:0; background:white;">
      <canvas id="c"></canvas>
      <script>
        const img = new Image();
        img.src = "${dataUri}";
        img.onload = () => {
          const c = document.getElementById('c');
          c.width = img.width;
          c.height = img.height;
          const ctx = c.getContext('2d');
          ctx.drawImage(img, 0, 0);
          
          const imgData = ctx.getImageData(0, 0, c.width, c.height);
          const data = imgData.data;
          let minX = c.width, minY = c.height, maxX = 0, maxY = 0;
          
          for (let y = 0; y < c.height; y++) {
            for (let x = 0; x < c.width; x++) {
              const idx = (y * c.width + x) * 4;
              const r = data[idx], g = data[idx+1], b = data[idx+2];
              if (r < 240 || g < 240 || b < 240) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
              }
            }
          }
          
          const padding = 12;
          const w = maxX - minX;
          const h = maxY - minY;
          
          // 1. Cropped tight canvas
          const cLight = document.createElement('canvas');
          cLight.width = w + padding * 2;
          cLight.height = h + padding * 2;
          const ctxLight = cLight.getContext('2d');
          
          ctxLight.drawImage(c, minX, minY, w, h, padding, padding, w, h);
          const lightData = ctxLight.getImageData(0, 0, cLight.width, cLight.height);
          for (let i = 0; i < lightData.data.length; i += 4) {
            const r = lightData.data[i], g = lightData.data[i+1], bVal = lightData.data[i+2];
            if (r > 245 && g > 245 && bVal > 245) {
              lightData.data[i+3] = 0;
            }
          }
          ctxLight.putImageData(lightData, 0, 0);
          window.lightDataUrl = cLight.toDataURL('image/png');

          // 2. Dark version (white text, preserving blue sphere)
          const cDark = document.createElement('canvas');
          cDark.width = cLight.width;
          cDark.height = cLight.height;
          const ctxDark = cDark.getContext('2d');
          const darkData = ctxDark.createImageData(cLight.width, cLight.height);
          
          for (let i = 0; i < lightData.data.length; i += 4) {
            const r = lightData.data[i], g = lightData.data[i+1], bVal = lightData.data[i+2], a = lightData.data[i+3];
            if (a === 0) {
              darkData.data[i+3] = 0;
            } else {
              const isBlue = (bVal > 110 && bVal > r + 35);
              if (isBlue) {
                darkData.data[i] = r;
                darkData.data[i+1] = g;
                darkData.data[i+2] = bVal;
                darkData.data[i+3] = a;
              } else {
                darkData.data[i] = 255;
                darkData.data[i+1] = 255;
                darkData.data[i+2] = 255;
                darkData.data[i+3] = a;
              }
            }
          }
          ctxDark.putImageData(darkData, 0, 0);
          window.darkDataUrl = cDark.toDataURL('image/png');
          window.ready = true;
        };
      </script>
    </body>
    </html>
  `);

  await page.waitForFunction(() => window.ready === true);
  const lightDataUrl = await page.evaluate(() => window.lightDataUrl);
  const darkDataUrl = await page.evaluate(() => window.darkDataUrl);

  fs.writeFileSync('public/images/fusionsole-logo.png', Buffer.from(lightDataUrl.split(',')[1], 'base64'));
  fs.writeFileSync('public/images/fusionsole-logo-dark.png', Buffer.from(darkDataUrl.split(',')[1], 'base64'));
  
  console.log('Saved fusionsole-logo.png and fusionsole-logo-dark.png successfully!');
  await browser.close();
}

processLogo();
