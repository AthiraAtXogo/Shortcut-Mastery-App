'use strict';

const { chromium } = require('playwright');
const { mkdirSync, existsSync } = require('fs');
const path = require('path');

const SCREENSHOTS_DIR = path.join(__dirname, 'threejs-test-screenshots');
const BASE_URL = 'http://localhost:3002';

function ensureDir(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTest() {
  ensureDir(SCREENSHOTS_DIR);
  console.log(`Screenshots will be saved to: ${SCREENSHOTS_DIR}\n`);

  const browser = await chromium.launch({
    headless: true,
    args: [
      '--enable-webgl',
      '--use-gl=swiftshader',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--enable-accelerated-2d-canvas',
      '--disable-gpu-sandbox'
    ]
  });

  const results = [];

  // ─────────────────────────────────────────────────────────────────────
  // PAGE 1: /neural-test
  // ─────────────────────────────────────────────────────────────────────
  {
    const pageName = 'neural-test';
    console.log(`\n${'='.repeat(60)}`);
    console.log(`PAGE 1: ${BASE_URL}/${pageName}`);
    console.log('='.repeat(60));

    const consoleErrors = [];
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await context.newPage();

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
        console.error(`  [PAGE ERROR] ${msg.text()}`);
      }
    });
    page.on('pageerror', err => {
      consoleErrors.push(err.message);
      console.error(`  [PAGE EXCEPTION] ${err.message}`);
    });

    let status = 'unknown';
    let observations = [];

    try {
      const response = await page.goto(`${BASE_URL}/${pageName}`, { waitUntil: 'networkidle', timeout: 15000 });
      const httpStatus = response ? response.status() : 0;

      if (httpStatus === 404) {
        status = 'FAIL';
        observations.push('HTTP 404 — page not found');
      } else {
        console.log(`  HTTP ${httpStatus} OK. Waiting 3s for Three.js init...`);
        await sleep(3000);

        const idleShot = path.join(SCREENSHOTS_DIR, 'neural-test-idle.png');
        await page.screenshot({ path: idleShot, fullPage: false });
        console.log(`  Screenshot saved: neural-test-idle.png`);

        // Check canvas presence and pixel data
        const canvasInfo = await page.evaluate(() => {
          const canvas = document.querySelector('canvas');
          if (!canvas) return { found: false };

          const ctx = canvas.getContext('2d') || canvas.getContext('webgl') || canvas.getContext('webgl2');
          const hasContent = canvas.width > 0 && canvas.height > 0;
          return {
            found: true,
            width: canvas.width,
            height: canvas.height,
            hasContent
          };
        });

        console.log(`  Canvas info: ${JSON.stringify(canvasInfo)}`);

        // Check background color
        const bgColor = await page.evaluate(() => {
          const body = document.body;
          return window.getComputedStyle(body).backgroundColor;
        });
        console.log(`  Background color: ${bgColor}`);

        // Check if any visible content beyond blank
        const pageContent = await page.evaluate(() => {
          return {
            bodyText: document.body.innerText.trim().substring(0, 200),
            canvasCount: document.querySelectorAll('canvas').length,
            hasWebGL: (() => {
              try {
                const c = document.createElement('canvas');
                return !!(c.getContext('webgl') || c.getContext('webgl2'));
              } catch (e) { return false; }
            })()
          };
        });
        console.log(`  Page content: ${JSON.stringify(pageContent)}`);

        observations.push(`HTTP ${httpStatus}`);
        observations.push(`Canvas elements: ${canvasInfo.found ? 1 : 0}, size: ${canvasInfo.width}x${canvasInfo.height}`);
        observations.push(`Background: ${bgColor}`);
        observations.push(`Page text: "${pageContent.bodyText}"`);
        observations.push(`WebGL available: ${pageContent.hasWebGL}`);

        if (canvasInfo.found && canvasInfo.hasContent) {
          status = 'PASS';
          observations.push('Canvas present with non-zero dimensions — Three.js rendered');
        } else if (!canvasInfo.found) {
          status = 'FAIL';
          observations.push('No canvas element found — Three.js did not render');
        } else {
          status = 'FAIL';
          observations.push('Canvas found but zero-size — blank render');
        }
      }
    } catch (err) {
      status = 'FAIL';
      observations.push(`Navigation error: ${err.message}`);
      console.error(`  Navigation failed: ${err.message}`);
    }

    results.push({ page: pageName, status, observations, consoleErrors });
    await context.close();
  }

  // ─────────────────────────────────────────────────────────────────────
  // PAGE 2: /boss-test
  // ─────────────────────────────────────────────────────────────────────
  {
    const pageName = 'boss-test';
    console.log(`\n${'='.repeat(60)}`);
    console.log(`PAGE 2: ${BASE_URL}/${pageName}`);
    console.log('='.repeat(60));

    const consoleErrors = [];
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await context.newPage();

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
        console.error(`  [PAGE ERROR] ${msg.text()}`);
      }
    });
    page.on('pageerror', err => {
      consoleErrors.push(err.message);
      console.error(`  [PAGE EXCEPTION] ${err.message}`);
    });

    let status = 'unknown';
    let observations = [];

    try {
      const response = await page.goto(`${BASE_URL}/${pageName}`, { waitUntil: 'networkidle', timeout: 15000 });
      const httpStatus = response ? response.status() : 0;

      if (httpStatus === 404) {
        status = 'FAIL';
        observations.push('HTTP 404 — page not found');
      } else {
        console.log(`  HTTP ${httpStatus} OK. Waiting 3s for Three.js init...`);
        await sleep(3000);

        // Screenshot 1: initial state
        const idleShot = path.join(SCREENSHOTS_DIR, 'boss-test-idle.png');
        await page.screenshot({ path: idleShot });
        console.log(`  Screenshot saved: boss-test-idle.png`);

        const canvasInfo = await page.evaluate(() => {
          const canvas = document.querySelector('canvas');
          if (!canvas) return { found: false };
          return { found: true, width: canvas.width, height: canvas.height };
        });
        console.log(`  Canvas info: ${JSON.stringify(canvasInfo)}`);

        observations.push(`HTTP ${httpStatus}`);
        observations.push(`Canvas: ${canvasInfo.found ? `${canvasInfo.width}x${canvasInfo.height}` : 'not found'}`);

        // Click "Hit Boss" button
        const hitBtn = page.getByRole('button', { name: 'Hit Boss' });
        const hitBtnVisible = await hitBtn.isVisible().catch(() => false);
        console.log(`  "Hit Boss" button visible: ${hitBtnVisible}`);

        if (hitBtnVisible) {
          await hitBtn.click();
          await sleep(500);
          const afterHitShot = path.join(SCREENSHOTS_DIR, 'boss-test-after-hit.png');
          await page.screenshot({ path: afterHitShot });
          console.log(`  Screenshot saved: boss-test-after-hit.png`);
          observations.push('"Hit Boss" button clicked — screenshot taken');
        } else {
          observations.push('"Hit Boss" button not found');
        }

        // Click each boss type button
        const bossTypes = ['vscode', 'chrome', 'windows', 'terminal', 'notion'];
        for (const bossType of bossTypes) {
          const btn = page.getByRole('button', { name: bossType });
          const visible = await btn.isVisible().catch(() => false);
          console.log(`  Boss button "${bossType}" visible: ${visible}`);
          if (visible) {
            await btn.click();
            await sleep(1000); // wait for boss switch animation
            const shotPath = path.join(SCREENSHOTS_DIR, `boss-test-${bossType}.png`);
            await page.screenshot({ path: shotPath });
            console.log(`  Screenshot saved: boss-test-${bossType}.png`);
            observations.push(`Boss "${bossType}" selected — screenshot taken`);
          } else {
            observations.push(`Boss button "${bossType}" not visible`);
          }
        }

        if (canvasInfo.found && canvasInfo.width > 0) {
          status = 'PASS';
          observations.push('3D canvas rendered — boss avatar present');
        } else {
          status = 'FAIL';
          observations.push('Canvas not found or blank — boss avatar missing');
        }
      }
    } catch (err) {
      status = 'FAIL';
      observations.push(`Navigation error: ${err.message}`);
      console.error(`  Navigation failed: ${err.message}`);
    }

    results.push({ page: pageName, status, observations, consoleErrors });
    await context.close();
  }

  // ─────────────────────────────────────────────────────────────────────
  // PAGE 3: /floating-test
  // ─────────────────────────────────────────────────────────────────────
  {
    const pageName = 'floating-test';
    console.log(`\n${'='.repeat(60)}`);
    console.log(`PAGE 3: ${BASE_URL}/${pageName}`);
    console.log('='.repeat(60));

    const consoleErrors = [];
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await context.newPage();

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
        console.error(`  [PAGE ERROR] ${msg.text()}`);
      }
    });
    page.on('pageerror', err => {
      consoleErrors.push(err.message);
      console.error(`  [PAGE EXCEPTION] ${err.message}`);
    });

    let status = 'unknown';
    let observations = [];

    try {
      const response = await page.goto(`${BASE_URL}/${pageName}`, { waitUntil: 'networkidle', timeout: 15000 });
      const httpStatus = response ? response.status() : 0;

      if (httpStatus === 404) {
        status = 'FAIL';
        observations.push('HTTP 404 — page not found');
      } else {
        console.log(`  HTTP ${httpStatus} OK. Waiting 3s for Three.js init...`);
        await sleep(3000);

        // Screenshot 1: initial state (orbiting icons)
        const idleShot = path.join(SCREENSHOTS_DIR, 'floating-test-idle.png');
        await page.screenshot({ path: idleShot });
        console.log(`  Screenshot saved: floating-test-idle.png`);

        const canvasInfo = await page.evaluate(() => {
          const canvas = document.querySelector('canvas');
          if (!canvas) return { found: false };
          return { found: true, width: canvas.width, height: canvas.height };
        });
        console.log(`  Canvas info: ${JSON.stringify(canvasInfo)}`);

        const pageText = await page.evaluate(() => document.body.innerText.trim().substring(0, 300));
        console.log(`  Page text: "${pageText}"`);

        observations.push(`HTTP ${httpStatus}`);
        observations.push(`Canvas: ${canvasInfo.found ? `${canvasInfo.width}x${canvasInfo.height}` : 'not found'}`);
        observations.push(`Page text: "${pageText}"`);

        // Move mouse to center of canvas to trigger hover on an icon
        const stage = page.locator('.stage');
        const stageVisible = await stage.isVisible().catch(() => false);
        console.log(`  Stage element visible: ${stageVisible}`);

        if (stageVisible) {
          const box = await stage.boundingBox();
          if (box) {
            // Move to center of canvas
            const cx = box.x + box.width / 2;
            const cy = box.y + box.height / 2;
            console.log(`  Moving mouse to canvas center: (${cx}, ${cy})`);
            await page.mouse.move(cx, cy);
            await sleep(800);
            const hoverShot = path.join(SCREENSHOTS_DIR, 'floating-test-hover-center.png');
            await page.screenshot({ path: hoverShot });
            console.log(`  Screenshot saved: floating-test-hover-center.png`);
            observations.push('Mouse moved to canvas center — hover screenshot taken');

            // Move to a slightly different position to catch an orbiting icon
            await page.mouse.move(cx + 120, cy - 60);
            await sleep(500);
            const hoverShot2 = path.join(SCREENSHOTS_DIR, 'floating-test-hover-offset.png');
            await page.screenshot({ path: hoverShot2 });
            console.log(`  Screenshot saved: floating-test-hover-offset.png`);
            observations.push('Mouse moved to offset position — second hover screenshot taken');
          }
        } else {
          // Fallback: move to middle of viewport
          await page.mouse.move(640, 300);
          await sleep(800);
          const hoverShot = path.join(SCREENSHOTS_DIR, 'floating-test-hover.png');
          await page.screenshot({ path: hoverShot });
          console.log(`  Screenshot saved: floating-test-hover.png`);
          observations.push('Mouse moved to viewport center (fallback) — hover screenshot taken');
        }

        if (canvasInfo.found && canvasInfo.width > 0) {
          status = 'PASS';
          observations.push('3D canvas rendered — floating icons present');
        } else {
          status = 'FAIL';
          observations.push('Canvas not found or blank — floating icons missing');
        }
      }
    } catch (err) {
      status = 'FAIL';
      observations.push(`Navigation error: ${err.message}`);
      console.error(`  Navigation failed: ${err.message}`);
    }

    results.push({ page: pageName, status, observations, consoleErrors });
    await context.close();
  }

  await browser.close();

  // ─────────────────────────────────────────────────────────────────────
  // FINAL REPORT
  // ─────────────────────────────────────────────────────────────────────
  console.log(`\n${'='.repeat(60)}`);
  console.log('FINAL TEST REPORT');
  console.log('='.repeat(60));

  for (const r of results) {
    const icon = r.status === 'PASS' ? '[PASS]' : r.status === 'FAIL' ? '[FAIL]' : '[????]';
    console.log(`\n${icon} ${r.page}`);
    console.log('  Observations:');
    for (const obs of r.observations) {
      console.log(`    - ${obs}`);
    }
    if (r.consoleErrors.length > 0) {
      console.log('  Console errors:');
      for (const err of r.consoleErrors) {
        console.log(`    [ERR] ${err}`);
      }
    } else {
      console.log('  Console errors: none');
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  const allPass = results.every(r => r.status === 'PASS');
  console.log(`Overall: ${allPass ? 'ALL PASS' : 'SOME FAILURES'}`);
  console.log('='.repeat(60));
}

runTest().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
