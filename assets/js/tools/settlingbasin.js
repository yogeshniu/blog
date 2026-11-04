/* Settling basin (desander) design. Formulas: Camp / Vetter, DoED guidelines, Mosonyi; ported from a run-of-river headworks design workbook. */
(function () {
  var H = HydroCalc;
  HydroUI.mount({ sections: [
    { title: '1. Basin size, trap efficiency and sediment storage',
      intro: 'Continuous-flow settling basin, calculated per bay. The starting values are an illustrative example.',
      fields: [
        'Flow and particle',
        ['Q', 'Design discharge Q (m³/s)', 12.0], ['flushPct', 'Flushing allowance (%)', 10], ['nBays', 'Number of bays', 2],
        ['d_mm', 'Limiting particle size d (mm)', 0.2], ['w', 'Fall velocity w of that particle (m/s)', 0.025], ['conc_ppm', 'Sediment concentration (mg/l)', 4800],
        'Basin geometry',
        ['B', 'Width of each bay B (m)', 6.8], ['Hb', 'Adopted flow depth H (m)', 5.6], ['Lprov', 'Adopted basin length L (m)', 50], ['n', "Manning's n", 0.015],
        'Sediment storage and hopper',
        ['flushHours', 'Flushing interval (h)', 8], ['rhoS', 'Sediment density (kg/m³)', 2600], ['packing', 'Packing factor', 0.5],
        ['hopperAngleDeg', 'Hopper side slope (° from horizontal)', 45], ['hopperBottomW', 'Hopper bottom width (m)', 0.9],
        'Inlet transition',
        ['transitionAngleDeg', 'Transition angle (°)', 11], ['feederWidth', 'Feeder canal width at gate (m)', 1.8], ['adoptedTransitionLength', 'Adopted transition length (m)', 15]
      ],
      run: function (v) { v.flushFraction = v.flushPct / 100; return H.settlingBasin(v); },
      rows: [
        ['Flow per bay Qb', 'Qb', 'm³/s'], ['Camp critical velocity Vc', 'Vc', 'm/s', 4], ['Minimum flow depth', 'Hmin', 'm'],
        ['Horizontal velocity V', 'V', 'm/s', 4], ['Length required, H·V/w', 'Lreq', 'm'], ['Length required with shear, H·V/(w − u*)', 'LreqShear', 'm'],
        ['L / B', 'LoverB', ''], ['Shear velocity u*', 'ustarEmp', 'm/s', 5], ['w·As / Qb', 'wAsQ', ''],
        ['Trap efficiency (Vetter)', function (r) { return r.etaVetter * 100; }, '%', 1],
        ['Sediment per bay between flushes', 'sedimentLoadKg', 'kg', 0], ['Sediment volume', 'Vsed', 'm³', 1],
        ['Hopper depth', 'hopperDepth', 'm', 2], ['Hopper area', 'hopperArea', 'm²', 2], ['Extra depth above hopper', 'extraDepth', 'm', 2],
        ['Total storage depth', 'storageDepth', 'm', 2], ['Inlet transition length', 'Ltrans', 'm'],
        ['Bed shear stress τo', 'tau0', 'N/m²', 4], ['Critical shear stress τc', 'tauC', 'N/m²', 4]
      ],
      note: "Fall velocity w comes from a fall-velocity graph or table for your particle size and water temperature (about 0.02 to 0.025 m/s for 0.2 mm sand, depending on the source). Camp's graph can give a higher efficiency than Vetter's equation." },
    { title: '2. Sediment-flushing orifice',
      fields: [['width', 'Orifice width (m)', 0.9], ['depth', 'Orifice depth (m)', 1.5], ['headAbove', 'Water depth above orifice crest (m)', 8.6], ['Cd', 'Orifice coefficient', 0.7], ['bedSlope', 'Bed slope (m/m)', 0.025], ['Qflush', 'Flushing discharge required (m³/s)', 1.2]],
      run: function (v) { return H.flushingOrifice(v); },
      rows: [['Orifice area', 'area', 'm²'], ['Discharge capacity', 'Qcap', 'm³/s'], ['Hydraulic radius', 'R', 'm', 3], ['Largest particle flushed', 'dFlush_mm', 'mm', 1]],
      note: 'Flushable particle size d = 11 · R · S (in mm, with R in m).' }
  ] });
})();
