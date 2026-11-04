/* Gravel trap design. Same settling-basin method as the desander, with coarse-particle inputs (Mosonyi, ITDG, DoED). */
(function () {
  var H = HydroCalc, U = HydroUI;
  U.mount({ sections: [
    { title: '1. Gravel trap size and sediment storage',
      intro: 'Calculated per bay. The starting values are an illustrative example.',
      fields: [
        'Flow and particle',
        ['Q', 'Design discharge Q (m³/s)', 12.0], ['flushPct', 'Flushing allowance (%)', 20], ['nBays', 'Number of bays', 2],
        ['d_mm', 'Limiting particle size d (mm)', 5], ['w', 'Fall velocity w (m/s)', 0.5], ['conc_ppm', 'Sediment concentration (mg/l)', 580],
        'Geometry',
        ['B', 'Width of each bay B (m)', 3.7], ['Hb', 'Adopted flow depth H (m)', 4.4], ['Lprov', 'Adopted length L (m)', 5], ['n', "Manning's n", 0.015],
        'Storage',
        ['flushHours', 'Flushing interval (h)', 1], ['rhoS', 'Sediment density (kg/m³)', 1920], ['packing', 'Packing factor', 0.5],
        ['hopperAngleDeg', 'Hopper side slope (° from horizontal)', 40], ['hopperBottomW', 'Hopper bottom width (m)', 0.6]
      ],
      run: function (v) { v.flushFraction = v.flushPct / 100; v.extras = false; v.LBmin = 0.4; return H.settlingBasin(v); },
      rows: [
        ['Flow per bay Qb', 'Qb', 'm³/s'], ['Camp critical velocity Vc', 'Vc', 'm/s', 4], ['Minimum flow depth', 'Hmin', 'm'],
        ['Horizontal velocity V', 'V', 'm/s', 4], ['Length required', 'Lreq', 'm'], ['L / B', 'LoverB', ''],
        ['Sediment volume per bay', 'Vsed', 'm³', 2], ['Hopper depth', 'hopperDepth', 'm', 2], ['Hopper area', 'hopperArea', 'm²', 2],
        ['Extra depth above hopper', 'extraDepth', 'm', 2], ['Total storage depth', 'storageDepth', 'm', 2]
      ],
      note: 'The sediment concentration is an assumption; confirm it from your own sediment data.' },
    { title: '2. Flushing opening and flushing pipes',
      fields: [
        ['Qflush', 'Flushing discharge (m³/s)', 1.2], ['waterLevel', 'Water level in trap (m a.s.l.)', 594], ['invertAtHopper', 'Invert at hopper bottom (m a.s.l.)', 588.1],
        ['nPipes', 'Number of pipes', 2], ['pipeD', 'Pipe diameter (m)', 0.5], ['f', 'Friction factor f', 0.013],
        ['L1', 'Pipe 1 length (m)', 7.5], ['s1', 'Pipe 1 slope (m/m)', 0.1], ['L2', 'Pipe 2 length (m)', 3.8], ['s2', 'Pipe 2 slope (m/m)', 0.25]
      ],
      run: function (v) { return H.gravelTrapFlushing({ Qflush: v.Qflush, waterLevel: v.waterLevel, invertAtHopper: v.invertAtHopper, nPipes: v.nPipes, pipeD: v.pipeD, f: v.f, pipes: [{ L: v.L1, slope: v.s1 }, { L: v.L2, slope: v.s2 }] }); },
      rows: [['Available head', 'head', 'm', 2], ['Required opening area', 'Areq', 'm²', 4], ['Inlet velocity', 'Vinlet', 'm/s', 2], ['Velocity in each pipe', 'vp', 'm/s', 2]],
      extra: function (r) { return U.table(['Pipe', 'Length (m)', 'Slope', 'Friction loss hf (m)', 'Required slope (1 in N)'], r.pipeRes.map(function (p, i) { return [String(i + 1), p.L, p.slope, p.hf, p.requiredSlopeOneIn]; }), 3); } }
  ] });
})();
