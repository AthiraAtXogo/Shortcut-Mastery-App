/**
 * Full E2E test suite for Three.js component pages.
 * Tests all 6 pages: neural, aurora, keyboard, explosion, portal, combo.
 */

import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCREENSHOTS_DIR = path.join(__dirname, 'e2e-screenshots');
const BASE_URL = 'http://localhost:3002';

const PAGES = [
  {
    name: 'NeuralBackground',
    slug: 'neural-test',
    description: 'animated nodes/connections on dark bg',
    interaction: {
      type: 'click-center',
      description: 'Click center of canvas',
    },
  },
  {
    name: 'AuroraTrails',
    slug: 'aurora-test',
    description: 'glowing ribbon waves',
    interaction: {
      type: 'click-center',
      description: 'Click center of canvas',
    },
  },
  {
    name: 'Keyboard3D',
    slug: 'keyboard-test',
    description: '3D keyboard layout from above',
    interaction: {
      type: 'click-center',
      description: 'Click center of canvas',
    },
  },
  {
    name: 'ExplosionShards',
    slug: 'explosion-test',
    description: 'shards burst from click point',
    interaction: {
      type: 'click-center',
      description: 'Click center to trigger explosion',
    },
  },
  {
    name: 'PortalVortex',
    slug: 'portal-test',
    description: 'torus rings + particles animate after button click',
    interaction: {
      type: 'click-button',
      buttonText: 'Trigger Portal',
      description: 'Click "Trigger Portal" button',
    },
  },
  {
    name: 'ComboChain',
    slug: 'combo-test',
    description: 'glowing lines connect after 5+ correct answers, fade on break',
    interaction: {
      type: 'combo-sequence',
      description: 'Click "Correct Answer" 5+ times then "Break Combo"',
    },
  },
];

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function ensureDir(dir) {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

async function testPage(browser, pageConfig) {
  const result = {
    name: pageConfig.name,
    slug: pageConfig.slug,
    idleDescription: '',
    afterInteractionDescription: '',
    consoleErrors: [],
    consoleWarnings: [],
    passed: false,
    failReason: '',
  };

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();

  // Collect console messages
  const consoleMessages = [];
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    consoleMessages.push({ type, text });
    if (type === 'error') {
      result.consoleErrors.push(text);
    } else if (type === 'warning' || type === 'warn') {
      result.consoleWarnings.push(text);
    }
  });

  page.on('pageerror', err => {
    result.consoleErrors.push(`[PageError] ${err.message}`);
  });

  try {
    const url = `${BASE_URL}/${pageConfig.slug}`;
    console.log(`\n--- Testing: ${pageConfig.name} (${url}) ---`);

    // Navigate
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });

    // Wait 2 seconds for Three.js to initialize
    console.log(`  Waiting 2s for Three.js initialization...`);
    await wait(2000);

    // Take idle screenshot
    const idleScreenshotPath = path.join(SCREENSHOTS_DIR, `${pageConfig.slug}-idle.png`);
    await page.screenshot({ path: idleScreenshotPath, fullPage: false });
    console.log(`  Idle screenshot saved: ${idleScreenshotPath}`);

    // Gather idle state info
    const idleInfo = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      const body = document.body;
      const allText = document.body.innerText.trim().substring(0, 300);
      const buttons = Array.from(document.querySelectorAll('button')).map(b => b.textContent.trim());
      const bgColor = window.getComputedStyle(body).backgroundColor;
      return {
        hasCanvas: !!canvas,
        canvasWidth: canvas ? canvas.width : 0,
        canvasHeight: canvas ? canvas.height : 0,
        bodyText: allText,
        buttons,
        bgColor,
        title: document.title,
      };
    });

    result.idleDescription = [
      `Canvas: ${idleInfo.hasCanvas ? `YES (${idleInfo.canvasWidth}x${idleInfo.canvasHeight})` : 'NO'}`,
      `BG color: ${idleInfo.bgColor}`,
      `Buttons: ${idleInfo.buttons.length > 0 ? idleInfo.buttons.join(', ') : 'none'}`,
      `Page text preview: "${idleInfo.bodyText.substring(0, 100)}"`,
    ].join(' | ');

    // Perform interaction
    console.log(`  Interacting: ${pageConfig.interaction.description}`);

    if (pageConfig.interaction.type === 'click-center') {
      const viewport = page.viewportSize();
      const centerX = Math.floor(viewport.width / 2);
      const centerY = Math.floor(viewport.height / 2);
      await page.mouse.click(centerX, centerY);
    } else if (pageConfig.interaction.type === 'click-button') {
      const btn = page.getByRole('button', { name: pageConfig.interaction.buttonText });
      const btnCount = await btn.count();
      if (btnCount > 0) {
        await btn.click();
      } else {
        // Try partial text match
        const anyBtn = page.locator(`button:has-text("${pageConfig.interaction.buttonText}")`);
        const anyCount = await anyBtn.count();
        if (anyCount > 0) {
          await anyBtn.first().click();
        } else {
          result.failReason = `Button "${pageConfig.interaction.buttonText}" not found`;
          console.log(`  WARNING: ${result.failReason}`);
        }
      }
    } else if (pageConfig.interaction.type === 'combo-sequence') {
      // Click "Correct Answer" 6 times
      const correctBtn = page.locator('button').filter({ hasText: /correct/i });
      const breakBtn = page.locator('button').filter({ hasText: /break/i });

      const correctCount = await correctBtn.count();
      const breakCount = await breakBtn.count();
      console.log(`  Found ${correctCount} "Correct" button(s), ${breakCount} "Break" button(s)`);

      if (correctCount > 0) {
        for (let i = 0; i < 6; i++) {
          await correctBtn.first().click();
          await wait(200);
        }
        console.log(`  Clicked "Correct Answer" 6 times`);

        // Take mid-combo screenshot
        const midPath = path.join(SCREENSHOTS_DIR, `${pageConfig.slug}-mid-combo.png`);
        await page.screenshot({ path: midPath });
        console.log(`  Mid-combo screenshot: ${midPath}`);

        if (breakCount > 0) {
          await wait(300);
          await breakBtn.first().click();
          console.log(`  Clicked "Break Combo"`);
        } else {
          console.log(`  WARNING: "Break Combo" button not found`);
        }
      } else {
        result.failReason = 'Correct Answer button not found';
        console.log(`  WARNING: ${result.failReason}`);
      }
    }

    // Wait 1 second after interaction
    await wait(1000);

    // Take post-interaction screenshot
    const afterScreenshotPath = path.join(SCREENSHOTS_DIR, `${pageConfig.slug}-after.png`);
    await page.screenshot({ path: afterScreenshotPath, fullPage: false });
    console.log(`  Post-interaction screenshot saved: ${afterScreenshotPath}`);

    // Gather post-interaction state
    const afterInfo = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      const allText = document.body.innerText.trim().substring(0, 300);
      return {
        hasCanvas: !!canvas,
        bodyText: allText,
        url: window.location.href,
      };
    });

    result.afterInteractionDescription = [
      `Canvas still present: ${afterInfo.hasCanvas ? 'YES' : 'NO'}`,
      `Page text: "${afterInfo.bodyText.substring(0, 100)}"`,
    ].join(' | ');

    // Check for Three.js / WebGL errors specifically
    const threeErrors = result.consoleErrors.filter(e =>
      /webgl|three|shader|gl_|renderer|canvas/i.test(e)
    );

    // Determine pass/fail
    const hasCanvas = idleInfo.hasCanvas;
    const hasNoPageErrors = result.consoleErrors.length === 0;
    const hasNoFailReason = !result.failReason;

    if (!hasCanvas) {
      result.failReason = result.failReason || 'No canvas element found — Three.js may not have initialized';
      result.passed = false;
    } else if (result.consoleErrors.length > 0) {
      result.failReason = result.failReason || `Console errors: ${result.consoleErrors.slice(0, 2).join('; ')}`;
      result.passed = false;
    } else {
      result.passed = hasNoFailReason;
    }

  } catch (err) {
    result.failReason = `Exception: ${err.message}`;
    result.passed = false;
    console.log(`  ERROR: ${err.message}`);
  } finally {
    await context.close();
  }

  return result;
}

