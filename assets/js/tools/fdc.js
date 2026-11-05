/* Flow duration curve analyser. Daily flows in, exceedance table, chart and a simple run-of-river energy estimate out. */
(function () {
  var T = window.T, $ = T.$, F = FdcLib, U = HydroUI, esc = U.esc, root = T.root;
  var PS = [1, 5, 10, 25, 40, 50, 60, 75, 90, 95, 99];

  root.innerHTML =
    '<div class="tcard"><h2>1. Your daily flows</h2>' +
    '<p class="thint" style="margin:0 0 10px">One flow per line in m³/s, or "date, flow". A header line is fine. Negative or missing values are skipped.</p>' +
    '<textarea id="fd-in" class="tinput hu-area" rows="8" spellcheck="false" aria-label="Daily flows"></textarea>' +
    '<div class="fc-row"><button id="fd-ex" class="tbtn tbtn--small" type="button">Load a synthetic example</button><button id="fd-clear" class="tbtn tbtn--small" type="button">Clear</button></div>' +
    '<div id="fd-sum" aria-live="polite"></div></div>' +
    '<div class="tcard"><h2>2. Design flow and energy (optional)</h2><div class="tgrid">' +
    '<label class="tfield">Design exceedance (% of time)<input id="fd-pe" type="number" step="any" value="40"></label>' +
    '<label class="tfield">Net head (m)<input id="fd-h" type="number" step="any" value="100"></label>' +
    '<label class="tfield">Overall efficiency (%)<input id="fd-eta" type="number" step="any" value="85"></label>' +
    '<label class="tfield">Environmental flow (m³/s)<input id="fd-env" type="number" step="any" value="0"></label></div>' +
    '<div id="fd-plant" aria-live="polite"></div>' +
    '<p class="thint">Energy = 9.81 · H · η · mean daily usable flow · 8760 h, where each day uses the flow above the environmental release, capped at the design flow. It ignores head-loss changes, outages and sediment shutdowns.</p></div>' +
    '<div class="tcard"><h2>3. Flow duration curve</h2><div class="tgrid"><label class="tfield">Flow axis<select id="fd-scale"><option value="lin">Linear</option><option value="log">Logarithmic</option></select></label></div>' +
    '<div id="fd-chart"></div><div id="fd-table"></div>' +
    '<p class="thint">Exceedance P = m / (n + 1) (Weibull), where m is the rank of the flow with the largest as 1. Flows between plotted points are interpolated.</p></div>';

  function example() {
    var a = [];
    for (var d = 0; d < 365; d++) {
      var q = 4.5 + 70 * Math.exp(-Math.pow((d - 205) / 38, 2)) + 1.5 * Math.sin(d * 1.3) + 1.2 * Math.sin(d * 0.37);
      a.push(Math.max(q, 1.5).toFixed(2));
    }
    return a.join('\n');
  }
  function tick(x) { return String(Number(x.toPrecision(3))); }

  function chart(c, log, pe, qd) {
    var W = 640, H = 320, m = { l: 58, r: 16, t: 12, b: 42 }, iw = W - m.l - m.r, ih = H - m.t - m.b, pts = c;
    if (c.length > 500) { var st = c.length / 500; pts = []; for (var i = 0; i < 500; i++) pts.push(c[Math.floor(i * st)]); pts.push(c[c.length - 1]); }
    var qmax = c[0].q > 0 ? c[0].q : 1, pos = c.filter(function (x) { return x.q > 0; }), qminPos = pos.length ? pos[pos.length - 1].q : 1, y0, y1;
    if (log) { y0 = Math.pow(10, Math.floor(Math.log10(qminPos))); y1 = Math.pow(10, Math.ceil(Math.log10(qmax))); if (y1 <= y0) y1 = y0 * 10; }
    else { var step = Math.pow(10, Math.floor(Math.log10(qmax))); y0 = 0; y1 = Math.ceil(qmax / step) * step; }
    function X(p) { return m.l + p / 100 * iw; }
    function Y(q) { if (log) { q = Math.max(q, y0); return m.t + ih * (1 - (Math.log10(q) - Math.log10(y0)) / (Math.log10(y1) - Math.log10(y0))); } return m.t + ih * (1 - (q - y0) / (y1 - y0)); }
    var g = '', i, ys = [];
    if (log) { for (var e = Math.log10(y0); e <= Math.log10(y1) + 1e-9; e++) ys.push(Math.pow(10, e)); } else { for (i = 0; i <= 5; i++) ys.push(y0 + (y1 - y0) * i / 5); }
    ys.forEach(function (q) { g += '<line x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + Y(q) + '" y2="' + Y(q) + '" style="stroke:var(--border)"/><text x="' + (m.l - 6) + '" y="' + (Y(q) + 4) + '" text-anchor="end" style="fill:var(--secondary);font-size:11px">' + tick(q) + '</text>'; });
    for (i = 0; i <= 100; i += 10) g += '<line x1="' + X(i) + '" x2="' + X(i) + '" y1="' + m.t + '" y2="' + (m.t + ih) + '" style="stroke:var(--border)"/><text x="' + X(i) + '" y="' + (m.t + ih + 16) + '" text-anchor="middle" style="fill:var(--secondary);font-size:11px">' + i + '</text>';
    var d = pts.map(function (x, k) { return (k ? 'L' : 'M') + X(x.p).toFixed(1) + ',' + Y(x.q).toFixed(1); }).join('');
    var mark = '';
    if (isFinite(qd) && pe > 0 && pe < 100) mark = '<line x1="' + X(pe) + '" x2="' + X(pe) + '" y1="' + m.t + '" y2="' + (m.t + ih) + '" style="stroke:var(--accent2);stroke-dasharray:5 4"/><line x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + Y(qd) + '" y2="' + Y(qd) + '" style="stroke:var(--accent2);stroke-dasharray:5 4"/><circle cx="' + X(pe) + '" cy="' + Y(qd) + '" r="4.5" style="fill:var(--accent2)"/>';
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Flow duration curve: flow against percentage of time exceeded" style="width:100%;height:auto;margin-top:12px">' + g +
      '<path d="' + d + '" style="fill:none;stroke:var(--accent);stroke-width:2.4"/>' + mark +
      '<text x="' + (m.l + iw / 2) + '" y="' + (H - 6) + '" text-anchor="middle" style="fill:var(--secondary);font-size:12px">Exceedance (% of time)</text>' +
      '<text transform="translate(14 ' + (m.t + ih / 2) + ') rotate(-90)" text-anchor="middle" style="fill:var(--secondary);font-size:12px">Flow (m³/s)</text></svg>';
  }

  function render() {
    var p = F.parse($('#fd-in').value), sum = $('#fd-sum'), plant = $('#fd-plant'), ch = $('#fd-chart'), tb = $('#fd-table');
    if (p.values.length < 2) {
      var msg = '<div class="tmsg tmsg--info">Add at least two daily flows to see the curve.</div>';
      sum.innerHTML = msg; plant.innerHTML = ''; ch.innerHTML = ''; tb.innerHTML = ''; return;
    }
    var c = F.curve(p.values), s = F.stats(p.values), pe = T.num($('#fd-pe').value), log = $('#fd-scale').value === 'log';
    var qd = isFinite(pe) && pe > 0 && pe < 100 ? F.qAt(c, pe) : NaN;
    sum.innerHTML = U.render({ rows: [['Values used', s.n, '', 0], ['Values skipped', p.skipped, '', 0], ['Record length', s.n / 365.25, 'years (if daily)', 2], ['Mean flow', s.mean, 'm³/s', 3], ['Median flow, Q50', F.qAt(c, 50), 'm³/s', 3], ['Minimum', s.min, 'm³/s', 3], ['Maximum', s.max, 'm³/s', 3]], checks: [], extra: '' });
    var h = T.num($('#fd-h').value), eta = T.num($('#fd-eta').value) / 100, env = T.num($('#fd-env').value), rows = [];
    if (isFinite(qd)) rows.push(['Design flow Q' + pe, qd, 'm³/s', 3]);
    var checks = [];
    if (isFinite(qd) && h > 0 && eta > 0 && eta <= 1 && env >= 0) {
      var pl = F.plant(p.values, qd, env, h, eta);
      rows.push(['Installed power', pl.installedKW / 1000, 'MW', 3], ['Mean usable flow', pl.meanUsedQ, 'm³/s', 3], ['Annual energy', pl.annualGWh, 'GWh', 2], ['Plant factor', pl.plantFactor * 100, '%', 1]);
      if (env >= qd) checks.push({ name: 'Environmental flow is below the design flow', ok: false, value: env, limit: qd });
    } else if (!isFinite(qd)) rows.push(['Design exceedance', 'enter a value between 0 and 100', '']);
    plant.innerHTML = U.render({ rows: rows, checks: checks, extra: '' });
    ch.innerHTML = chart(c, log, pe, qd);
    tb.innerHTML = U.table(['Exceedance', 'Flow (m³/s)'], PS.map(function (x) { return ['Q' + x + ' (' + x + '%)', F.qAt(c, x)]; }), 3);
  }

  root.addEventListener('input', render); root.addEventListener('change', render);
  $('#fd-ex').addEventListener('click', function () { $('#fd-in').value = example(); render(); });
  $('#fd-clear').addEventListener('click', function () { $('#fd-in').value = ''; render(); });
  $('#fd-in').value = example(); render();
})();
