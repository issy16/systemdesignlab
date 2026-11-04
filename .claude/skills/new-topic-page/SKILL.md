---
name: new-topic-page
description: Build the next System Design Lab topic page (an interactive, simulated explainer) in this repo. Use when asked to build, add or write a topic page, a page number from docs/TOPICS.md, or "the next batch" of pages.
---

# New topic page

The reader can build an app but has never run one in production. Make them **cause the failure, apply the fix, and leave with one sentence they'll never need to look up again.**

## 1. Pick and read

1. Find the page in `X.CATALOG` (`assets/explainer.js`): number, slug, title, concept ids. Names for the ids are in `docs/CONCEPTS.md`.
2. Read one finished page end to end before writing. `rate-limiting/index.html` is the cleanest reference for a time-based simulation, and `sql-injection-xss/index.html` for a sandbox with no clock.

## 2. Plan first (write it as an HTML comment at the top of the page)

1. **Stuck point:** why this concept stays fuzzy for people.
2. **Encore scenario:** who on the team hits the problem, and what breaks. Use real names, numbers and file names.
3. **The lab:** the state, the controls, and what each control changes. Make sure the failure is something the learner can trigger.
4. **The one difference:** the single switch that separates the confusing pair. This becomes a segmented control.
5. **The real artifact:** a real config, query or code snippet (8–16 lines) to map onto the lab.
6. **Missions:** 3–7 ordered steps. The first runs the healthy system, the middle ones break it, and the last ones fix it.
7. **Takeaways:** "X in one line", "The one difference", and "The tradeoff".

## 3. Build

Copy the structure of the reference page: hero → lab → (optional extra act) → real thing → recap and quiz → pager.

- Use only components from `assets/explainer.css` (`.lab`, `.controls`, `.ctl`, `.meters`, `.status`, `.missions`, `.servers`, `.tokens`, `.queue`, `.cells`, `.compare`, `.sqlbox`, `.yaml`, `.cards`, `.mcq`, `.pager`, …) and helpers from `assets/explainer.js` (`X.player`, `X.seg`, `X.missions`, `X.quiz`, `X.codeMap`, `X.lineChart`, `X.rnd`, `X.poisson`, `X.pct`, `X.pager`).
- **Simulation:** `init(seed, opts)`, `tick(state)` and `metrics(state)`, all pure apart from `X.rnd(state)`. Write the time model honestly. If capacity is involved, process events in time order (arrivals interleaved with completions), or the results depend on tick boundaries.
- **Status line:** every render writes the state in words: healthy, at risk, or broken, plus the reason.
- **Missions** check state, not clicks, so a learner who reaches the state another way still gets credit.
- **Quiz:** 3 scenario questions set in Encore, with a one- or two-sentence "why" for every option.
- **Copy:** short, active sentences. Explain each term in a few words the first time it appears. Label numbers as simulated.
- Strings inside single-quoted JS: escape apostrophes (`don\'t`).

## 4. Register and test

1. Set the page's `status` to `'built'` in `X.CATALOG`, then run `node tests/gen-docs.js`.
2. Add a flow for the page to `FLOWS` in `tests/missions.js`.
3. Translate: `python3 tools/i18n.py extract <slug>`, fill every `"zh"` in `i18n/<slug>.json` with Traditional Chinese (Taiwan usage, English term in parentheses on first use), then `python3 tools/i18n.py build`. See CLAUDE.md → Translations.
4. Run `node tests/smoke.js <slug>/index.html` and `node tests/missions.js <slug>` (and `--lang zh-tw <slug>`). If a mission doesn't complete, tune the simulation, not the test. A mission the test can't finish is one a learner can't finish either.
5. Look at the light, dark and mobile screenshots in `tests/screenshots/` once, and fix what's broken.
6. Click through the page yourself, in order, once.
