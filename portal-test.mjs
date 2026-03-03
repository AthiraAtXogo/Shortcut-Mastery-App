// Portal Vortex E2E Test Script
// Run with: node portal-test.mjs

import { chromium } from '/c/Users/athir/AppData/Roaming/npm/node_modules/playwright/index.mjs';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';

const SCREENSHOTS_DIR = './portal-screenshots';
const BASE_URL = 'http://localhost:3002/portal-test';

async function ensureDir(dir) {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

async function runTest() {
  await ensureDir(SCREENSHOTS_DIR);

  console.log('Launching browser...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--enable-webgl', '--use-gl=swiftshader', '--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });

  const page = await context.newPage();

  // Capture console logs from the page
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error(`[PAGE ERROR] ${msg.text()}`);
    } else {
      console.log(`[PAGE LOG] ${msg.text()}`);
    }
  });

  page.on('pageerror', err => {
    console.error(`[PAGE EXCEPTION] ${err.message}`);
  });

  try {
    console.log(`\n--- Test 1: Navigate to ${BASE_URL} ---`);
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 15000 });
    console.log('Page loaded');

    // Wait a bit for Three.js to initialize
    await page.waitForTimeout(1000);

    console.log('\n--- Test 2: Screenshot idle state ---');
    await page.screenshot({
      path: `${SCREENSHOTS_DIR}/01-idle-state.png`,
      fullPage: false
    });
    console.log('Screenshot saved: 01-idle-state.png');

    // Check background color
    const bgColor = await page.evaluate(() => {
      const body = document.body;
      return window.getComputedStyle(body).backgroundColor;
    });
    console.log(`Body background color: ${bgColor}`);

    // Check if canvas is present
    const canvasCount = await page.locator('canvas').count();
    console.log(`Canvas elements found: ${canvasCount}`);

    // Check for the trigger button
    const buttonText = await page.locator('button').first().textContent().catch(() => 'NOT FOUND');
    console.log(`Button text: ${buttonText}`);

    console.log('\n--- Test 3: Click "Trigger Portal" button ---');
    const triggerButton = page.getByRole('button', { name: /trigger portal/i });
    await triggerButton.waitFor({ state: 'visible', timeout: 5000 });
    console.log('Button found, clicking...');

    const clickTime = Date.now();
    await triggerButton.click();
    console.log('Button clicked!');

    // Take screenshot at ~500ms
    const wait500 = Math.max(0, 500 - (Date.now() - clickTime));
    await page.waitForTimeout(wait500);
    await page.screenshot({
      path: `${SCREENSHOTS_DIR}/02-animation-500ms.png`,
      fullPage: false
    });
    console.log(`Screenshot at ~500ms saved: 02-animation-500ms.png`);

    // Take screenshot at ~1000ms
    const wait1000 = Math.max(0, 1000 - (Date.now() - clickTime));
    await page.waitForTimeout(wait1000);
    await page.screenshot({
      path: `${SCREENSHOTS_DIR}/03-animation-1000ms.png`,
      fullPage: false
    });
    console.log(`Screenshot at ~1000ms saved: 03-animation-1000ms.png`);

    // Take screenshot at ~1500ms
    const wait1500 = Math.max(0, 1500 - (Date.now() - clickTime));
    await page.waitForTimeout(wait1500);
    await page.screenshot({
      path: `${SCREENSHOTS_DIR}/04-animation-1500ms.png`,
      fullPage: false
    });
    console.log(`Screenshot at ~1500ms saved: 04-animation-1500ms.png`);

    // Sample pixel data during animation to check for white flash
    const pixelCheck = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return { error: 'No canvas found' };
      try {
        const ctx = canvas.getContext('2d');
        if (!ctx) return { error: 'Cannot get 2D context (WebGL canvas)' };
        // For WebGL canvas we can't easily read pixels this way
        return { info: 'WebGL canvas - pixel data not directly accessible via 2D context' };
      } catch (e) {
        return { error: e.message };
      }
    });
    console.log('Canvas pixel check:', JSON.stringify(pixelCheck));

    console.log('\n--- Test 4: Wait for animation to complete (~3 seconds total) ---');
    const waitRemaining = Math.max(0, 3000 - (Date.now() - clickTime));
    console.log(`Waiting ${waitRemaining}ms more for animation to complete...`);
    await page.waitForTimeout(waitRemaining + 500); // extra 500ms buffer

    await page.screenshot({
      path: `${SCREENSHOTS_DIR}/05-post-animation.png`,
      fullPage: false
    });
    console.log('Screenshot saved: 05-post-animation.png');

    // Check if canvas overlay is gone
    const canvasVisible = await page.locator('canvas').isVisible().catch(() => false);
    console.log(`Canvas still visible after animation: ${canvasVisible}`);

    // Check DOM state
    const domInfo = await page.evaluate(() => {
      const canvases = document.querySelectorAll('canvas');
      const overlays = document.querySelectorAll('[class*="portal"], [class*="overlay"], [class*="vortex"]');
      return {
        canvasCount: canvases.length,
        canvasVisible: Array.from(canvases).map(c => ({
          display: window.getComputedStyle(c).display,
          visibility: window.getComputedStyle(c).visibility,
          opacity: window.getComputedStyle(c).opacity,
          width: c.width,
          height: c.height,
          classes: c.className
        })),
        overlayCount: overlays.length
      };
    });
    console.log('DOM state after animation:', JSON.stringify(domInfo, null, 2));

    console.log('\n--- Summary ---');
    console.log(`All screenshots saved to: ${SCREENSHOTS_DIR}/`);
    console.log('Screenshots taken:');
    console.log('  01-idle-state.png       - Page before any interaction');
    console.log('  02-animation-500ms.png  - Animation at ~500ms');
    console.log('  03-animation-1000ms.png - Animation at ~1000ms');
    console.log('  04-animation-1500ms.png - Animation at ~1500ms');
    console.log('  05-post-animation.png   - After animation completes');

  } catch (err) {
    console.error('Test failed:', err.message);
    await page.screenshot({
      path: `${SCREENSHOTS_DIR}/error-state.png`,
      fullPage: false
    });
    console.log('Error screenshot saved: error-state.png');
  } finally {
    await browser.close();
    console.log('\nBrowser closed. Test complete.');
  }
}

runTest().catch(console.error);
