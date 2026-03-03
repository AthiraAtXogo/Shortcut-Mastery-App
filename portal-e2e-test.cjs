// Portal Vortex E2E Test Script (CJS)
'use strict';

const { chromium } = require('playwright');
const { mkdirSync, existsSync } = require('fs');
const path = require('path');

const SCREENSHOTS_DIR = path.join(__dirname, 'portal-screenshots');
const BASE_URL = 'http://localhost:3002/portal-test';

function ensureDir(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

async function runTest() {
  ensureDir(SCREENSHOTS_DIR);
  console.log(`Screenshots will be saved to: ${SCREENSHOTS_DIR}`);

  console.log('Launching browser...');
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--enable-webgl',
      '--use-gl=swiftshader',
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });

  const page = await context.newPage();

  // Capture console logs from the page
  page.on('console', msg => {
    const type = msg.type();
    if (type === 'error') {
      console.error(`  [PAGE ERROR] ${msg.text()}`);
    } else if (type === 'warn') {
      console.warn(`  [PAGE WARN] ${msg.text()}`);
    }
  });

  page.on('pageerror', err => {
    console.error(`  [PAGE EXCEPTION] ${err.message}`);
  });

  const results = {
    idleState: null,
    animation500ms: null,
    animation1000ms: null,
    animation1500ms: null,
    postAnimation: null,
    domAfterAnimation: null,
    errors: []
  };

  try {
    console.log(`\n=== Test 1: Navigate to ${BASE_URL} ===`);
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });
    console.log('Page loaded successfully');

    // Wait for Three.js to initialize
    await page.waitForTimeout(1200);

    console.log('\n=== Test 2: Idle State Screenshot ===');
    const idleScreenshot = path.join(SCREENSHOTS_DIR, '01-idle-state.png');
    await page.screenshot({ path: idleScreenshot, fullPage: false });
    console.log('Saved: 01-idle-state.png');

    // Analyze idle state
    const idleInfo = await page.evaluate(() => {
      const body = document.body;
      const styles = window.getComputedStyle(body);
      const canvases = document.querySelectorAll('canvas');
      const buttons = Array.from(document.querySelectorAll('button'));
      return {
        bodyBgColor: styles.backgroundColor,
        bodyBgImage: styles.backgroundImage,
        canvasCount: canvases.length,
        buttons: buttons.map(b => ({
          text: b.textContent.trim(),
          visible: b.offsetParent !== null
        })),
        pageTitle: document.title,
        h1Text: document.querySelector('h1') ? document.querySelector('h1').textContent.trim() : null,
        h2Text: document.querySelector('h2') ? document.querySelector('h2').textContent.trim() : null,
        h3Text: document.querySelector('h3') ? document.querySelector('h3').textContent.trim() : null,
      };
    });

    console.log('Idle state analysis:');
    console.log(`  Body background: ${idleInfo.bodyBgColor}`);
    console.log(`  Canvas count: ${idleInfo.canvasCount}`);
    console.log(`  Buttons found: ${JSON.stringify(idleInfo.buttons)}`);
    console.log(`  Page title: ${idleInfo.pageTitle}`);
    console.log(`  H1: ${idleInfo.h1Text}, H2: ${idleInfo.h2Text}, H3: ${idleInfo.h3Text}`);
    results.idleState = idleInfo;

    console.log('\n=== Test 3: Click "Trigger Portal" Button ===');

    // Try different selector strategies
    let triggerButton = page.getByRole('button', { name: /trigger portal/i });
    let btnFound = await triggerButton.count() > 0;

    if (!btnFound) {
      console.log('  Button not found by role/name, trying text content...');
      triggerButton = page.getByText(/trigger portal/i);
      btnFound = await triggerButton.count() > 0;
    }

    if (!btnFound) {
      console.log('  Still not found, listing all buttons:');
      const allBtns = await page.$$eval('button', btns => btns.map(b => b.textContent.trim()));
      console.log('  All buttons:', JSON.stringify(allBtns));
      triggerButton = page.locator('button').first();
    }

    await triggerButton.waitFor({ state: 'visible', timeout: 5000 });
    console.log('  Button is visible, clicking...');

    const clickTime = Date.now();
    await triggerButton.click();
    console.log(`  Clicked at t=0ms`);

    // --- 500ms screenshot ---
    const elapsed500 = Date.now() - clickTime;
    const toWait500 = Math.max(0, 500 - elapsed500);
    await page.waitForTimeout(toWait500);
    const actualTime500 = Date.now() - clickTime;

    const shot500 = path.join(SCREENSHOTS_DIR, '02-animation-500ms.png');
    await page.screenshot({ path: shot500, fullPage: false });
    console.log(`\n=== Screenshot at ~500ms (actual: ${actualTime500}ms) ===`);
    console.log('  Saved: 02-animation-500ms.png');

    // --- 1000ms screenshot ---
    const elapsed1000 = Date.now() - clickTime;
    const toWait1000 = Math.max(0, 1000 - elapsed1000);
    await page.waitForTimeout(toWait1000);
    const actualTime1000 = Date.now() - clickTime;

    const shot1000 = path.join(SCREENSHOTS_DIR, '03-animation-1000ms.png');
    await page.screenshot({ path: shot1000, fullPage: false });
    console.log(`\n=== Screenshot at ~1000ms (actual: ${actualTime1000}ms) ===`);
    console.log('  Saved: 03-animation-1000ms.png');

    // Check animation state at 1000ms
    const state1000 = await page.evaluate(() => {
      const canvases = document.querySelectorAll('canvas');
      return {
        canvasCount: canvases.length,
        canvasVisible: Array.from(canvases).map(c => ({
          visible: c.offsetParent !== null,
          opacity: window.getComputedStyle(c).opacity,
          width: c.offsetWidth,
          height: c.offsetHeight
        }))
      };
    });
    console.log(`  Canvas state at 1000ms: ${JSON.stringify(state1000)}`);

    // --- 1500ms screenshot ---
    const elapsed1500 = Date.now() - clickTime;
    const toWait1500 = Math.max(0, 1500 - elapsed1500);
    await page.waitForTimeout(toWait1500);
    const actualTime1500 = Date.now() - clickTime;

    const shot1500 = path.join(SCREENSHOTS_DIR, '04-animation-1500ms.png');
    await page.screenshot({ path: shot1500, fullPage: false });
    console.log(`\n=== Screenshot at ~1500ms (actual: ${actualTime1500}ms) ===`);
    console.log('  Saved: 04-animation-1500ms.png');

    // --- Wait for animation to fully complete ---
    console.log('\n=== Test 4: Wait for Auto-Dismiss ===');
    const elapsed = Date.now() - clickTime;
    const toWait = Math.max(0, 3500 - elapsed); // 2.7s animation + buffer
    console.log(`  Waiting ${toWait}ms more for auto-dismiss...`);
    await page.waitForTimeout(toWait);
    const totalElapsed = Date.now() - clickTime;
    console.log(`  Total elapsed since click: ${totalElapsed}ms`);

    const shot5 = path.join(SCREENSHOTS_DIR, '05-post-animation.png');
    await page.screenshot({ path: shot5, fullPage: false });
    console.log('  Saved: 05-post-animation.png');

    // Analyze post-animation state
    const postState = await page.evaluate(() => {
      const canvases = document.querySelectorAll('canvas');
      const allElements = document.querySelectorAll('[class*="portal"], [class*="overlay"], [class*="vortex"], [class*="canvas"]');
      return {
        canvasCount: canvases.length,
        canvasDetails: Array.from(canvases).map(c => ({
          display: window.getComputedStyle(c).display,
          visibility: window.getComputedStyle(c).visibility,
          opacity: window.getComputedStyle(c).opacity,
          width: c.offsetWidth,
          height: c.offsetHeight,
          id: c.id,
          className: c.className
        })),
        relatedElements: allElements.length,
        bodyBgColor: window.getComputedStyle(document.body).backgroundColor
      };
    });

    console.log('\n  Post-animation DOM state:');
    console.log(`  Canvas count: ${postState.canvasCount}`);
    console.log(`  Canvas details: ${JSON.stringify(postState.canvasDetails, null, 4)}`);
    console.log(`  Body background: ${postState.bodyBgColor}`);
    console.log(`  Related elements (overlay/portal/vortex): ${postState.relatedElements}`);
    results.postAnimation = postState;

    // ---- FINAL ANALYSIS ----
    console.log('\n=====================================');
    console.log('RESULTS SUMMARY');
    console.log('=====================================');

    const bodyBg = results.idleState.bodyBgColor;
    const isBodyDark = bodyBg && (
      bodyBg.includes('rgb(0,') ||
      bodyBg.includes('rgb(0, 0') ||
      bodyBg === 'rgb(0, 0, 0)' ||
      bodyBg.includes('rgb(1') ||
      bodyBg.includes('rgb(2') ||
      bodyBg.includes('rgb(3') ||
      bodyBg.includes('rgb(4') ||
      bodyBg.includes('rgb(5') ||
      bodyBg.includes('rgba(0,')
    );

    console.log(`\n1. Background color: ${bodyBg}`);
    console.log(`   Is dark: ${isBodyDark ? 'YES (PASS)' : 'NO - may be white (FAIL)'}`);

    const canvasAfter = postState.canvasCount;
    console.log(`\n2. Canvas after animation: ${canvasAfter}`);
    if (canvasAfter === 0) {
      console.log('   Canvas removed from DOM (dismissed): PASS');
    } else {
      const allInvisible = postState.canvasDetails.every(c =>
        c.display === 'none' || c.visibility === 'hidden' || c.opacity === '0' || c.width === 0
      );
      console.log(`   All canvas hidden: ${allInvisible ? 'YES (PASS)' : 'NO - still visible (FAIL)'}`);
    }

    console.log('\nScreenshots saved:');
    console.log(`  01-idle-state.png`);
    console.log(`  02-animation-500ms.png`);
    console.log(`  03-animation-1000ms.png`);
    console.log(`  04-animation-1500ms.png`);
    console.log(`  05-post-animation.png`);
    console.log(`\nDirectory: ${SCREENSHOTS_DIR}`);

  } catch (err) {
    console.error('\nTest error:', err.message);
    results.errors.push(err.message);
    try {
      const errShot = path.join(SCREENSHOTS_DIR, 'error-state.png');
      await page.screenshot({ path: errShot, fullPage: false });
      console.log('Error screenshot saved: error-state.png');
    } catch (e2) {
      console.error('Could not save error screenshot:', e2.message);
    }
  } finally {
    await browser.close();
    console.log('\nBrowser closed.');
  }
}

runTest().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
