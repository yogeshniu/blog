/* Headpond storage and headpond spillway (overflow weir plus chute, Manning). */
(function () {
  var H = HydroCalc;
  HydroUI.mount({ sections: [
    { title: '1. Headpond storage and submergence',
      fields: [['Qd', 'Design discharge Q (m³/s)', 12.0], ['flushPercent', 'Flushing allowance (%)', 10], ['NWL', 'Normal water level (m a.s.l.)', 598], ['freeboard', 'Freeboard (m)', 1], ['pipeD', 'Headrace pipe diameter (m)', 2.2], ['supplyMinutes', 'Supply time (min)', 2], ['vPond', 'Flow velocity in pond (m/s)', 0.4],
        ['width', 'Pond width (m)', 15], ['depth', 'Pond depth (m)', 13.0], ['length', 'Pond length (m)', 14.5], ['providedSubmergence', 'Submergence provided (m)', 4.2], ['adoptedSubmergenceReq', 'Submergence required (m, from the intake tool)', 4.09], ['settlingVolume', 'Settling-basin volume counted (m³)', 1904]],
      run: function (v) { return H.headpond(v); },
      rows: [['Total discharge', 'Qtot', 'm³/s'], ['Storage required', 'Vreq', 'm³', 0], ['Storage provided', 'Vprov', 'm³', 0], ['Velocity in headrace pipe', 'vp', 'm/s', 3], ['Submergence, 1.5 v²/2g', 'hs', 'm', 3], ['Flow depth in pond', 'flowDepth', 'm', 3], ['Side-wall level', 'sideWallRL', 'm a.s.l.', 2], ['Pond plus settling basin', 'totalWithSettling', 'm³', 0]] },
    { title: '2. Headpond spillway',
      fields: [['Q', 'Spill discharge Q (m³/s)', 12.0], ['Lw', 'Weir crest length (m)', 30], ['Cd', 'Weir coefficient Cd', 1.7], ['Hprov', 'Head you provide over the crest (m)', 0.7], ['b', 'Chute width (m)', 2], ['slopeOneIn', 'Chute slope (1 in N)', 1000], ['n', "Manning's n", 0.015], ['freeboard', 'Freeboard (m)', 0.5]],
      run: function (v) { v.S0 = 1 / v.slopeOneIn; return H.headpondSpillway(v); },
      rows: [['Head required over weir', 'Hreq', 'm', 3], ['Normal depth in chute', 'yn', 'm', 3], ['Velocity', 'V', 'm/s', 3], ['Critical depth', 'yc', 'm', 3], ['Froude number', 'Fr', '', 3], ['Critical slope Sc', 'Sc', '', 5], ['Flow regime', 'regime', ''], ['Wall height required', 'wallHeight', 'm', 2]] }
  ] });
})();
