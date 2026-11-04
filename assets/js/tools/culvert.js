/* Culvert / canal normal depth (Manning), friction loss and self-cleansing velocity. */
(function () {
  var H = HydroCalc, U = HydroUI;
  U.mount({ sections: [
    { title: '1. Flow depth in a rectangular culvert',
      intro: 'Solves Manning for the normal depth, so there is no need to adjust a trial value by hand.',
      fields: [['Qd', 'Design discharge Q (m³/s)', 12.0], ['flushPercent', 'Flushing allowance (%)', 10], ['nCulverts', 'Number of culverts', 1], ['B', 'Width B (m)', 3], ['H', 'Height H (m)', 2.5], ['n', "Manning's n", 0.015], ['L', 'Length L (m)', 310], ['slopeOneIn', 'Bed slope (1 in N)', 500], ['dMax_mm', 'Largest particle to carry (mm)', 25]],
      run: function (v) { return H.culvert(v); },
      rows: [['Total discharge', 'Qtot', 'm³/s'], ['Discharge per culvert', 'Q', 'm³/s'], ['Normal depth y', 'y', 'm', 3], ['Velocity', 'v', 'm/s', 3], ['Froude number', 'Fr', '', 3], ['Specific energy', 'E', 'm', 3], ['Friction loss over length', 'hf', 'm', 3], ['Freeboard', 'freeboard', 'm', 3], ['Capacity flowing full', 'Qfull', 'm³/s', 2], ['Self-cleansing velocity', 'Vmin', 'm/s', 3]],
      note: 'Self-cleansing velocity is the larger of the ACI (0.155·√d) and Chailly formulas, with d in mm. The 0.3 m freeboard is a design preference, so use your guideline value.' },
    { title: '2. Compare bed slopes (culvert flowing full)',
      fields: [['B', 'Width B (m)', 3], ['H', 'Height H (m)', 2.5], ['n', "Manning's n", 0.015], ['L', 'Length L (m)', 310], ['slopes', 'Slopes to compare (1 in N, separated by commas)', '200, 300, 400, 500, 750, 1000', { text: true }]],
      run: function (v) {
        var s = v.slopes.split(/[\s,;]+/).map(Number).filter(function (x) { return isFinite(x) && x > 0; });
        if (!s.length) throw new Error('Type at least one slope, for example 500.');
        return { results: { t: H.culvertSlopeTable({ B: v.B, H: v.H, n: v.n, L: v.L, slopes: s }) }, checks: [] };
      },
      rows: [],
      extra: function (r) { return U.table(['Slope 1 in', 'Velocity (m/s)', 'Full-flow capacity (m³/s)', 'Friction loss (m)'], r.t.map(function (x) { return [x.slopeOneIn, x.v, x.Qfull, x.hf]; }), 3); } }
  ] });
})();
