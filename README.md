# System Design Lab

Learn system design by breaking a simulated concert ticket app, then fixing it.

Each page is a small in-browser simulation of **Encore**, a fictional ticket app, as it grows from one server into a production system. Push traffic, cause the failure, apply the fix, and see why it works. 56 pages are planned, covering 111 production engineering concepts. See [`docs/TOPICS.md`](docs/TOPICS.md).

**Live pages:** latency and throughput, database indexing, N+1 and connection pools, SQL injection and XSS, caching, load balancing and scaling, rate limiting, message queues, and CI/CD (partial).

## Run it locally

It's a static site with no build step. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

## Tests

```bash
npm install
npx playwright install chromium
npm test
```

`tests/smoke.js` clicks every control on every page and checks for errors and horizontal scrolling on desktop and mobile. `tests/missions.js` plays through each page's guided missions.

## Contributing a page

See [`docs/SPEC.md`](docs/SPEC.md) for the page standard and [`.claude/skills/new-topic-page/SKILL.md`](.claude/skills/new-topic-page/SKILL.md) for the step-by-step recipe.
