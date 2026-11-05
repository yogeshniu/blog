#!/usr/bin/env node
/* Checks the land, flow-duration, hydrology, citation and flashcard libraries against hand-worked answers.
   Usage:  node scripts/test-new-tools.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
global.window = global;
['landlib', 'fdclib', 'hydrologylib', 'citelib', 'cardslib'].forEach((f) => vm.runInThisContext(fs.readFileSync(path.join(__dirname, '..', 'assets', 'js', 'tools', f + '.js'), 'utf8'), { filename: f }));
let bad = 0;
const eq = (name, got, exp, tol = 1e-6) => {
  const ok = typeof exp === 'number' ? Math.abs(got - exp) <= tol * Math.max(1, Math.abs(exp)) : got === exp;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : `\n      got:      ${JSON.stringify(got)}\n      expected: ${JSON.stringify(exp)}`}`); if (!ok) bad++;
};
// ---- Land (a ropani is 74 ft x 74 ft, a bigha is 270 ft x 270 ft; 1 ft = 0.3048 m exactly)
eq('1 ropani in m² (74 ft × 74 ft)', LandLib.ROPANI, Math.pow(74 * 0.3048, 2), 1e-9);
eq('1 bigha in m² (270 ft × 270 ft)', LandLib.BIGHA, Math.pow(270 * 0.3048, 2), 1e-9);
eq('1 bigha = 13.3 ropani (72900/5476)', LandLib.BIGHA / LandLib.ROPANI, 72900 / 5476, 1e-9);
eq('1.5 ropani -> 1 ropani 8 aana', JSON.stringify(LandLib.hill(1.5 * LandLib.ROPANI)), JSON.stringify({ ropani: 1, aana: 8, paisa: 0, daam: 0 }));
eq('3-2-1-2 ropani round trip', JSON.stringify(LandLib.hill(LandLib.fromHill(3, 2, 1, 2))), JSON.stringify({ ropani: 3, aana: 2, paisa: 1, daam: 2 }));
eq('2 bigha 5 kattha 10 dhur round trip', JSON.stringify(LandLib.terai(LandLib.fromTerai(2, 5, 10))), JSON.stringify({ bigha: 2, kattha: 5, dhur: 10 }));
eq('1 hectare in ropani', 10000 / LandLib.ROPANI, 19.6564, 1e-4);
eq('1 acre = 43,560 ft²', 4046.8564224 / LandLib.FT2, 43560, 1e-6);
// ---- Flow duration curve with flows 1..100 (rank m has value 101-m)
const v = Array.from({ length: 100 }, (_, i) => i + 1), c = FdcLib.curve(v);
eq('Weibull P of largest flow = 1/101', c[0].p, 100 / 101); eq('Q50 of 1..100 = 50.5', FdcLib.qAt(c, 50), 50.5);
eq('Q90 of 1..100 = 10.1', FdcLib.qAt(c, 90), 10.1, 1e-9); eq('Q below first point = max', FdcLib.qAt(c, 0.1), 100);
const pr = FdcLib.parse('date,flow\n2020-01-01, 5\n2020-01-02, 7.5\n2020-01-03, -999\n\n2020-01-04, x\n9');
eq('parse keeps valid, skips negative/text', JSON.stringify(pr), JSON.stringify({ values: [5, 7.5, 9], skipped: 2 }));
const pl = FdcLib.plant([10, 20, 30], 20, 0, 100, 0.8); // used = 10,20,20 -> mean 16.6667
eq('plant installed kW = 9.81·Qd·H·η', pl.installedKW, 9.81 * 20 * 100 * 0.8); eq('plant annual GWh', pl.annualGWh, 9.81 * 100 * 0.8 * (50 / 3) * 8760 / 1e6, 1e-9);
eq('plant factor = mean used / Qd', pl.plantFactor, (50 / 3) / 20, 1e-9);
// ---- Hydrology
eq('Rational: C=0.5, i=50, A=100 ha -> 6.944 m³/s', HydrologyLib.rational(0.5, 50, 100), 125 / 18, 1e-9);
eq('Kirpich: L=1000 m, S=0.01 -> about 23.4 min', HydrologyLib.kirpich(1000, 0.01), 23.4, 5e-3);
const s = HydrologyLib.scs(100, 75, 0.2); eq('SCS S for CN 75 = 84.667 mm', s.S, 84.6667, 1e-6); eq('SCS runoff P=100, CN=75 -> 41.14 mm', s.Q, 41.138, 1e-4);
eq('SCS no runoff when P <= Ia', HydrologyLib.scs(10, 75, 0.2).Q, 0);
eq('Gumbel K for T=100 = 3.1367', HydrologyLib.gumbel(0, 1, 100).K, 3.1367, 1e-4); eq('Gumbel K for T=2 = -0.1643', HydrologyLib.gumbel(0, 1, 2).K, -0.16427, 1e-3);
eq('Risk 100-yr flood over 50 yr = 39.5%', HydrologyLib.risk(100, 50), 1 - Math.pow(0.99, 50), 1e-12);
eq('T for 10% risk over 50 yr ≈ 475 yr', HydrologyLib.returnPeriodFor(0.1, 50), 475.06, 1e-3);
eq('Area ratio b=1 doubles with double area', HydrologyLib.areaRatio(100, 500, 1000, 1), 200);
// ---- Citations
const base = { authors: 'Smith, John A.\nDoe, Jane', year: '2020', title: 'Flow duration curves for Himalayan rivers', container: 'Journal of Hydrology', volume: '12', issue: '3', pages: '123-145', link: 'https://doi.org/10.1000/xyz123' };
const a = CiteLib.format('article', base);
eq('APA article', a.apa, 'Smith, J. A., & Doe, J. (2020). Flow duration curves for Himalayan rivers. *Journal of Hydrology*, *12*(3), 123–145. https://doi.org/10.1000/xyz123');
eq('Harvard article', a.harvard, "Smith, J.A. and Doe, J. (2020) 'Flow duration curves for Himalayan rivers', *Journal of Hydrology*, 12(3), pp. 123–145. doi:10.1000/xyz123");
eq('IEEE article', a.ieee, 'J. A. Smith and J. Doe, “Flow duration curves for Himalayan rivers,” *Journal of Hydrology*, vol. 12, no. 3, pp. 123–145, 2020, doi: 10.1000/xyz123.');
eq('BibTeX key and pages', /^@article\{smith2020flow,/.test(a.bibtex) && /pages = \{123--145\}/.test(a.bibtex), true);
const b = CiteLib.format('book', { authors: 'Chow, Ven Te\nMaidment, David R.\nMays, Larry W.', year: '1988', title: 'Applied hydrology', publisher: 'McGraw-Hill', place: 'New York', edition: '2nd' });
eq('APA book, 3 authors', b.apa, 'Chow, V. T., Maidment, D. R., & Mays, L. W. (1988). *Applied hydrology* (2nd ed.). McGraw-Hill.');
eq('Harvard book, 3 authors', b.harvard, 'Chow, V.T., Maidment, D.R. and Mays, L.W. (1988) *Applied hydrology*. 2nd edn. New York: McGraw-Hill.');
eq('IEEE book', b.ieee, 'V. T. Chow, D. R. Maidment, and L. W. Mays, *Applied hydrology*, 2nd ed. New York: McGraw-Hill, 1988.');
const w = CiteLib.format('web', { authors: 'org: Department of Hydrology and Meteorology', year: '2023', title: 'Daily river discharge data', container: 'DHM Nepal', link: 'https://example.org/data', accessed: '2026-11-05' });
eq('APA web, organisation author', w.apa, 'Department of Hydrology and Meteorology. (2023). *Daily river discharge data*. DHM Nepal. https://example.org/data');
eq('Harvard web with access date', w.harvard, 'Department of Hydrology and Meteorology (2023) *Daily river discharge data*. DHM Nepal. Available at: https://example.org/data (Accessed: 5 November 2026)');
eq('IEEE web with access date', w.ieee, 'Department of Hydrology and Meteorology, “Daily river discharge data,” DHM Nepal. https://example.org/data (accessed Nov. 5, 2026).');
eq('APA no author: title first, n.d.', CiteLib.format('web', { title: 'Hydropower basics', container: 'Example Site', link: 'https://e.org' }).apa, '*Hydropower basics*. (n.d.). Example Site. https://e.org');
eq('Eight authors in IEEE -> et al.', CiteLib.format('article', Object.assign({}, base, { authors: 'A, B\nC, D\nE, F\nG, H\nI, J\nK, L\nM, N\nO, P' })).ieee.startsWith('B. A et al., “'), true);
eq('Five authors in Harvard -> et al.', CiteLib.format('article', Object.assign({}, base, { authors: 'A, B\nC, D\nE, F\nG, H\nI, J' })).harvard.startsWith('A, B. et al. (2020)'), true);
eq('Asterisks typed by user are stripped', CiteLib.format('book', { title: 'A *bold* idea' }).apa.includes('bold') && !/\*\*/.test(CiteLib.format('book', { title: 'A *bold* idea' }).apa), true);
let threw = false; try { CiteLib.format('book', { title: '' }); } catch (e) { threw = true; } eq('Missing title is rejected', threw, true);
eq('Rendering: italics -> <i>, user text escaped', CiteLib.html('*A* <b>'), '<i>A</i> &lt;b&gt;');
// ---- Flashcards
const d = CardsLib.parse('Q40 | Flow exceeded 40% of time\nrope\tani | x\nbad line\nSame | Same\nSame | Same\n| empty front\nTerm :: Meaning');
eq('Parse: 4 cards, 2 skipped, duplicate dropped', JSON.stringify([d.cards.length, d.skipped]), JSON.stringify([4, 2]));
eq('Parse: tab wins over pipe', d.cards[1].f, 'rope'); eq('Parse: :: separator', d.cards[3].b, 'Meaning');
const t = 20000;
eq('New card is due', CardsLib.isDue(undefined, t), true);
let st = CardsLib.review(undefined, true, t); eq('Got it (new) -> box 1, due tomorrow', JSON.stringify(st), JSON.stringify({ box: 1, due: t + 1 }));
st = CardsLib.review(st, true, t + 1); eq('Got it again -> box 2, due in 3 days', JSON.stringify(st), JSON.stringify({ box: 2, due: t + 4 }));
for (let i = 0; i < 6; i++) st = CardsLib.review(st, true, t); eq('Box is capped at 5 (30 days)', JSON.stringify(st), JSON.stringify({ box: 5, due: t + 30 }));
eq('Again resets to box 0, due today', JSON.stringify(CardsLib.review(st, false, t)), JSON.stringify({ box: 0, due: t }));
eq('Not due before its date', CardsLib.isDue({ box: 2, due: t + 3 }, t + 2), false);
let seed = 7; const rnd = (n) => (seed = (seed * 48271) % 2147483647) % n; const sh = CardsLib.shuffle([1, 2, 3, 4, 5, 6], rnd);
eq('Shuffle keeps all cards', JSON.stringify(sh.slice().sort()), JSON.stringify([1, 2, 3, 4, 5, 6]));
console.log(bad ? `\n${bad} FAILED` : '\nAll checks pass.'); process.exit(bad ? 1 : 0);
