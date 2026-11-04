#!/usr/bin/env node
/* Runs every hydropower tool card with its starting values (no browser needed), checks that nothing throws and
   every number is finite, and re-derives key results independently (physics identities) to catch formula slips.
   Usage:  node scripts/test-hydro-tools.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
const dir = path.join(__dirname, '..', 'assets', 'js', 'tools');
global.window = global; global.T = { root: {}, num: (v) => { const x = parseFloat(String(v).replace(',', '.')); return isFinite(x) ? x : NaN; } };
const load = (f) => vm.runInThisContext(fs.readFileSync(path.join(dir, f + '.js'), 'utf8'), { filename: f });
load('hydrolib'); load('hydroui');
const H = HydroCalc, pages = ['settlingbasin', 'gravel', 'intake', 'culvert', 'spillway', 'headpond', 'reservoir', 'headloss'];
let bad = 0, cards = 0; const D = {}; // D[page][sectionIndex] = starting values
const fail = (m) => { bad++; console.log('  FAIL ' + m); };
for (const p of pages) {
  let def; HydroUI.mount = (d) => { def = d; }; load(p); D[p] = [];
  console.log(p);
  def.sections.forEach((sec, i) => {
    cards++;
    const v = {}; sec.fields.forEach((f) => { if (typeof f !== 'string') v[f[0]] = f[2]; }); D[p][i] = Object.assign({}, v);
    let ev; try { ev = HydroUI.evaluate(sec, v); } catch (e) { return fail(`${sec.title}: threw ${e.message}`); }
    ev.rows.forEach((r) => { if (typeof r[1] === 'number' && !isFinite(r[1])) fail(`${sec.title}: "${r[0]}" is not finite`); if (r[1] === undefined) fail(`${sec.title}: "${r[0]}" is undefined (bad key)`); });
    if (/NaN|undefined/.test(HydroUI.render(ev))) fail(`${sec.title}: html shows NaN/undefined`);
    const flagged = ev.checks.filter((c) => !c.ok).map((c) => c.name);
    console.log(`  ok   ${sec.title}  (${ev.rows.length} rows, ${ev.checks.length} checks${flagged.length ? '; not met: ' + flagged.join(' | ') : ''})`);
  });
}
const is = (name, got, exp, tol = 1e-6) => (Math.abs(got - exp) <= tol * Math.max(1, Math.abs(exp))) ? console.log(`  match ${name}`) : fail(`${name}: got ${got}, expected ${exp}`);
console.log('Independent re-derivations');
{ // culvert: Manning discharge at the returned normal depth equals the design flow per culvert
  const v = D.culvert[0], r = H.culvert(v).results, A = v.B * r.y, R = A / (v.B + 2 * r.y);
  is('culvert: Manning Q at normal depth = design Q', (1 / v.n) * A * Math.pow(R, 2 / 3) * Math.sqrt(1 / v.slopeOneIn), r.Q);
}
{ // spillway: Q = C * Le * Ho^1.5 and Lo >= Le
  const v = D.spillway[0]; v.k = [v.kk, 1, 1, 1]; const r = H.gatedSpillway(v).results;
  is('spillway: C·Le·Ho^1.5 = Q', r.C * r.Le * Math.pow(r.Ho, 1.5), v.Qflood); if (!(r.Lo >= r.Le)) fail('spillway: Lo < Le');
}
{ // stilling basin: y1 satisfies the energy equation, y2 satisfies momentum (y2 from Fr1), jump loss is positive
  const v = D.spillway[2], r = H.stillingBasin(v).results, g = 9.81;
  is('stilling basin: y1 + q²/2g·y1² = Ef1', r.y1 + (r.q * r.q) / (2 * g * r.y1 * r.y1), r.Ef1, 1e-6);
  is('stilling basin: momentum balance y1²/2 + q²/(g·y1) = y2²/2 + q²/(g·y2)', r.y1 * r.y1 / 2 + r.q * r.q / (g * r.y1), r.y2 * r.y2 / 2 + r.q * r.q / (g * r.y2), 1e-6);
  if (!(r.HL > 0 && r.Fr1 > 1)) fail('stilling basin: jump loss / Froude number not physical');
}
{ // settling basin: continuity, Camp velocity, Vetter efficiency, sediment mass balance
  const v = D.settlingbasin[0]; v.flushFraction = v.flushPct / 100; const r = H.settlingBasin(v).results;
  is('settling basin: Qb = Q(1+f)/N', r.Qb, v.Q * (1 + v.flushFraction) / v.nBays);
  is('settling basin: V·B·H = Qb', r.V * v.B * v.Hb, r.Qb);
  is('settling basin: Vc = 0.44·√d', r.Vc, 0.44 * Math.sqrt(v.d_mm));
  is('settling basin: Vetter η = 1 − exp(−w·As/Qb)', r.etaVetter, 1 - Math.exp(-v.w * v.B * v.Lprov / r.Qb));
  is('settling basin: sediment volume = Qb·T·C/(ρs·P)', r.Vsed, (r.Qb * v.flushHours * 3600 * v.conc_ppm / 1000) / (v.rhoS * v.packing));
}
{ // reservoir: volume from the tool equals an independent trapezoid sum over whole-metre slices
  const v = D.reservoir[0]; let tot = 0;
  const pts = v.curve.split('\n').map((l) => l.split(',').map(Number)); // whole-metre table, levels are integers
  for (let i = 1; i < pts.length; i++) if (pts[i - 1][0] >= v.lwl && pts[i][0] <= v.hwl) tot += (pts[i][1] + pts[i - 1][1]) / 2 * (pts[i][0] - pts[i - 1][0]);
  is('reservoir: usable storage = trapezoid sum', H.reservoirStorage({ curve: pts.map((a) => ({ elev: a[0], area: a[1] })), lwl: v.lwl, hwl: v.hwl, Qpeak: v.Qpeak, Qmin: v.Qmin }).results.volume, tot);
}
{ // head loss: final level = NWL − sum of stage losses
  const v = D.headloss[0], sec = (() => { let d; HydroUI.mount = (x) => { d = x; }; load('headloss'); return d.sections[0]; })();
  const ev = HydroUI.evaluate(sec, Object.assign({}, v)), total = ev.rows[0][1], level = ev.rows[1][1];
  is('head loss: NWL − total loss = final level', v.NWL - total, level);
  const stages = sec.run(Object.assign({}, v)).results.stages; is('head loss: stages add up', stages.reduce((s, x) => s + x.loss, 0), total);
}
{ // intake submergence: adopted = max of the four methods
  const r = H.pipeSubmergence({ Q: D.intake[1].Q, D: D.intake[1].D }).results;
  is('submergence: adopted = max of methods', r.adopted, Math.max(r.gordon, r.prosser, r.itdg, r.knauss));
}
console.log(bad ? `\n${bad} problem(s)` : `\nAll ${cards} cards run cleanly.`); process.exit(bad ? 1 : 0);
