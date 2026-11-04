// Regenerates docs/CONCEPTS.md and docs/TOPICS.md from the catalog in assets/explainer.js.
global.window = {}; global.matchMedia = () => ({ matches: false });
require(require('path').join(__dirname, '..', 'assets', 'explainer.js'));
const X = window.X, fs = require('fs');
let c = '# The 111 concepts\n\nConcept ids used everywhere in this repo (`X.CATALOG` in `assets/explainer.js`, page labels, `docs/TOPICS.md`). The page column shows where each one is taught.\n\n| # | Concept | Page |\n| --- | --- | --- |\n';
const where = {}; X.CATALOG.forEach(p => p.ids.forEach(id => (where[id] = p)));
for (let i = 1; i <= 111; i++) c += `| ${i} | ${X.CONCEPTS[i]} | ${where[i].n} · ${where[i].title} |\n`;
fs.writeFileSync(require('path').join(__dirname, '..', 'docs', 'CONCEPTS.md'), c);
let t = '# Topics\n\nGenerated from `X.CATALOG` in `assets/explainer.js`, which is the source of truth. Edit the catalog, not this file, then regenerate with `node tests/gen-docs.js`.\n\n';
const built = X.CATALOG.filter(p => p.status !== 'planned').length;
t += `**${X.CATALOG.length} pages** cover all 111 concepts. **${built}** are live (one of them partial).\n`;
X.STAGES.forEach(st => {
  t += `\n## Stage ${st.n}: ${st.name}\n\n| Page | Topic | Concepts | Status | Folder |\n| --- | --- | --- | --- | --- |\n`;
  X.CATALOG.filter(p => p.stage === st.n).forEach(p => (t += `| ${p.n} | ${p.title} | ${p.ids.map(id => `${id} ${X.CONCEPTS[id]}`).join(', ')} | ${p.status} | \`${p.slug}/\` |\n`));
});
fs.writeFileSync(require('path').join(__dirname, '..', 'docs', 'TOPICS.md'), t);
console.log('docs written');
