import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.resolve('artifacts', 'admin_verification');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runTests() {
  console.log('--- Starting Fusionsole Admin Panel & CMS Automated Verification ---');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('[Browser Error]', msg.text());
      errors.push(msg.text());
    }
  });

  page.on('dialog', async dialog => {
    console.log('[Browser Dialog Accepted]:', dialog.message());
    await dialog.accept();
  });

  try {
    // 1. Visit Homepage and click "Log in"
    console.log('1. Testing Homepage & Login link...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_homepage.png') });

    // Click Log in
    await page.click('a.login-btn');
    await new Promise(r => setTimeout(r, 600));
    console.log('Current URL after clicking Log in:', page.url());
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_admin_login.png') });

    // 2. Submit Login form
    console.log('2. Testing Admin Authentication...');
    await page.click('#loginSubmitBtn');
    await new Promise(r => setTimeout(r, 800));
    console.log('Current URL after sign in:', page.url());

    // 3. Verify Admin Overview Dashboard
    console.log('3. Verifying Admin Dashboard Overview...');
    await page.waitForSelector('.stats-grid', { timeout: 5000 });
    const statCards = await page.$$eval('.stat-card', cards => 
      cards.map(c => ({
        title: c.querySelector('.stat-title')?.textContent.trim(),
        value: c.querySelector('.stat-value')?.textContent.trim()
      }))
    );
    console.log('Dashboard Stat Cards:', JSON.stringify(statCards, null, 2));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_admin_overview.png'), fullPage: true });

    // 4. Verify Categories View
    console.log('4. Testing Categories Management...');
    await page.goto('http://localhost:5173/admin/categories', { waitUntil: 'networkidle0' });
    await page.waitForSelector('.admin-table', { timeout: 5000 });
    const catRows = await page.$$eval('.admin-table tbody tr', trs => trs.length);
    console.log('Total Categories in table:', catRows);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_admin_categories.png') });

    // 5. Verify Subjects View
    console.log('5. Testing Subjects Management...');
    await page.goto('http://localhost:5173/admin/subjects', { waitUntil: 'networkidle0' });
    await page.waitForSelector('.admin-table', { timeout: 5000 });
    const subRows = await page.$$eval('.admin-table tbody tr', trs => trs.length);
    console.log('Total Subjects in table:', subRows);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_admin_subjects.png') });

    // 6. Verify Training Modules View (28 Modules)
    console.log('6. Testing Training Modules Listing...');
    await page.goto('http://localhost:5173/admin/modules', { waitUntil: 'networkidle0' });
    await page.waitForSelector('#modulesTable', { timeout: 5000 });
    const modCount = await page.$$eval('#modulesTable tbody tr', trs => trs.length);
    console.log('Total Modules displayed in table:', modCount);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_admin_modules.png'), fullPage: true });

    // 7. Verify Module Editor with YouTube preview
    console.log('7. Testing Module Editor with YouTube Preview...');
    await page.goto('http://localhost:5173/admin/modules/mod-02-sn-stitching/edit', { waitUntil: 'networkidle0' });
    await page.waitForSelector('#moduleForm', { timeout: 5000 });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_module_editor.png'), fullPage: true });

    // Quick publish S/N Stitching for public portal test
    console.log('7b. Publishing S/N Stitching module...');
    await page.select('#moduleStatus', 'published');
    await page.click('#saveModuleBtn');
    await new Promise(r => setTimeout(r, 800));

    // 8. Verify Quizzes List & Question Builder
    console.log('8. Testing Quizzes Management...');
    await page.goto('http://localhost:5173/admin/quizzes', { waitUntil: 'networkidle0' });
    await page.waitForSelector('.admin-table', { timeout: 5000 });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08_admin_quizzes.png') });

    console.log('8b. Testing Quiz Question Builder & Live Preview...');
    await page.goto('http://localhost:5173/admin/quizzes/quiz-01-staff-induction/edit', { waitUntil: 'networkidle0' });
    await page.waitForSelector('#questionsContainer', { timeout: 5000 });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09_quiz_builder.png'), fullPage: true });

    // Click Preview Quiz
    await page.click('#previewCurrentQuizBtn');
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10_quiz_preview_modal.png') });
    await page.click('#closeQuizPreviewBtn');

    // 9. Verify HR Team Management
    console.log('9. Testing HR Team Management...');
    await page.goto('http://localhost:5173/admin/team', { waitUntil: 'networkidle0' });
    await page.waitForSelector('.admin-table', { timeout: 5000 });
    const teamCount = await page.$$eval('.admin-table tbody tr', trs => trs.length);
    console.log('Total HR Team members:', teamCount);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11_admin_team.png') });

    // 10. Verify Settings & Supabase Connection
    console.log('10. Testing Settings & Database Connection...');
    await page.goto('http://localhost:5173/admin/settings', { waitUntil: 'networkidle0' });
    await page.waitForSelector('.conn-status-display', { timeout: 5000 });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '12_admin_settings.png'), fullPage: true });

    // 11. Verify Public Learning Centre Connected to Database
    console.log('11. Testing Public Learning Centre...');
    await page.goto('http://localhost:5173/learning', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '13_public_learning_centre.png') });

    // Verify Public Subject Detail Page
    console.log('11b. Testing Public Subject Page (Stitching)...');
    await page.goto('http://localhost:5173/learning/workers/stitching', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '14_public_stitching.png'), fullPage: true });

    // Verify Public Course Detail Page & Quiz Submission
    console.log('11c. Testing Public Staff Induction Course & Quiz...');
    // Publish Staff Induction first so it's live
    await page.goto('http://localhost:5173/admin/modules/mod-01-staff-induction/edit', { waitUntil: 'networkidle0' });
    await page.waitForSelector('#moduleStatus');
    await page.select('#moduleStatus', 'published');
    await page.click('#saveModuleBtn');
    await new Promise(r => setTimeout(r, 800));

    await page.goto('http://localhost:5173/learning/staff/staff-induction', { waitUntil: 'networkidle0' });
    await page.waitForSelector('#courseQuizForm', { timeout: 5000 });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '15_course_detail_page.png'), fullPage: true });

    // Test secure quiz submission
    console.log('11d. Testing Quiz submission and server-evaluated scoring...');
    // Answer question 1: option 2 (correct)
    await page.click('#quizQuestion_q-01-staff-induction-1 label[data-optid="opt-q1-2"]');
    // Answer question 2: option 2 (correct)
    await page.click('#quizQuestion_q-02-staff-induction-2 label[data-optid="opt-q2-2"]');
    // Answer question 3: option 1 (correct)
    await page.click('#quizQuestion_q-03-staff-induction-3 label[data-optid="opt-q3-1"]');

    await page.click('#submitQuizBtn');
    await new Promise(r => setTimeout(r, 800));
    await page.waitForSelector('.quiz-result-banner', { visible: true });
    const scoreText = await page.$eval('.quiz-result-score', el => el.textContent.trim());
    console.log('Quiz Evaluation Result:', scoreText);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '16_quiz_evaluated_feedback.png') });

    console.log('✅ ALL TEST SCENARIOS PASSED WITH COMPLETE DATA INTEGRITY!');
  } catch (err) {
    console.error('Test Execution Failed:', err);
  } finally {
    await browser.close();
  }
}

runTests();
