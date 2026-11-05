#!/usr/bin/env node
/* Runs the five new tool page scripts against a tiny fake DOM (no browser or jsdom needed), clicking through
   typical use and checking what gets drawn. Usage:  node scripts/test-new-pages.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
const dir = path.join(__dirname, '..', 'assets', 'js', 'tools');
let bad = 0; const ok = (name, cond, extra) => { console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${cond ? '' : '  ' + (extra || '')}`); if (!cond) bad++; };
function setup(init) {
  const els = {}, mem = {};
  const mk = (id) => ({ id, value: '', innerHTML: '', textContent: '', hidden: false, disabled: false, style: {}, _h: {},
    addEventListener(e, f) { (this._h[e] = this._h[e] || []).push(f); }, fire(e, ev) { (this._h[e] || []).forEach((f) => f(ev || { target: this, key: '' })); },
    focus() {}, select() {}, setAttribute() {}, getAttribute() { return null; }, querySelectorAll() { return []; } });
  const $ = (s) => els[s] || (els[s] = mk(s));
  Object.keys(init || {}).forEach((k) => { $(k).value = init[k]; });
  global.window = global; global.confirm = () => true;
  global.document = { createElement: () => mk('x'), body: { appendChild() {}, removeChild() {} }, execCommand() {} };
  global.T = { $, $$: () => [], root: mk('root'), today: () => '2026-11-05', rnd: () => 0, num: (v) => { const x = parseFloat(String(v).replace(',', '.')); return isFinite(x) ? x : NaN; },
    store: { get: (k, d) => (mem[k] === undefined ? d : mem[k]), set: (k, v) => { mem[k] = v; } } };
  return { els, $, mem };
}
const load = (f) => vm.runInThisContext(fs.readFileSync(path.join(dir, f + '.js'), 'utf8'), { filename: f });

/* ---------- Land + hydrology (card renderer) ---------- */
{
  setup(); ['landlib', 'hydrologylib', 'hydroui'].forEach(load);
  const run = (page) => { let def; HydroUI.mount = (d) => { def = d; }; load(page); return def.sections.map((s) => { const v = {}; s.fields.forEach((f) => { if (typeof f !== 'string') v[f[0]] = f[2]; }); const ev = HydroUI.evaluate(s, v); return { ev, html: HydroUI.render(ev) }; }); };
  const row = (r, label) => (r.ev.rows.find((x) => x[0] === label) || [])[1];
  const land = run('land');
  ok('land: 3 cards, no NaN', land.length === 3 && land.every((r) => !/NaN|undefined/.test(r.html)));
  ok('land: 1 ropani = 508.737 m²', Math.abs(row(land[0], 'Square metre') - 508.7374) < 1e-3, row(land[0], 'Square metre'));
  ok('land: 1 ropani = 16 aana', Math.abs(row(land[0], 'Aana') - 16) < 1e-9);
  ok('land: 1 ropani = 5,476 ft²', Math.abs(row(land[0], 'Square feet') - 5476) < 1e-6);
  ok('land: breakdown text shown', /1 ropani, 0 aana, 0 paisa, 0 daam/.test(land[0].ev.extra));
  ok('land: ropani to Terai text', /bigha/.test(land[1].html));
  const hy = run('hydrology');
  ok('hydrology: 6 cards, no NaN', hy.length === 6 && hy.every((r) => !/NaN|undefined/.test(r.html)));
  ok('hydrology: rational 6.944 m³/s', Math.abs(row(hy[0], 'Peak flow Q') - 6.944444) < 1e-5);
  ok('hydrology: SCS runoff 41.14 mm', Math.abs(row(hy[2], 'Runoff depth Q') - 41.138) < 1e-3);
  ok('hydrology: Gumbel 100-yr flood', Math.abs(row(hy[3], 'Flood of return period T') - (250 + 3.1367 * 80)) < 0.05);
  ok('hydrology: 100-yr risk over 50 yr = 39.5%', Math.abs(row(hy[4], 'Chance of exceedance within n years') - 39.5) < 0.05);
  const bad1 = { title: 't', fields: [], run: () => { throw new Error('boom'); } }; let threw = false; try { HydroUI.evaluate(bad1, {}); } catch (e) { threw = true; } ok('evaluate surfaces errors to the caller', threw);
}

