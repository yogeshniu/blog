/* Gated overflow spillway, ogee profile, stilling basin, ski-jump and cavitation check.
   Sources: USBR Design of Small Dams / Gravity Dams (1976), S.K. Garg, DoED guidelines, Foroudi and Barati (2022). */
(function () {
  var H = HydroCalc, U = HydroUI;
  U.mount({ sections: [
    { title: '1. Gated overflow spillway: crest length and gate width',
      fields: [['Qflood', 'Design flood Q (m³/s)', 3900], ['hfl', 'High flood level (m a.s.l.)', 726.5], ['crest', 'Spillway crest level (m a.s.l.)', 719], ['upstreamApron', 'Upstream apron level (m a.s.l.)', 712],
        ['Co', 'Discharge coefficient Co', 1.7], ['kk', 'Combined correction k1·k2·k3·k4', 1], ['nPiers', 'Number of piers N', 3], ['Kp', 'Pier contraction Kp', 0.01], ['Ka', 'Abutment contraction Ka', 0.02], ['gateWidthProvided', 'Gate width you plan to provide (m)', 6]],
      run: function (v) { v.k = [v.kk, 1, 1, 1]; return H.gatedSpillway(v); },
      rows: [['Head over crest Ho', 'Ho', 'm', 2], ['Crest-to-apron height P', 'P', 'm', 2], ['Coefficient C', 'C', '', 3], ['Effective length Le', 'Le', 'm', 2], ['Crest length Lo (simplified)', 'Lo', 'm', 1], ['Crest length Lo (N·Kp form)', 'Lo_strict', 'm', 2], ['Number of gates', 'nGates', ''], ['Width required per gate', 'widthRequired', 'm', 2], ['Specific discharge q', 'qSpecific', 'm³/s/m', 2]],
      note: 'Lo = Le + 2(Kp + Ka)·Ho is the common simplified method; the stricter USBR form multiplies Kp by the number of piers.' },
    { title: '2. Ogee crest profile',
      fields: [['H', 'Design head H (m)', 7.5], ['K', 'Constant K (2 for a vertical upstream face)', 2], ['n', 'Exponent n', 1.85], ['xMax', 'Profile length x (m)', 16]],
      run: function (v) { return { results: H.ogeeProfile({ H: v.H, K: v.K, n: v.n, xMax: v.xMax }), checks: [] }; },
      rows: [['Radius r1 = 0.5 H', 'r1', 'm', 2], ['Radius r2 = 0.2 H', 'r2', 'm', 2], ['a = 0.175 H', 'a', 'm', 3], ['b = 0.282 H', 'b', 'm', 3]],
      extra: function (r) { return U.table(['x (m)', 'y (m)'], r.points.map(function (p) { return [p.x, p.y]; }), 3); } },
    { title: '3. Hydraulic jump stilling basin',
      intro: 'Finds the supercritical depth y1 from the energy balance, then the sequent depth, jump loss and basin length.',
      fields: [['Q', 'Flood discharge Q (m³/s)', 470], ['L', 'Weir crest length (m)', 20], ['crestElev', 'Weir crest level (m a.s.l.)', 171], ['upstreamApron', 'Upstream apron level (m a.s.l.)', 142], ['He', 'Effective head incl. velocity head (m)', 7.5],
        ['dsBedElev', 'Downstream river bed level (m a.s.l.)', 142], ['dsDepth', 'Downstream water depth (m)', 6.2], ['dsWidth', 'Downstream flow width (m)', 26], ['basinFloorDrop', 'Floor drop below jump level (m)', 4.5], ['providedLength', 'Provided basin length (m)', 60]],
      run: function (v) { return H.stillingBasin(v); },
      rows: [['Unit discharge q', 'q', 'm³/s/m', 2], ['Critical depth yc', 'yc', 'm', 3], ['Upstream energy level', 'usTEL', 'm', 2], ['Downstream energy level', 'dsTEL', 'm', 2], ['Energy before jump Ef1', 'Ef1', 'm', 2], ['Depth before jump y1', 'y1', 'm', 3], ['Froude number Fr1', 'Fr1', '', 2], ['Sequent depth y2', 'y2', 'm', 3], ['Energy lost in jump', 'HL', 'm', 2], ['Basin floor level', 'floorElev', 'm a.s.l.', 2], ['Basin length required, 5(y2 − y1)', 'Lreq', 'm', 2],
        ['Chute block width', 'chuteBlock.w', 'm', 3], ['Chute block spacing', 'chuteBlock.spacing', 'm', 3], ['Dentated sill', 'dentatedSill', 'm', 3]],
      note: 'USBR Type IV proportions: chute block width w = y1, spacing 2.5 y1, dentated sill 1.25 y1.' },
    { title: '4. Ski-jump bucket throw distance',
      fields: [['waterLevel', 'Reservoir water level (m a.s.l.)', 184], ['lipInvert', 'Bucket lip invert (m a.s.l.)', 160], ['lipAngleDeg', 'Lip angle (°)', 30], ['lipToTailwater', 'Lip level above tailwater Y (m)', 12.2]],
      run: function (v) { return H.skiJump(v); },
      rows: [['Velocity at lip', 'V', 'm/s', 2], ['Velocity head', 'Hv', 'm', 2], ['Horizontal throw distance X', 'X', 'm', 2]] },
    { title: '5. Cavitation index on the spillway surface',
      fields: [['hfl', 'High flood level (m a.s.l.)', 184], ['invert', 'Spillway invert at end of curve (m a.s.l.)', 170], ['pVapour', 'Vapour pressure (Pa; 3170 at 25 °C)', 3170]],
      run: function (v) { return H.cavitation(v); },
      rows: [['Pressure', 'P', 'Pa', 0], ['Velocity', 'V', 'm/s', 2], ['Cavitation index σ', 'sigma', '', 3], ['Design consideration', 'action', '']],
      note: 'σ above 1.80: no protection; 0.25 to 1.80: smooth the surface; 0.17 to 0.25: change the geometry; 0.12 to 0.17: air galleries; below 0.12: redesign.' }
  ] });
})();
