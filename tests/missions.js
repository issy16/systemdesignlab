// End-to-end test: plays through every page's "Try this" missions like a learner would,
// then checks that all missions completed and the console stayed clean.
// Usage: node tests/missions.js [--lang zh-tw|zh-cn] [slug ...]
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const seg = (id, n) => `#${id} button:nth-child(${n})`;

// Each flow is a list of [action, arg, waitMs]. Actions: click, fill (arg = [selector, value]), wait.
const FLOWS = {
  'latency-throughput': [
    ['click', '#player .btn.primary', 3500],
    ['fill', ['#rate', '100'], 6500],
    ['click', '[data-rate="130"]', 9000],
    ['click', '#addSrv', 7000],
  ],
  'database-indexing': [
    ['click', '#player .btn.primary', 3800],
    ['click', seg('idxSeg', 2), 200], ['click', '#player .btn.primary', 1200],
    ['click', seg('sizeSeg', 1), 200], ['click', seg('idxSeg', 1), 200], ['click', '#player .btn.primary', 3800],
  ],
  'n-plus-1-pooling': [
    ['click', '#load', 2500],
    ['click', '#player .btn.primary', 3500],
    ['fill', ['#rate', '200'], 5000],
    ['click', seg('qSeg', 2), 3500],
    ['click', seg('cSeg', 2), 200], ['fill', ['#rate', '300'], 4000],
  ],
  'sql-injection-xss': [
    ['click', '#sqlPresets button:nth-child(1)', 100], ['click', '#loginBtn', 300],
    ['click', '#sqlPresets button:nth-child(2)', 100], ['click', '#loginBtn', 300],
    ['click', seg('sqlSeg', 2), 100], ['click', '#loginBtn', 300],
    ['click', '#xssPresets button:nth-child(3)', 100], ['click', '#postBtn', 300],
    ['click', seg('xssSeg', 2), 300],
  ],
  caching: [
    ['click', '#player .btn.primary', 3000],
    ['click', seg('modeSeg', 2), 3500],
    ['fill', ['#ttl', '4'], 6000],
    ['click', seg('invSeg', 2), 4500],
    ['click', seg('modeSeg', 3), 3500],
  ],
  'load-balancing-scaling': [
    ['click', '#player .btn.primary', 2500],
    ['click', '[data-rate="150"]', 3500],
    ['click', '#up', 100], ['click', '#up', 4000],
    ['click', '#kill', 600],
    ['click', '#out', 100], ['click', '#out', 100], ['click', '#out', 4000],
    ['click', '#out', 100], ['click', '#kill', 4500],
    ['click', seg('algoSeg', 2), 4000],
  ],
  'rate-limiting': [
    ['click', '#player .btn.primary', 2500],
    ['click', '#bot', 3000],
    ['click', seg('modeSeg', 2), 2500],
    ['click', seg('modeSeg', 3), 6500],
    ['click', '#burst', 2000],
  ],
  'message-queues': [
    ['click', '#player .btn.primary', 2500],
    ['click', '[data-rate="30"]', 5000],
    ['wait', null, 13000],
    ['click', seg('limSeg', 2), 3000],
    ['fill', ['#workers', '10'], 12000],
    ['click', '#poison', 5000],
    ['click', seg('dlqSeg', 2), 1000],
  ],
  'timeouts-retries-backoff': [
    ['click', '#player .btn.primary', 2500],
    ['click', seg('toSeg', 1), 100], ['click', '#hiccup', 3600],
    ['click', seg('toSeg', 2), 100], ['fill', ['#retries', '3'], 100], ['click', seg('bkSeg', 1), 100], ['click', '#hiccup', 6500],
    ['click', seg('bkSeg', 3), 100], ['wait', null, 3000], ['click', '#hiccup', 11000],
  ],
  idempotency: [
    ['click', '#pay', 1500],
    ['click', '#dbl', 1700],
    ['click', seg('netSeg', 2), 100], ['click', '#pay', 2800],
    ['click', seg('keySeg', 2), 100], ['click', seg('netSeg', 1), 100], ['click', '#dbl', 1700],
    ['click', seg('netSeg', 2), 100], ['click', '#pay', 2800],
  ],
  'circuit-breakers-health-checks': [
    ['click', '#player .btn.primary', 2500],
    ['click', seg('svcSeg', 2), 4500],
    ['click', seg('brSeg', 2), 6500],
    ['click', seg('svcSeg', 1), 7500],
  ],
  'race-conditions': [
    ['click', '#seq', 2500],
    ['click', '#inter', 2500],
    ['click', seg('modeSeg', 2), 100], ['click', '#inter', 2000],
    ['click', seg('modeSeg', 3), 100], ['click', '#inter', 2500],
    ['click', '#runT', 300],
  ],
  'locking-deadlocks': [
    ['click', '#i1', 1800],
    ['click', seg('modeSeg', 2), 100], ['click', '#i1', 2200],
    ['click', seg('modeSeg', 3), 100], ['click', '#i1', 2200],
    ['click', '#i2', 3000],
    ['click', seg('ordSeg', 2), 100], ['click', '#i2', 3000],
  ],
  'replication-failover': [
    ['click', '#player .btn.primary', 3500],
    ['fill', ['#lag', '3'], 4000],
    ['click', seg('readSeg', 2), 6000],
    ['click', '#kill', 3000],
    ['wait', null, 10000],
    ['click', seg('foSeg', 2), 100], ['click', '#kill', 4500],
    ['click', seg('syncSeg', 2), 100], ['click', '#kill', 4500],
  ],
  sharding: [
    ['click', '#add', 300],
    ['click', '#reset', 100], ['click', seg('keySeg', 2), 100], ['click', '#add', 300],
    ['click', '#rem', 300],
    ['click', seg('keySeg', 3), 300],
    ['click', seg('qSeg', 2), 200],
  ],
  'cap-theorem': [
    ['click', '#player .btn.primary', 3500],
    ['click', seg('modeSeg', 2), 100], ['click', '#cut', 4000],
    ['click', '#heal', 500],
    ['click', '#player button:nth-child(3)', 100], ['click', seg('modeSeg', 1), 100], ['click', '#cut', 4500],
  ],
  observability: [
    ['click', seg('epSeg', 1), 100], ['click', seg('epSeg', 3), 200],
    ['click', seg('toolSeg', 2), 100], ['fill', ['#q', 'slow'], 200],
    ['click', seg('toolSeg', 3), 100], ['click', '#trace button:nth-child(4)', 100], ['click', '#trace button:nth-child(5)', 200],
    ['click', seg('toolSeg', 4), 100], ['fill', ['#thr', '300'], 100], ['fill', ['#thr', '1000'], 200],
  ],
  'tls-secrets': [
    ['click', '#send', 200],
    ['click', seg('protoSeg', 2), 100], ['click', '#send', 200],
    ['click', seg('certSeg', 2), 100], ['click', '#hsStep', 100], ['click', '#hsStep', 100], ['click', '#hsStep', 200],
    ['fill', ['#grep', 'sk_'], 200],
    ['click', '#fDelete', 100], ['click', '#fRotate', 100], ['click', '#fMove', 200],
  ],
  'incident-simulator': [
    ['click', '#phases > div:nth-child(1) button:nth-child(1)', 200],
    ['click', '#phases > div:nth-child(2) button:nth-child(2)', 100], ['click', '#phases > div:nth-child(2) button:nth-child(1)', 200],
    ['click', '#phases > div:nth-child(3) button:nth-child(1)', 200],
    ['click', '#phases > div:nth-child(4) button:nth-child(2)', 200],
    ['click', '#phases > div:nth-child(5) > div > div:nth-of-type(1) button:nth-child(2)', 100],
    ['click', '#phases > div:nth-child(5) > div > div:nth-of-type(2) button:nth-child(1)', 100],
    ['click', '#phases > div:nth-child(5) > div > div:nth-of-type(2) button:nth-child(2)', 300],
  ],
  dns: [
    ['click', '#look', 2600],
    ['click', '#look', 1000],
    ['click', '#go', 300],
    ['fill', ['#ttl', '0'], 100], ['click', '#go', 300],
  ],
  'tcp-vs-udp': [
    ['click', '#player .btn.primary', 3000],
    ['fill', ['#loss', '15'], 100], ['click', '#player .btn.primary', 5000],
    ['click', seg('useSeg', 2), 100], ['click', '#player .btn.primary', 5000],
  ],
  'http2-http3': [
    ['click', '#load', 200],
    ['click', seg('protoSeg', 2), 100], ['click', '#load', 200],
    ['click', seg('lossSeg', 2), 100], ['click', '#load', 200],
    ['click', seg('protoSeg', 3), 100], ['click', '#load', 200],
  ],
};

