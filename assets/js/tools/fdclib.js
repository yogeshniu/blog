/* Flow duration curve: Weibull plotting position P = m/(n+1), m = rank of the flow (largest = 1). */
window.FdcLib = (function () {
  /* Text -> flows. Takes the last number on each line, so "date, flow" and plain lists both work.
     A first line that is not a number is treated as a header. Negative or missing values are skipped and counted. */
  function parse(text) {
    var vals = [], skipped = 0, lines = String(text || '').split(/\r?\n/), first = true;
    lines.forEach(function (ln) {
      var t = ln.trim(); if (!t) return;
      var toks = t.split(/[,;\t ]+/).filter(Boolean), x = Number(toks[toks.length - 1]);
      if (!isFinite(x)) { if (!first) skipped++; first = false; return; }
      first = false;
      if (x < 0) { skipped++; return; }
      vals.push(x);
    });
    return { values: vals, skipped: skipped };
  }
  function curve(values) {
    var s = values.slice().sort(function (a, b) { return b - a; }), n = s.length;
    return s.map(function (q, i) { return { p: (i + 1) / (n + 1) * 100, q: q }; });
  }
  /* flow equalled or exceeded p % of the time (linear interpolation between plotted points) */
  function qAt(c, p) {
    var n = c.length; if (!n) return NaN;
    if (p <= c[0].p) return c[0].q; if (p >= c[n - 1].p) return c[n - 1].q;
    var lo = 0, hi = n - 1; while (hi - lo > 1) { var mid = (lo + hi) >> 1; if (c[mid].p <= p) lo = mid; else hi = mid; }
    return c[lo].q + (c[hi].q - c[lo].q) * (p - c[lo].p) / (c[hi].p - c[lo].p);
  }
  function stats(values) {
    var n = values.length, sum = 0, mn = Infinity, mx = -Infinity;
    values.forEach(function (v) { sum += v; if (v < mn) mn = v; if (v > mx) mx = v; });
    return { n: n, mean: n ? sum / n : NaN, min: mn, max: mx };
  }
  /* Simple plant energy from the daily record: each day uses min(max(Q - Qenv, 0), Qd). P(kW) = 9.81 Q H eta. */
  function plant(values, Qd, Qenv, head, eta) {
    var k = 9.81 * head * eta, n = values.length, sumQ = 0;
    values.forEach(function (q) { sumQ += Math.min(Math.max(q - Qenv, 0), Qd); });
    var meanQ = n ? sumQ / n : NaN, installed = k * Qd, annualMWh = k * meanQ * 8760 / 1000;
    return { installedKW: installed, meanUsedQ: meanQ, annualGWh: annualMWh / 1000, plantFactor: installed > 0 ? (k * meanQ) / installed : NaN };
  }
  return { parse: parse, curve: curve, qAt: qAt, stats: stats, plant: plant };
})();