/* ---------- Flow duration curve ---------- */
{
  const s = setup({ '#fd-pe': '40', '#fd-h': '100', '#fd-eta': '85', '#fd-env': '0', '#fd-scale': 'lin' });
  ['fdclib', 'hydroui'].forEach(load); load('fdc');
  const ex = s.els['#fd-in'].value; ok('fdc: example loaded (365 lines)', ex.split('\n').length === 365);
  ok('fdc: summary table drawn', /Mean flow/.test(s.els['#fd-sum'].innerHTML) && /365/.test(s.els['#fd-sum'].innerHTML));
  ok('fdc: chart is an SVG with a curve and design marker', /<svg/.test(s.els['#fd-chart'].innerHTML) && /<path d="M/.test(s.els['#fd-chart'].innerHTML) && /<circle/.test(s.els['#fd-chart'].innerHTML));
  const qd = FdcLib.qAt(FdcLib.curve(FdcLib.parse(ex).values), 40);
  ok('fdc: design flow Q40 shown', s.els['#fd-plant'].innerHTML.includes(HydroUI.fmt(qd, 3)), HydroUI.fmt(qd, 3));
  ok('fdc: energy and plant factor shown', /Annual energy/.test(s.els['#fd-plant'].innerHTML) && /Plant factor/.test(s.els['#fd-plant'].innerHTML));
  ok('fdc: quantile table has Q50 and Q95', /Q50/.test(s.els['#fd-table'].innerHTML) && /Q95/.test(s.els['#fd-table'].innerHTML));
  s.els['#fd-scale'].value = 'log'; T.root.fire('change'); ok('fdc: log axis redraws', /<svg/.test(s.els['#fd-chart'].innerHTML));
  s.els['#fd-pe'].value = 'abc'; T.root.fire('input'); ok('fdc: bad exceedance does not break the page', /<svg/.test(s.els['#fd-chart'].innerHTML) && !/NaN/.test(s.els['#fd-plant'].innerHTML));
  s.els['#fd-pe'].value = '40'; s.els['#fd-in'].value = '10\n20\n30\n40'; T.root.fire('input'); ok('fdc: small pasted record works', /Values used/.test(s.els['#fd-sum'].innerHTML));
  s.els['#fd-in'].value = '5'; T.root.fire('input'); ok('fdc: one value asks for more', /at least two/.test(s.els['#fd-sum'].innerHTML) && s.els['#fd-chart'].innerHTML === '');
  s.els['#fd-clear'].fire('click'); ok('fdc: clear empties the data box', s.els['#fd-in'].value === '');
  s.els['#fd-ex'].fire('click'); ok('fdc: example button refills', s.els['#fd-in'].value.split('\n').length === 365);
}

/* ---------- Citation maker ---------- */
{
  const s = setup({ '#ci-type': 'article', '#ci-year': '2020', '#ci-title': 'Flow duration curves for Himalayan rivers', '#ci-authors': 'Smith, John A.\nDoe, Jane', '#ci-f0': 'Journal of Hydrology', '#ci-f2': '12', '#ci-f3': '3', '#ci-f4': '123-145', '#ci-f9': '10.1000/xyz123', '#ci-f10': '2026-11-05' });
  ['citelib'].forEach(load); load('cite');
  const out = s.els['#ci-out'].innerHTML;
  ok('cite: APA drawn with escaped & and italic journal', out.includes('Smith, J. A., &amp; Doe, J. (2020).') && out.includes('<i>Journal of Hydrology</i>'));
  ok('cite: Harvard and IEEE drawn', out.includes('Harvard') && out.includes('J. A. Smith and J. Doe'));
  ok('cite: BibTeX text set safely', /^@article\{smith2020flow,/.test(s.els['#ci-bib'].textContent));
  s.els['#ci-title'].value = '<script>alert(1)</script>'; T.root.fire('input');
  ok('cite: HTML in a title is escaped', !/<script>/.test(s.els['#ci-out'].innerHTML) && /&lt;script&gt;/.test(s.els['#ci-out'].innerHTML));
  T.root.fire('click', { target: { getAttribute: (k) => (k === 'data-i' ? '0' : null) } }); ok('cite: copy button does not throw', true);
  s.els['#ci-type'].value = 'book'; s.els['#ci-title'].value = 'Applied hydrology'; s.$('#ci-f5').value = 'McGraw-Hill'; s.$('#ci-f7').value = '2nd'; T.root.fire('change');
  ok('cite: switching to book uses book fields', /\(2nd ed\.\)/.test(s.els['#ci-out'].innerHTML));
  s.els['#ci-title'].value = ''; T.root.fire('input'); ok('cite: missing title shows a message and no output', /Add a title/.test(s.els['#ci-msg'].innerHTML) && s.els['#ci-out'].innerHTML === '');
}

/* ---------- Flashcards ---------- */
{
  const s = setup(); ['cardslib'].forEach(load); load('flashcards');
  ok('flashcards: starter deck loaded (18 cards, all due)', /^18 cards, 18 due today, 0 mastered/.test(s.els['#fc-sum'].textContent), s.els['#fc-sum'].textContent);
  ok('flashcards: deck chips drawn', /Hydrology and hydropower/.test(s.els['#fc-chips'].innerHTML) && /Nepali land units/.test(s.els['#fc-chips'].innerHTML));
  s.els['#fc-due'].fire('click'); const card = s.els['#fc-card'];
  ok('flashcards: study starts on a front side', s.els['#fc-side'].textContent === 'Front' && s.els['#fc-face'].textContent.length > 0 && s.els['#fc-study'].hidden === false);
  ok('flashcards: answer buttons locked until flipped', s.els['#fc-know'].disabled === true);
  const front = s.els['#fc-face'].textContent; card.fire('click'); ok('flashcards: flip shows the back and unlocks buttons', s.els['#fc-side'].textContent === 'Back' && s.els['#fc-face'].textContent !== front && s.els['#fc-know'].disabled === false);
  card.fire('keydown', { key: ' ', preventDefault() {} }); ok('flashcards: Space flips back', s.els['#fc-side'].textContent === 'Front');
  card.fire('keydown', { key: ' ', preventDefault() {} }); s.els['#fc-again'].fire('click');
  ok('flashcards: Again re-queues the card (19 in the queue)', /of 19/.test(s.els['#fc-prog'].textContent), s.els['#fc-prog'].textContent);
  for (let i = 0; i < 18; i++) { card.fire('click'); s.els['#fc-know'].fire('click'); if (/Session finished/.test(s.els['#fc-done'].innerHTML)) break; }
  ok('flashcards: session finishes', /Session finished/.test(s.els['#fc-done'].innerHTML) && card.hidden === true);
  ok('flashcards: progress saved to storage', Object.keys(s.mem['fc:state']).length === 18);
  ok('flashcards: nothing due right after finishing', /18 cards, 0 due today/.test(s.els['#fc-sum'].textContent), s.els['#fc-sum'].textContent);
  s.els['#fc-due'].fire('click'); ok('flashcards: "nothing due" message', /Nothing is due today/.test(s.els['#fc-done'].innerHTML));
  s.els['#fc-all'].fire('click'); ok('flashcards: study all works even when none are due', /Card 1 of 18/.test(s.els['#fc-prog'].textContent));
  s.els['#fc-chips'].fire('click', { target: { getAttribute: () => 'Nepali land units' } }); ok('flashcards: switch to the land deck (6 cards)', /^6 cards/.test(s.els['#fc-sum'].textContent));
  s.els['#fc-text'].value = 'no separator here\nA | B'; s.els['#fc-text'].fire('input'); ok('flashcards: bad line is reported', /1 cards/.test(s.els['#fc-sum'].textContent) && /1 line\(s\) skipped/.test(s.els['#fc-sum'].textContent));
  s.els['#fc-reset'].fire('click'); ok('flashcards: reset clears progress', Object.keys(s.mem['fc:state']).length === 0);
}
console.log(bad ? `\n${bad} FAILED` : '\nAll page checks pass.'); process.exit(bad ? 1 : 0);
