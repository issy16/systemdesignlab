# System Design Lab: Project Spec

Nov 4, 2026 · Issy · v2 (revised after the Milestone 0 audit)

## Overview

An interactive site that teaches system design by letting learners see a problem, break a simulated system, and apply the fix. Every page is set in one fictional product, **Encore**, a concert ticket app, run by the same four people: Ana (backend), Ben (payments), Cai (frontend) and Dee (operations).

**Audience:** developers and vibe coders who can build an app but have limited production engineering experience.

**Goals**

- Cover all 111 concepts in `docs/CONCEPTS.md`, each taught on exactly one page.
- Teach through interaction, not long explanations.
- Make every page feel like part of one product by sharing one design system and one helper library.

**Non-goals**

- Real infrastructure, real attacks, or real backend services. Every demo is a client-side simulation.
- A full computer science curriculum (data structures, algorithms, compilers).
- User accounts or server-side progress tracking.

## Decisions (changed from v1)

| Topic | v1 | v2 | Why |
| --- | --- | --- | --- |
| Scope | 20 pages, "21 concepts rated 5" | **56 standalone pages** covering all 111 concepts | v1's table already referenced 58 ids, and the 21 couldn't be identified. Related concepts are grouped wherever comparing them is the lesson (for example, optimistic vs pessimistic locking). |
| Page model | Pages depend on a shared course flow | **Every page stands alone** and links to previous, next and the roadmap | People share and search for single topics. The 20-page course order survives as stages 1–5. |
| Stack | "Keep the existing stack" plus TypeScript, lint and type checks | **Static HTML, CSS and JS with no build step**, plus shared `assets/explainer.css` and `assets/explainer.js` | The existing CI/CD page had no stack. This keeps it simple, and the theme still lives in one place. |
| Tests | Unit tests, end-to-end tests, lint, types | **Browser smoke test + mission walkthrough** on every push (`tests/`) | Matches a build-free stack. Unit tests for the simulation functions are a follow-up (see Known gaps). |
| Hosting | Unknown | **GitHub Pages** from `main`, repo `issy16/systemdesignlab` | Free, static, and deploys on push. |
| Languages | English only | **English, 繁體中文 (`/zh-tw/`), 简体中文 (`/zh-cn/`)**, generated from the English page plus a translation file | One copy of the simulation code. Simplified is converted from Traditional with OpenCC (Taiwan → mainland vocabulary). |

## Baseline (audit results)

- **CI/CD page:** `ci-cd/index.html`. The original standalone page, kept as is apart from the brand link. It has its own inline copy of the styles.
- **Style template:** `assets/explainer.css`, extracted from the CI/CD page without visual changes, plus series components.
- **Shared helpers:** `assets/explainer.js` (DOM helpers, seeded random numbers, Play/Pause/Step/Reset player, missions, quiz, code-to-explanation map, line chart, pager, and the catalog).
- **Routing:** one folder per topic with an `index.html`. The roadmap is `/index.html`.
- **Animation:** CSS keyframes plus `X.sleep()` sequences and interval-driven simulations. Respects `prefers-reduced-motion`.
- **CI/CD page coverage:** concept 6 (CI/CD) only. Concepts 51–55 (feature flags, blue-green, canary, rolling deploys, rollbacks) are **not** on it yet, so it's marked `partial`.

## Page standard

Every topic page uses the same building blocks, in this order:

1. **Hero:** eyebrow (the concepts), headline, and a one- or two-sentence Encore **scenario**. The first interaction is one click away.
2. **Lab (break it, then fix it):** a simulation with real controls, live meters, a text status line, and **missions**: ordered steps that tick themselves off as the learner causes the failure and then fixes it.
3. **The one difference:** a takeaway naming the single switch that separates the confusing pair (for example, a shared bucket vs a bucket per user).
4. **The real thing:** a real config file, query or code block, mapped line by line to the lab with `X.codeMap`.
5. **Recap:** three cards, a **tradeoff** takeaway, and **3 scenario questions** with feedback on every answer.
6. **Pager:** previous, next, and roadmap links.

**Rules for every page**

- The first useful interaction is reachable without reading a long explanation.
- Every control changes something visible immediately.
- Simulations that run over time have Play, Pause, Step and Reset (`X.player`).
- System state is always shown in text (status line, pills, chip labels), not only through color or motion.
- Numbers are labeled as simulated and never presented as benchmarks.
- Data-vs-code demos (XSS) never insert user input as real HTML.

## Simulation contract

Simulations are plain functions inside each page:

```js
function init(seed, options) { return { r: seed, t: 0, /* … */ }; } // all state, including the random seed
function tick(state) { /* advance by DT ms using X.rnd(state) */ return state; }
function metrics(state) { /* derived numbers for meters and missions */ }
```

The random generator state lives inside the simulation state (`s.r`), so a given seed always replays the same way, and Reset returns to the starting state.

## Definition of done (per page)

- [ ] Hero, lab with missions, one-difference takeaway, real artifact, recap with tradeoff, 3-question quiz, pager.
- [ ] `node tests/smoke.js` passes: no console errors and no horizontal scrolling at 390 px, light and dark.
- [ ] The page has a flow in `tests/missions.js`, and all its missions complete.
- [ ] Every control is a real `<button>`, `<input>` or labeled element, and works with a keyboard.
- [ ] Color is never the only signal of state.
- [ ] Reset returns the simulation to its starting state, and the same seed gives the same run.
- [ ] Uses tokens and components from `assets/explainer.css`. No copied styles and no hard-coded colors.
- [ ] The explanation has been checked for technical accuracy by a person.
- [ ] The page's `status` in `X.CATALOG` is set to `built`, and `node tests/gen-docs.js` has been run.
- [ ] `i18n/<slug>.json` is fully translated, and `python3 tools/i18n.py build --check` passes.

## Milestones

| Milestone | Scope | Gate to move on |
| --- | --- | --- |
| **M0** ✅ | Audit, shared CSS/JS, roadmap, tests, pages 1–8 | All 8 pass smoke and mission tests |
| **M1** | Learner review of pages 1–8 with 3–5 real people, then fix what confused them | Every page completed without help by at least 3 testers |
| **M2** | Stage 3–4 pages (9–16), and migrate the CI/CD page to the shared assets | Same gates as M0 |
| **M3** | Stage 5 (17–20): extend page 17 with deploy strategies and rollbacks | Same gates, plus page 17 shows all 6 concepts |
| **M4** | Stages 6–11 (pages 21–56), in batches of about 6 | Same gates per batch |

## Known gaps

- The CI/CD page still uses its own inline CSS, has no pager, and its quiz is 5 myth/fact questions instead of 3 scenario questions.
- Simulation functions live inside each page's script, so they're covered by browser tests but not by unit tests. Moving them to `topic/sim.js` files would allow unit tests without a build step.
- Accuracy review of pages 1–8 by a person hasn't happened yet.
- The Chinese translations were written by Claude and haven't been reviewed by a native speaker. Simplified is machine-converted from Traditional, plus fix-ups for terms OpenCC misses.
- A few labels stay in English on purpose: machine sizes (medium, large, x-large), code, and HTTP status text.