(async () => {
  const args = process.argv.slice(2);
  const li = args.indexOf('--lang');
  const lang = li >= 0 ? args.splice(li, 2)[1] : '';
  const only = args;
  const browser = await chromium.launch();
  let ok = true;
  for (const [slug, flow] of Object.entries(FLOWS)) {
    if (only.length && !only.includes(slug)) continue;
    const page = await browser.newPage({ viewport: { width: 1100, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => m.type() === 'error' && !/fonts\.(googleapis|gstatic)/.test(m.text()) && errors.push(m.text()));
    await page.goto('file://' + path.join(root, lang, slug, 'index.html'));
    for (const [action, arg, wait] of flow) {
      if (action === 'click') await page.click(arg);
      if (action === 'fill') { await page.fill(arg[0], arg[1]); await page.dispatchEvent(arg[0], 'input'); }
      await page.waitForTimeout(wait);
    }
    const total = await page.$$eval('#missions li', l => l.length);
    const done = await page.$$eval('#missions li.done', l => l.length);
    const pass = done === total && !errors.length;
    if (!pass) ok = false;
    console.log(`${pass ? '✓' : '✕'} ${lang ? lang + '/' : ''}${slug}: ${done}/${total} missions${errors.length ? ' · errors: ' + errors.join(' | ') : ''}`);
    if (done < total) console.log('    stuck on: ' + (await page.$eval('#missions li.now', l => l.textContent.trim()).catch(() => '?')));
    await page.close();
  }
  await browser.close();
  process.exit(ok ? 0 : 1);
})();
