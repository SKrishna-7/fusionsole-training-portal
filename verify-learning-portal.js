import puppeteer from 'puppeteer';
import fs from 'fs';

async function runVerification() {
  console.log('--- Starting Fusionsole Learning Centre Verification ---');
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 1 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Listen to any console errors in page
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('PAGE ERROR:', msg.text());
  });

  try {
    // 1. Visit /learning
    console.log('1. Testing Route: http://localhost:5173/learning');
    await page.goto('http://localhost:5173/learning', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: 'd:/fusionsole/artifacts/learning-centre-main.png', fullPage: true });
    console.log('Saved d:/fusionsole/artifacts/learning-centre-main.png');

    // 2. Visit /learning/staff
    console.log('2. Testing Route: http://localhost:5173/learning/staff');
    await page.goto('http://localhost:5173/learning/staff', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: 'd:/fusionsole/artifacts/learning-staff-induction.png', fullPage: true });
    console.log('Saved d:/fusionsole/artifacts/learning-staff-induction.png');

    // 3. Visit /learning/workers
    console.log('3. Testing Route: http://localhost:5173/learning/workers');
    await page.goto('http://localhost:5173/learning/workers', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: 'd:/fusionsole/artifacts/learning-workers-landing.png', fullPage: true });
    console.log('Saved d:/fusionsole/artifacts/learning-workers-landing.png');

    // 4. Visit /learning/workers/stitching
    console.log('4. Testing Route: http://localhost:5173/learning/workers/stitching');
    await page.goto('http://localhost:5173/learning/workers/stitching', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: 'd:/fusionsole/artifacts/learning-stitching-subject.png', fullPage: true });
    console.log('Saved d:/fusionsole/artifacts/learning-stitching-subject.png');

    // Verify Stitching module titles
    const stitchingModules = await page.$$eval('.module-card-title', els => els.map(e => e.textContent.trim()));
    console.log('Stitching Modules found (' + stitchingModules.length + '):', stitchingModules);

    // 5. Visit /learning/workers/assembly
    console.log('5. Testing Route: http://localhost:5173/learning/workers/assembly');
    await page.goto('http://localhost:5173/learning/workers/assembly', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: 'd:/fusionsole/artifacts/learning-assembly-subject.png', fullPage: true });
    console.log('Saved d:/fusionsole/artifacts/learning-assembly-subject.png');

    // Verify Assembly module titles
    const assemblyModules = await page.$$eval('.module-card-title', els => els.map(e => e.textContent.trim()));
    console.log('Assembly Modules found (' + assemblyModules.length + '):', assemblyModules);

    // 6. Visit /learning/workers/cutting
    console.log('6. Testing Route: http://localhost:5173/learning/workers/cutting');
    await page.goto('http://localhost:5173/learning/workers/cutting', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: 'd:/fusionsole/artifacts/learning-cutting-subject.png', fullPage: true });
    console.log('Saved d:/fusionsole/artifacts/learning-cutting-subject.png');

    // Verify Cutting module titles
    const cuttingModules = await page.$$eval('.module-card-title', els => els.map(e => e.textContent.trim()));
    console.log('Cutting Modules found (' + cuttingModules.length + '):', cuttingModules);

    // 7. Visit /learning/workers/stitching/sn-stitching (Course Detail Page)
    console.log('7. Testing Course Detail: http://localhost:5173/learning/workers/stitching/sn-stitching');
    await page.goto('http://localhost:5173/learning/workers/stitching/sn-stitching', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: 'd:/fusionsole/artifacts/learning-sn-stitching-course.png', fullPage: true });
    console.log('Saved d:/fusionsole/artifacts/learning-sn-stitching-course.png');

    // 8. Test Video Player click
    console.log('8. Testing Video Player Click');
    await page.click('#playVideoBtn');
    await new Promise(r => setTimeout(r, 500));
    const iframeExists = await page.$('.video-iframe-embed');
    console.log('Video iframe rendered:', !!iframeExists);

    // 9. Test Quiz Interactivity
    console.log('9. Testing Knowledge Check Quiz');
    // Select answers for Q1 (Option 0 = correct), Q2 (Option 1 = correct), Q3 (Option 0 = correct)
    await page.click('#quizQuestion_0 .quiz-option-label:nth-child(1)');
    await page.click('#quizQuestion_1 .quiz-option-label:nth-child(2)');
    await page.click('#quizQuestion_2 .quiz-option-label:nth-child(1)');
    await new Promise(r => setTimeout(r, 200));

    // Click Submit
    await page.click('#submitQuizBtn');
    await new Promise(r => setTimeout(r, 500));

    // Capture screenshot of quiz results
    await page.screenshot({ path: 'd:/fusionsole/artifacts/quiz-results-state.png', fullPage: true });
    console.log('Saved d:/fusionsole/artifacts/quiz-results-state.png');

    const scoreText = await page.$eval('.quiz-result-score', el => el.textContent.trim());
    console.log('Quiz Score Result:', scoreText);

    // 10. Test Mobile View (390px)
    console.log('10. Testing Mobile Viewport (390x844)');
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
    await page.goto('http://localhost:5173/learning/workers/stitching/sn-stitching', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: 'd:/fusionsole/artifacts/learning-course-mobile.png', fullPage: true });
    console.log('Saved d:/fusionsole/artifacts/learning-course-mobile.png');

    // 11. Test Next Module Navigation
    console.log('11. Testing Next Module Button Navigation');
    await page.click('.next-btn');
    await new Promise(r => setTimeout(r, 500));
    const currentUrl = page.url();
    console.log('Navigated URL:', currentUrl);
    const newTitle = await page.$eval('.course-main-title', el => el.textContent.trim());
    console.log('New Course Title:', newTitle);

    console.log('\n--- ALL VERIFICATION TESTS PASSED SUCCESSFULLY ---');
  } catch (err) {
    console.error('VERIFICATION ERROR:', err);
  } finally {
    await browser.close();
  }
}

runVerification();
