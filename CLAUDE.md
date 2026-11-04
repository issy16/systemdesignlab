# System Design Lab

Interactive system design explainers. Static site with no build step, hosted on GitHub Pages from `main`.

- Spec and decisions: `docs/SPEC.md`
- Page order, coverage and status: `X.CATALOG` in `assets/explainer.js` (the single source of truth). `docs/TOPICS.md` and `docs/CONCEPTS.md` are generated from it with `node tests/gen-docs.js`.
- Shared design system: `assets/explainer.css`. Shared helpers: `assets/explainer.js`.
- To build a new topic page, use the `new-topic-page` skill in `.claude/skills/`.

## Rules

- Every page is `<slug>/index.html`, links `../assets/explainer.css` and `../assets/explainer.js`, and follows the page standard in `docs/SPEC.md`.
- Colors come only from the CSS tokens. Never hard-code a color in page markup or CSS.
- Simulations are pure `init(seed)` / `tick(state)` / `metrics(state)` functions using `X.rnd(state)`, never `Math.random()`.
- Never insert user-typed text as HTML. Use `textContent` or `X.esc()`.
- Story world: Encore, a concert ticket app. Team: Ana (backend), Ben (payments), Cai (frontend), Dee (operations). Use they/them unless the page needs no pronouns at all.

## Checks before committing

```bash
node tests/smoke.js
```

```bash
node tests/missions.js
```

Both need Playwright (`npm install`). GitHub Actions runs both on every push and pull request.
