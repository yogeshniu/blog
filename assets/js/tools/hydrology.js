/* Hydrology formulas with small calculators. Formulas: Rational method (ASCE), Kirpich (1940), SCS curve number (USDA NRCS), Gumbel EV1 (Chow, 1951). */
(function () {
  var Hy = HydrologyLib;
  HydroUI.mount({ sections: [
    { title: 'Rational method: peak flow from rainfall', intro: 'Q = C · i · A / 360   (Q in m³/s, i in mm/h, A in hectares)',
      fields: [['C', 'Runoff coefficient C', 0.5], ['i', 'Rainfall intensity i (mm/h)', 50], ['A', 'Catchment area A (ha)', 100]],
      run: function (v) { if (v.C < 0 || v.C > 1) throw new Error('C must be between 0 and 1.'); return { results: { Q: Hy.rational(v.C, v.i, v.A) }, checks: [] }; },
      rows: [['Peak flow Q', 'Q', 'm³/s', 3]],
      note: 'Suited to small catchments. Typical C: paved surfaces 0.70 to 0.95, grassed areas 0.05 to 0.35. Use the intensity for a duration equal to the time of concentration.' },
    { title: 'Time of concentration (Kirpich)', intro: 'tc = 0.0195 · L^0.77 · S^−0.385   (tc in minutes, L in m, S in m/m)',
      fields: [['L', 'Main flow path length L (m)', 1200], ['Sp', 'Average slope (%)', 2.5]],
      run: function (v) { if (!(v.L > 0 && v.Sp > 0)) throw new Error('Length and slope must be above zero.'); return { results: { tc: Hy.kirpich(v.L, v.Sp / 100) }, checks: [] }; },
      rows: [['Time of concentration', 'tc', 'min', 1], ['Time of concentration', function (r) { return r.tc / 60; }, 'h', 2]],
      note: 'Developed for small agricultural catchments; results for steep or very large catchments are rough.' },
    { title: 'SCS curve number: runoff depth', intro: 'S = 25400/CN − 254;  Ia = λ·S;  Q = (P − Ia)² / (P − Ia + S)   (all in mm)',
      fields: [['P', 'Storm rainfall P (mm)', 100], ['CN', 'Curve number CN', 75], ['lambda', 'Initial abstraction ratio λ', 0.2], ['A', 'Catchment area (km²)', 10]],
      run: function (v) {
        if (!(v.CN > 0 && v.CN <= 100)) throw new Error('CN must be above 0 and at most 100.');
        var r = Hy.scs(v.P, v.CN, v.lambda); r.vol = r.Q * v.A * 1000; r.coef = v.P > 0 ? r.Q / v.P : 0;
        return { results: r, checks: [{ name: 'Curve number in the usual range 30 to 98', ok: v.CN >= 30 && v.CN <= 98, value: v.CN, limit: '30-98' }] };
      },
      rows: [['Potential retention S', 'S', 'mm', 2], ['Initial abstraction Ia', 'Ia', 'mm', 2], ['Runoff depth Q', 'Q', 'mm', 2], ['Runoff ratio Q / P', 'coef', '', 3], ['Runoff volume', 'vol', 'm³', 0]],
      note: 'Assumes average antecedent moisture. Pick CN from land use and soil group tables (USDA NRCS).' },
    { title: 'Gumbel flood frequency', intro: 'K = −(√6/π)·[0.5772 + ln ln(T/(T − 1))];  Q_T = mean + K · standard deviation',
      fields: [['mean', 'Mean of annual maximum flows (m³/s)', 250], ['sd', 'Standard deviation (m³/s)', 80], ['T', 'Return period T (years)', 100]],
      run: function (v) { if (!(v.T > 1)) throw new Error('Return period must be above 1 year.'); return { results: Hy.gumbel(v.mean, v.sd, v.T), checks: [] }; },
      rows: [['Frequency factor K', 'K', '', 4], ['Flood of return period T', 'QT', 'm³/s', 1]],
      note: 'This uses the mean and standard deviation of your annual maximum series directly. A short record gives an uncertain estimate for long return periods.' },
    { title: 'Return period and risk', intro: 'R = 1 − (1 − 1/T)^n   (chance of at least one T-year event in n years)',
      fields: [['T', 'Return period T (years)', 100], ['n', 'Design life n (years)', 50], ['risk', 'Acceptable risk (%)', 10]],
      run: function (v) {
        if (!(v.T > 1 && v.n > 0 && v.risk > 0 && v.risk < 100)) throw new Error('Check the values: T above 1, n above 0, risk between 0 and 100.');
        return { results: { R: Hy.risk(v.T, v.n) * 100, Tn: Hy.returnPeriodFor(v.risk / 100, v.n) }, checks: [] };
      },
      rows: [['Chance of exceedance within n years', 'R', '%', 1], ['Return period needed for the acceptable risk', 'Tn', 'years', 0]] },
    { title: 'Transfer flow by catchment area', intro: 'Q_site = Q_gauged · (A_site / A_gauged)^b',
      fields: [['Qg', 'Flow at gauged site (m³/s)', 150], ['Ag', 'Gauged catchment area (km²)', 500], ['As', 'Site catchment area (km²)', 320], ['b', 'Exponent b', 1]],
      run: function (v) { if (!(v.Ag > 0 && v.As > 0)) throw new Error('Areas must be above zero.'); return { results: { Q: Hy.areaRatio(v.Qg, v.Ag, v.As, v.b) }, checks: [] }; },
      rows: [['Flow at site', 'Q', 'm³/s', 2], ['Specific flow at site', function (r, v) { return r.Q / v.As * 1000; }, 'L/s/km²', 1]],
      note: 'b = 1 is usual for mean flows; floods often use a smaller exponent. Use b from your region or guideline, and avoid transfers across very different catchments.' }
  ] });
})();
