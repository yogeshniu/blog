/* Hydropower quick calculators. Standard formulas, for quick checks (not for final design). */
(function () {
  var root = T.root, $ = T.$, RHO = 1000, G = 9.81;
  function field(id, label, val, step) { return '<label class="tfield">' + label + '<input id="' + id + '" type="number" inputmode="decimal" step="' + (step || 'any') + '" value="' + val + '"></label>'; }
  root.innerHTML =
    '<div class="tcard"><h2>1. Power and energy from flow and head</h2><div class="tgrid">' +
    field('a-q', 'Discharge Q (m³/s)', 20) + field('a-h', 'Net head H (m)', 150) + field('a-e', 'Overall efficiency (%)', 90) + field('a-c', 'Capacity factor (%)', 50) +
    '</div><div class="tresult" id="a-out" aria-live="polite"></div><p class="thint">P = ρ · g · Q · H · η, with ρ = 1000 kg/m³ and g = 9.81 m/s². Annual energy = P × 8760 h × capacity factor.</p></div>' +
    '<div class="tcard"><h2>2. Flow needed for a target power</h2><div class="tgrid">' +
    field('b-p', 'Target power (MW)', 30) + field('b-h', 'Net head H (m)', 150) + field('b-e', 'Overall efficiency (%)', 90) +
    '</div><div class="tresult" id="b-out" aria-live="polite"></div><p class="thint">Q = P / (ρ · g · H · η)</p></div>' +
    '<div class="tcard"><h2>3. Penstock diameter from velocity</h2><div class="tgrid">' +
    field('c-q', 'Design discharge Q (m³/s)', 20) + field('c-v', 'Allowable velocity V (m/s)', 4) +
    '</div><div class="tresult" id="c-out" aria-live="polite"></div><p class="thint">D = √(4Q / (π V)). Many designs use roughly 3 to 6 m/s; check the guideline and economics for your project.</p></div>';

  function f(x, d) { return x.toLocaleString(undefined, { maximumFractionDigits: d === undefined ? 2 : d }); }
  function v(id) { return T.num($('#' + id).value); }
  function bad(el) { el.innerHTML = 'Enter positive numbers in every box (efficiency and capacity factor between 0 and 100).'; }
  function a() {
    var q = v('a-q'), h = v('a-h'), e = v('a-e'), c = v('a-c'), out = $('#a-out');
    if (!(q > 0 && h > 0 && e > 0 && e <= 100 && c > 0 && c <= 100)) return bad(out);
    var kw = RHO * G * q * h * (e / 100) / 1000, mw = kw / 1000, gwh = mw * 8760 * (c / 100) / 1000;
    out.innerHTML = 'Power: <strong>' + f(mw, 2) + ' MW</strong> (' + f(kw, 0) + ' kW)<br>Annual energy: <strong>' + f(gwh, 1) + ' GWh</strong> at ' + f(c, 0) + '% capacity factor';
  }
  function b() {
    var p = v('b-p'), h = v('b-h'), e = v('b-e'), out = $('#b-out');
    if (!(p > 0 && h > 0 && e > 0 && e <= 100)) return bad(out);
    var q = p * 1e6 / (RHO * G * h * (e / 100));
    out.innerHTML = 'Required discharge: <strong>' + f(q, 2) + ' m³/s</strong> (' + f(q * 1000, 0) + ' L/s)';
  }
  function c() {
    var q = v('c-q'), vel = v('c-v'), out = $('#c-out');
    if (!(q > 0 && vel > 0)) return bad(out);
    var d = Math.sqrt(4 * q / (Math.PI * vel)), area = q / vel;
    out.innerHTML = 'Diameter: <strong>' + f(d, 2) + ' m</strong> (' + f(d * 1000, 0) + ' mm)<br>Flow area: ' + f(area, 2) + ' m²';
  }
  [['a', a, ['q', 'h', 'e', 'c']], ['b', b, ['p', 'h', 'e']], ['c', c, ['q', 'v']]].forEach(function (g) {
    g[2].forEach(function (k) { $('#' + g[0] + '-' + k).addEventListener('input', g[1]); }); g[1]();
  });
})();
