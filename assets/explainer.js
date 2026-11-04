/* System Design Lab: shared helpers for every explainer page.
   No build step. Load with <script src="../assets/explainer.js"></script> before the page script. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const X = (window.X = { reduce });

  /* ---------- UI strings (overridden by assets/i18n.<lang>.js on translated pages) ---------- */
  X.LANG = document.documentElement.dataset.lang || 'en';
  X.T = {
    play: '▶ Play', pause: '❚❚ Pause', step: 'Step', reset: '↺ Reset',
    run: 'running…', ok: '✓ passed', fail: '✕ failed', wait: '⏸ waiting',
    right: '✓ Right.', wrong: '✕ Not quite.', nailed: ' · nailed it', retry: ' · re-read the recap, then retry the lab',
    prev: '← Previous', next: 'Next →', page: n => `page ${n}`, all: 'All topics', roadmap: 'Roadmap',
  };

  /* ---------- DOM ---------- */
  X.$ = (s, r = document) => r.querySelector(s);
  X.$$ = (s, r = document) => [...r.querySelectorAll(s)];
  X.el = (tag, cls, html) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  };
  X.sleep = ms => new Promise(r => setTimeout(r, reduce ? Math.min(ms, 60) : ms));
  X.esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  X.fmt = n => Math.round(n).toLocaleString('en-US');

  /* ---------- seeded randomness (state lives in the sim state as s.r) ---------- */
  X.rnd = s => {
    let t = (s.r = (s.r + 0x6d2b79f5) | 0);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  X.poisson = (s, lambda) => {
    if (lambda <= 0) return 0;
    if (lambda > 30) return Math.max(0, Math.round(lambda + Math.sqrt(lambda) * (X.rnd(s) + X.rnd(s) + X.rnd(s) - 1.5) * 2));
    const L = Math.exp(-lambda);
    let k = 0, p = 1;
    do { k++; p *= X.rnd(s); } while (p > L);
    return k - 1;
  };
  X.expo = (s, mean) => -Math.log(1 - X.rnd(s)) * mean;
  X.pct = (arr, p) => {
    if (!arr.length) return 0;
    const a = [...arr].sort((x, y) => x - y);
    return a[Math.min(a.length - 1, Math.ceil(p * a.length) - 1)];
  };
  X.avg = arr => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

  /* ---------- Play / Pause / Step / Reset ---------- */
  X.player = (root, o) => {
    const wrap = X.el('div', 'player');
    const mk = (t, cls) => { const b = X.el('button', 'btn sm ' + (cls || ''), t); b.type = 'button'; return b; };
    const play = mk(X.T.play, 'primary'), step = mk(X.T.step), reset = mk(X.T.reset);
    play.setAttribute('aria-pressed', 'false');
    const clock = X.el('span', 'clock', '');
    let timer = null;
    const set = on => {
      if (on && !timer) {
        timer = setInterval(() => o.step(), o.ms || 100);
        play.textContent = X.T.pause; play.setAttribute('aria-pressed', 'true');
      } else if (!on && timer) {
        clearInterval(timer); timer = null;
        play.textContent = X.T.play; play.setAttribute('aria-pressed', 'false');
      }
    };
    play.onclick = () => set(!timer);
    step.onclick = () => { set(false); for (let i = 0; i < (o.stepTicks || 1); i++) o.step(); };
    reset.onclick = () => { set(false); o.reset(); };
    wrap.append(play, step, reset, clock);
    root.append(wrap);
    return { play: () => set(true), pause: () => set(false), get running() { return !!timer; }, clock: t => (clock.textContent = t) };
  };

  /* ---------- pipeline chips with a text state ---------- */
  X.chip = (chip, state, text) => {
    chip.classList.remove('run', 'ok', 'fail', 'wait');
    if (state) chip.classList.add(state);
    let st = chip.querySelector('.st');
    if (!st) { st = X.el('span', 'st'); chip.append(st); }
    st.textContent = text != null ? text : state ? X.T[state] : '';
  };

  /* ---------- segmented control: X.seg(el, ['a','b'], onChange, initial) ---------- */
  X.seg = (root, opts, onChange, initial = 0) => {
    root.classList.add('seg');
    root.setAttribute('role', 'group');
    const btns = opts.map((o, i) => {
      const b = X.el('button', '', typeof o === 'string' ? o : o.label);
      b.type = 'button';
      b.setAttribute('aria-pressed', i === initial ? 'true' : 'false');
      b.onclick = () => { btns.forEach(x => x.setAttribute('aria-pressed', x === b ? 'true' : 'false')); onChange(i, b); };
      root.append(b);
      return b;
    });
    return { set: i => btns[i].click(), get value() { return btns.findIndex(b => b.getAttribute('aria-pressed') === 'true'); } };
  };

  /* ---------- missions: guided steps that tick themselves off ---------- */
  X.missions = (root, list) => {
    const items = list.map(m => {
      const li = X.el('li', '', `<span>${m.text}${m.hint ? `<span class="hint">${m.hint}</span>` : ''}</span>`);
      root.append(li);
      return { li, done: false, check: m.check, then: m.then };
    });
    const mark = () => {
      let first = true;
      items.forEach(it => {
        it.li.classList.toggle('done', it.done);
        it.li.classList.toggle('now', !it.done && first);
        if (!it.done) first = false;
      });
    };
    mark();
    return {
      update(state) {
        let changed = false;
        for (const it of items) {
          if (!it.done) {
            if (it.check(state)) { it.done = true; changed = true; it.then && it.then(); }
            break; // missions unlock in order
          }
        }
        if (changed) mark();
      },
      reset() { items.forEach(it => (it.done = false)); mark(); },
    };
  };

  /* ---------- multiple-choice scenario quiz ---------- */
  // Q = [{ q, opts: [[text, isCorrect, why], ...] }]
  X.quiz = (root, Q, scoreEl) => {
    let answered = 0, right = 0;
    Q.forEach(({ q, opts }) => {
      const li = X.el('li');
      li.append(X.el('div', 'q', q));
      const box = X.el('div', 'opts');
      const why = X.el('div', 'why');
      why.hidden = true;
      opts.forEach(([t, ok, w]) => {
        const b = X.el('button', 'opt', t);
        b.type = 'button';
        b.onclick = () => {
          box.querySelectorAll('button').forEach(x => (x.disabled = true));
          b.classList.add(ok ? 'right' : 'wrong');
          if (!ok) box.querySelectorAll('button').forEach((x, i) => opts[i][1] && x.classList.add('right'));
          why.innerHTML = `<b>${ok ? X.T.right : X.T.wrong}</b> ${w}`;
          why.hidden = false;
          answered++; if (ok) right++;
          if (scoreEl) scoreEl.textContent = `· ${right}/${answered}` + (answered === Q.length ? (right === Q.length ? X.T.nailed : X.T.retry) : '');
        };
        box.append(b);
      });
      li.append(box, why);
      root.append(li);
    });
  };

  /* ---------- code ↔ explanation map ---------- */
  // lines = [[html, key|null]], EX = {key: [title, html]}, chipsRoot optional (.chip[data-s=key])
  X.codeMap = (pre, lines, EX, titleEl, bodyEl, chipsRoot) => {
    const chips = chipsRoot ? X.$$('.chip[data-s]', chipsRoot) : [];
    const pick = k => {
      X.$$('.ln', pre).forEach(l => l.classList.toggle('active', l.dataset.k === k));
      chips.forEach(c => c.classList.toggle('hl', c.dataset.s === k));
      titleEl.textContent = EX[k][0];
      bodyEl.innerHTML = EX[k][1];
    };
    lines.forEach(([h, k]) => {
      const s = X.el('span', 'ln', h || ' ');
      if (k) {
        s.dataset.k = k; s.tabIndex = 0; s.setAttribute('role', 'button');
        s.addEventListener('mouseenter', () => pick(k));
        s.addEventListener('focus', () => pick(k));
        s.addEventListener('click', () => pick(k));
      }
      pre.append(s);
    });
    chips.forEach(c => EX[c.dataset.s] && (c.style.cursor = 'pointer', c.addEventListener('click', () => pick(c.dataset.s))));
    return pick;
  };

  /* ---------- tiny line chart drawn with theme tokens ---------- */
  // series = [{ data:[numbers], token:'--accent', dash:false }]
  X.lineChart = (canvas, series, opts = {}) => {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (canvas.width !== w * dpr) { canvas.width = w * dpr; canvas.height = h * dpr; }
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const css = getComputedStyle(document.documentElement);
    const tok = t => css.getPropertyValue(t).trim();
    const n = opts.points || Math.max(...series.map(s => s.data.length), 2);
    let max = opts.max || Math.max(1, ...series.flatMap(s => s.data));
    if (opts.niceMax) { const p = Math.pow(10, Math.floor(Math.log10(max))); max = Math.ceil(max / p) * p; }
    const L = 44, R = 8, T = 10, B = 18;
    ctx.font = '11px "IBM Plex Mono", monospace';
    ctx.strokeStyle = tok('--grid'); ctx.fillStyle = tok('--muted'); ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = T + (h - T - B) * (i / 4);
      ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(w - R, y); ctx.stroke();
      ctx.fillText(X.fmt(max * (1 - i / 4)) + (opts.unit || ''), 2, y + 4);
    }
    if (opts.xLabel) ctx.fillText(opts.xLabel, L, h - 4);
    if (opts.limit != null) {
      const y = T + (h - T - B) * (1 - Math.min(opts.limit, max) / max);
      ctx.setLineDash([4, 4]); ctx.strokeStyle = tok('--muted');
      ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(w - R, y); ctx.stroke(); ctx.setLineDash([]);
    }
    series.forEach(s => {
      ctx.strokeStyle = tok(s.token); ctx.lineWidth = 2.5;
      ctx.setLineDash(s.dash ? [6, 4] : []);
      ctx.beginPath();
      s.data.forEach((v, i) => {
        const x = L + (w - L - R) * (i / (n - 1));
        const y = T + (h - T - B) * (1 - Math.min(v, max) / max);
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      });
      ctx.stroke();
      ctx.setLineDash([]);
    });
  };

  /* ---------- the 111 concepts (ids match docs/CONCEPTS.md) ---------- */
  X.CONCEPTS = [null, "Rate Limiting", "Caching", "Load Balancing", "Reverse Proxies", "API Gateways", "CI/CD", "Docker", "Kubernetes", "Service Discovery", "Circuit Breakers", "Timeouts", "Retries", "Exponential Backoff", "Idempotency", "Message Queues", "Pub/Sub", "Event-Driven Architecture", "Distributed Transactions", "Saga Pattern", "Dead Letter Queues", "Cron Jobs", "WebSockets", "Long Polling", "Server-Sent Events", "Database Indexing", "Query Optimization", "N+1 Queries", "Connection Pooling", "Read Replicas", "Sharding", "Partitioning", "Replication", "Leader Election", "CAP Theorem", "Eventual Consistency", "Optimistic Locking", "Pessimistic Locking", "Distributed Locks", "Race Conditions", "Deadlocks", "Memory Leaks", "Garbage Collection", "Thread Safety", "Backpressure", "Autoscaling", "Horizontal Scaling", "Vertical Scaling", "CDN", "Edge Caching", "Cache Invalidation", "Feature Flags", "Blue-Green Deployment", "Canary Releases", "Rolling Deployments", "Rollbacks", "Health Checks", "Liveness & Readiness Probes", "Monitoring", "Logging", "Distributed Tracing", "Metrics", "Alerts", "SLOs", "SLIs", "Error Budgets", "Observability", "Secrets Management", "IAM", "OAuth", "JWT Rotation", "TLS", "Encryption at Rest", "Encryption in Transit", "WAF", "DDoS Protection", "CORS", "CSRF", "SQL Injection", "XSS", "SSRF", "Database Migrations", "Schema Versioning", "Disaster Recovery", "Backups", "Failover", "Multi-Region Deployment", "Chaos Engineering", "Cost Optimization", "Cold Starts", "Serverless Limits", "Latency", "Throughput", "P99 Latency", "Tail Latency", "Network Partitions", "Clock Skew", "DNS", "TCP vs UDP", "HTTP/2 & HTTP/3", "gRPC", "Webhooks", "API Versioning", "Semantic Versioning", "Infrastructure as Code", "Terraform", "Helm Charts", "Build Caching", "Dependency Hell", "Production Incidents", "On-Call", "Postmortems"];

  /* ---------- catalog: the single source of truth for page order, coverage and status ---------- */
  // status: 'built' | 'partial' | 'planned'. ids refer to docs/CONCEPTS.md (the 111-item list).
  X.STAGES = [
    { n: 1, name: 'Make one server work well' },
    { n: 2, name: 'Handle more traffic' },
    { n: 3, name: 'Survive failures' },
    { n: 4, name: 'Keep data correct' },
    { n: 5, name: 'Ship and operate it' },
    { n: 6, name: 'Talk to the world' },
    { n: 7, name: 'Architecture patterns' },
    { n: 8, name: 'Runtime and cost' },
    { n: 9, name: 'Build and infrastructure' },
    { n: 10, name: 'Security, part 2' },
    { n: 11, name: 'Reliability practice' },
  ];
  X.CATALOG = [
    [1, 1, 'latency-throughput', 'Latency and throughput', [91, 92, 93, 94], 'built'],
    [2, 1, 'database-indexing', 'Database indexing', [25, 26], 'built'],
    [3, 1, 'n-plus-1-pooling', 'N+1 queries and connection pooling', [27, 28], 'built'],
    [4, 1, 'sql-injection-xss', 'SQL injection and XSS', [78, 79], 'built'],
    [5, 2, 'caching', 'Caching', [2, 49, 50], 'built'],
    [6, 2, 'load-balancing-scaling', 'Load balancing and scaling', [3, 46, 47], 'built'],
    [7, 2, 'rate-limiting', 'Rate limiting', [1], 'built'],
    [8, 2, 'message-queues', 'Message queues', [15, 20, 44], 'built'],
    [9, 3, 'timeouts-retries-backoff', 'Timeouts, retries and backoff', [11, 12, 13], 'planned'],
    [10, 3, 'idempotency', 'Idempotency', [14], 'planned'],
    [11, 3, 'circuit-breakers-health-checks', 'Circuit breakers and health checks', [10, 56, 57], 'planned'],
    [12, 4, 'race-conditions', 'Race conditions', [39, 43], 'planned'],
    [13, 4, 'locking-deadlocks', 'Locking and deadlocks', [36, 37, 40], 'planned'],
    [14, 4, 'replication-failover', 'Replication and failover', [29, 32, 35, 85], 'planned'],
    [15, 4, 'sharding', 'Sharding and partitioning', [30, 31], 'planned'],
    [16, 4, 'cap-theorem', 'CAP theorem', [34, 95], 'planned'],
    [17, 5, 'ci-cd', 'CI/CD and safe deployments', [6, 51, 52, 53, 54, 55], 'partial'],
    [18, 5, 'observability', 'Observability', [58, 59, 60, 61, 62, 66], 'planned'],
    [19, 5, 'tls-secrets', 'TLS and secrets', [67, 71, 73], 'planned'],
    [20, 5, 'incident-simulator', 'Final incident simulator', [83, 84, 109, 111], 'planned'],
    [21, 6, 'dns', 'DNS', [97], 'planned'],
    [22, 6, 'tcp-vs-udp', 'TCP vs UDP', [98], 'planned'],
    [23, 6, 'http2-http3', 'HTTP/2 and HTTP/3', [99], 'planned'],
    [24, 6, 'realtime', 'WebSockets, long polling and SSE', [22, 23, 24], 'planned'],
    [25, 6, 'grpc', 'gRPC', [100], 'planned'],
    [26, 6, 'webhooks', 'Webhooks', [101], 'planned'],
    [27, 6, 'api-versioning', 'API versioning and semver', [102, 103], 'planned'],
    [28, 6, 'proxies-gateways', 'Reverse proxies and API gateways', [4, 5], 'planned'],
    [29, 6, 'cdn', 'CDN', [48], 'planned'],
    [30, 7, 'pub-sub-events', 'Pub/sub and event-driven design', [16, 17], 'planned'],
    [31, 7, 'sagas', 'Distributed transactions and sagas', [18, 19], 'planned'],
    [32, 7, 'cron-jobs', 'Cron jobs', [21], 'planned'],
    [33, 7, 'leader-election-locks', 'Leader election and distributed locks', [33, 38], 'planned'],
    [34, 7, 'clock-skew', 'Clock skew', [96], 'planned'],
    [35, 7, 'multi-region', 'Multi-region deployment', [86], 'planned'],
    [36, 8, 'memory-leaks-gc', 'Memory leaks and garbage collection', [41, 42], 'planned'],
    [37, 8, 'autoscaling', 'Autoscaling', [45], 'planned'],
    [38, 8, 'serverless', 'Cold starts and serverless limits', [89, 90], 'planned'],
    [39, 8, 'cost-optimization', 'Cost optimization', [88], 'planned'],
    [40, 9, 'docker', 'Docker', [7], 'planned'],
    [41, 9, 'kubernetes', 'Kubernetes, service discovery and Helm', [8, 9, 106], 'planned'],
    [42, 9, 'infrastructure-as-code', 'Infrastructure as code and Terraform', [104, 105], 'planned'],
    [43, 9, 'build-caching', 'Build caching', [107], 'planned'],
    [44, 9, 'dependency-hell', 'Dependency hell', [108], 'planned'],
    [45, 9, 'migrations', 'Database migrations and schema versioning', [81, 82], 'planned'],
    [46, 10, 'iam', 'IAM', [68], 'planned'],
    [47, 10, 'oauth', 'OAuth', [69], 'planned'],
    [48, 10, 'jwt-rotation', 'JWT rotation', [70], 'planned'],
    [49, 10, 'encryption-at-rest', 'Encryption at rest', [72], 'planned'],
    [50, 10, 'waf-ddos', 'WAF and DDoS protection', [74, 75], 'planned'],
    [51, 10, 'cors', 'CORS', [76], 'planned'],
    [52, 10, 'csrf', 'CSRF', [77], 'planned'],
    [53, 10, 'ssrf', 'SSRF', [80], 'planned'],
    [54, 11, 'slos', 'SLIs, SLOs and error budgets', [63, 64, 65], 'planned'],
    [55, 11, 'chaos-engineering', 'Chaos engineering', [87], 'planned'],
    [56, 11, 'on-call', 'On-call', [110], 'planned'],
  ].map(([n, stage, slug, title, ids, status]) => ({ n, stage, slug, title, ids, status }));

  /* ---------- footer: previous / next / all topics ---------- */
  X.pager = (root, slug) => {
    const live = X.CATALOG.filter(p => p.status !== 'planned');
    const i = live.findIndex(p => p.slug === slug);
    const link = (p, cls, label) => p
      ? `<a class="${cls}" href="../${p.slug}/"><small>${label} · ${X.T.page(p.n)}</small>${p.title}</a>`
      : '';
    root.innerHTML =
      link(live[i - 1], 'pv', X.T.prev) +
      `<a href="../"><small>${X.T.all}</small>${X.T.roadmap}</a>` +
      link(live[i + 1], 'nx', X.T.next);
  };

  /* ---------- language switcher: EN / 繁 / 简 in the top bar ---------- */
  X.langSwitch = () => {
    const bar = document.querySelector('.topbar-inner');
    if (!bar || bar.querySelector('.langs')) return;
    const parts = location.pathname.split('/').filter(Boolean);
    if (parts[parts.length - 1] === 'index.html') parts.pop();
    const last = parts[parts.length - 1] || '';
    const slug = X.CATALOG.some(p => p.slug === last) ? last : '';
    const depth = (X.LANG === 'en' ? 0 : 1) + (slug ? 1 : 0);
    const up = '../'.repeat(depth);
    const nav = X.el('nav', 'acts langs');
    nav.setAttribute('aria-label', 'Language');
    [['en', 'EN', 'English'], ['zh-tw', '繁', '繁體中文'], ['zh-cn', '简', '简体中文']].forEach(([code, label, name]) => {
      const a = X.el('a', '', label);
      a.href = up + (code === 'en' ? '' : code + '/') + (slug ? slug + '/' : '');
      a.lang = code === 'en' ? 'en' : code === 'zh-tw' ? 'zh-Hant' : 'zh-Hans';
      a.title = name;
      if (code === X.LANG) a.setAttribute('aria-current', 'true');
      nav.append(a);
    });
    bar.append(nav);
  };
  X.langSwitch();
})();
