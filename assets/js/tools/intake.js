/* Intake opening, trashrack and submergence. Sources: Mosonyi (trashrack), Gordon / Prosser / ITDG / Knauss (submergence). */
(function () {
  var H = HydroCalc;
  HydroUI.mount({ sections: [
    { title: '1. Intake opening and trashrack',
      fields: [
        'Intake', ['Qd', 'Design discharge Q (m³/s)', 12.0], ['flushPct', 'Flushing allowance (%)', 20], ['nOpenings', 'Number of openings', 2],
        ['openingH', 'Opening height (m)', 3], ['openingW', 'Opening width (m)', 3.1], ['lowestRegWL', 'Lowest regulating water level (m a.s.l.)', 594], ['minSubmergence', 'Minimum submergence (m)', 1.5],
        'Trashrack', ['nRacks', 'Number of trashracks', 2], ['barT_mm', 'Bar thickness t (mm)', 12], ['clearSpace_mm', 'Clear space between bars b (mm)', 100],
        ['rackAngleDeg', 'Inclination from horizontal (°)', 85], ['Cs', 'Surface area coefficient Cs', 1], ['rackHeight', 'Rack vertical height (m)', 3], ['rackWidth', 'Rack width (m)', 3], ['Vmax', 'Maximum approach velocity (m/s)', 1.1]
      ],
      run: function (v) { v.flushFraction = v.flushPct / 100; return H.intake(v); },
      rows: [
        ['Discharge through intake', 'QT', 'm³/s'], ['Intake invert level', 'invert', 'm a.s.l.', 2], ['Opening area', 'area', 'm²', 2], ['Velocity through openings', 'v', 'm/s', 3],
        ['Discharge per rack', 'Qrack', 'm³/s', 2], ['Gross rack area required', 'AtReq', 'm²', 2], ['Rack width required', 'WrackReq', 'm', 3],
        ['Number of bars', 'nBars', ''], ['Net width between bars', 'Wnet', 'm', 3], ['Net rack area', 'Anet', 'm²', 2], ['Approach velocity at rack', 'Vapproach', 'm/s', 3],
        ['Submergence, Gordon (SI)', 'SgordonSI', 'm', 3]
      ],
      note: 'Opening velocity should be 0.6 to 1.4 m/s. Gordon submergence S = 0.545 · v · √d is the SI form (symmetric approach).' },
    { title: '2. Submergence at a pipe or tunnel intake',
      intro: 'Four methods; the largest value is adopted.',
      fields: [['Q', 'Discharge Q (m³/s)', 12.0], ['D', 'Pipe diameter D (m)', 2.2], ['symmetric', 'Approach flow', 1, { opts: [[1, 'Symmetrical'], [0, 'Unsymmetrical']] }]],
      run: function (v) { return H.pipeSubmergence({ Q: v.Q, D: v.D, symmetric: v.symmetric === 1 }); },
      rows: [['Flow velocity', 'v', 'm/s', 3], ['Froude number', 'Fr', '', 3], ['Gordon', 'gordon', 'm', 3], ['Prosser (1.5 D)', 'prosser', 'm', 3], ['ITDG (1.5 v²/2g)', 'itdg', 'm', 3], ['Knauss, D(2Fr + 0.5)', 'knauss', 'm', 3], ['Adopted submergence', 'adopted', 'm', 3]] },
    { title: '3. Air vent pipe',
      fields: [['Q', 'Discharge Q (m³/s)', 12.0], ['airPct', 'Air flow (% of Q)', 22], ['c', 'Air inlet coefficient c', 0.5], ['t_mm', 'Conduit thickness t (mm)', 8], ['d', 'Conduit diameter d (m)', 2.1], ['safety', 'Collapse safety factor s', 3.5]],
      run: function (v) { return H.airVent({ Q: v.Q, airFraction: v.airPct / 100, c: v.c, t: v.t_mm / 1000, d: v.d, safety: v.safety }); },
      rows: [['Air flow', 'Qair', 'm³/s', 3], ['Vent area', 'A', 'm²', 4], ['Vent diameter', function (r) { return r.diameter * 1000; }, 'mm', 0]] }
  ] });
})();