async function main() {
  await ensureDir(SCREENSHOTS_DIR);

  console.log('='.repeat(60));
  console.log('Shortcut Mastery App — Full E2E Test Suite');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Screenshots: ${SCREENSHOTS_DIR}`);
  console.log('='.repeat(60));

  const browser = await chromium.launch({
    headless: true,
  });

  const results = [];

  for (const pageConfig of PAGES) {
    const result = await testPage(browser, pageConfig);
    results.push(result);
  }

  await browser.close();

  // Print report
  console.log('\n');
  console.log('='.repeat(60));
  console.log('TEST REPORT');
  console.log('='.repeat(60));

  for (const r of results) {
    const status = r.passed ? 'PASS' : 'FAIL';
    console.log(`\n[${status}] ${r.name} (/${r.slug})`);
    console.log(`  Idle:  ${r.idleDescription}`);
    console.log(`  After: ${r.afterInteractionDescription}`);
    if (r.consoleErrors.length > 0) {
      console.log(`  Console Errors (${r.consoleErrors.length}):`);
      r.consoleErrors.forEach(e => console.log(`    - ${e}`));
    } else {
      console.log(`  Console Errors: none`);
    }
    if (r.consoleWarnings.length > 0) {
      console.log(`  Console Warnings (${r.consoleWarnings.length}):`);
      r.consoleWarnings.slice(0, 3).forEach(w => console.log(`    - ${w}`));
    }
    if (!r.passed) {
      console.log(`  Fail Reason: ${r.failReason}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  console.log(`SUMMARY: ${passed} passed, ${failed} failed out of ${results.length} pages`);
  console.log('='.repeat(60));

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
