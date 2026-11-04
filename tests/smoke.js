// Smoke test for an explainer page.
// Usage: node tests/smoke.js [page.html ...]   (default: every */index.html)
// Clicks every enabled button, reports errors and horizontal overflow, saves screenshots.
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const fs = require('fs');
  const root = path.resolve(__dirname, '..');
  const files = process.argv.slice(2).length ? process.argv.slice(2).map(f => path.resolve(f))
    : [path.join(root, 'index.html'), ...fs.readdirSync(root).filter(d => fs.existsSync(path.join(root, d, 'index.html'))).map(d => path.join(root, d, 'index.html'))];
  const shots = path.join(root, 'tests', 'screenshots');
  fs.mkdirSync(shots, { recursive: true });
  const browser = await chromium.launch();
  let ok = true;
  for (const file of files) {
  const rel = path.relative(root, file);
  const outBase = path.join(shots, rel.replace(/[\\/]/g, '_').replace(/\.html?$/, ''));
  const url = 'file://' + file;
  const errors = [];
  console.log('\n== ' + rel);

  for (const [name, opts] of [
    ['light', { viewport: { width: 1100, height: 900 }, colorScheme: 'light' }],
    ['dark', { viewport: { width: 1100, height: 900 }, colorScheme: 'dark' }],
    ['mobile', { viewport: { width: 390, height: 844 }, colorScheme: 'light' }],
  ]) {
    const page = await browser.newPage(opts);
    page.on('pageerror', e => errors.push(`[${name}] ${e.message}`));
    page.on('console', m => m.type() === 'error' && errors.push(`[${name}] console: ${m.text()}`));
    await page.goto(url);

    // Click through: repeat passes so buttons revealed by earlier clicks get exercised too.
    let clicks = 0;
    for (let pass = 0; pass < 2; pass++) {
      const buttons = await page.$$('button:not([disabled]), input[type=checkbox]');
      for (const b of buttons) {
        if (!(await b.isVisible().catch(() => false))) continue;
        if (!(await b.isEnabled().catch(() => false))) continue;
        await b.click({ timeout: 2000, force: true }).catch(() => {});
        clicks++;
        await page.waitForTimeout(120);
      }
      await page.waitForTimeout(800);
    }

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 0) { ok = false; console.log(`✕ [${name}] page scrolls sideways by ${overflow}px`); }
    const shot = `${outBase}.check-${name}.png`;
    await page.screenshot({ path: shot, fullPage: true });
    console.log(`[${name}] clicked ${clicks} controls, screenshot: ${shot}`);
    await page.close();
  }

  if (errors.length) { ok = false; console.log('✕ Errors:\n  ' + [...new Set(errors)].join('\n  ')); }
  }
  console.log(ok ? '\n✓ All pages: no errors, no sideways scrolling.' : '\n✕ Fix the issues above.');
  await browser.close();
  process.exit(ok ? 0 : 1);
})();
