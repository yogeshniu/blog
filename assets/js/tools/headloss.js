/* Head loss through the headworks, stage by stage, from the normal water level to the headrace entrance. */
(function () {
  var H = HydroCalc, U = HydroUI;
  U.mount({ sections: [
    { title: 'Headworks head-loss waterfall',
      intro: 'Each stage lowers the water level. The starting values are an illustrative example.',
      fields: [
        'Flow and level', ['NWL', 'Normal water level (m a.s.l.)', 598], ['Qd', 'Design discharge Q (m³/s)', 12.0], ['addPct', 'Extra discharge allowance (%)', 20],
        'Intake orifice', ['inN', 'Number of openings', 2], ['inW', 'Width (m)', 3], ['inH', 'Depth (m)', 4.4], ['inCd', 'Coefficient of discharge', 0.6],
        'Trashrack', ['rkW', 'Width (m)', 3], ['rkH', 'Height (m)', 4.4], ['rkT', 'Bar thickness (mm)', 20], ['rkB', 'Bar spacing (mm)', 100], ['rkKt', 'Rack coefficient Kt', 2.42], ['rkPhi', 'Inclination (°)', 80], ['rkN', 'Number of openings', 3], ['rkF', 'Net-area factor', 0.8],
        'Gravel trap', ['gtWT', 'Inlet average width (m)', 3.7], ['gtHT', 'Inlet average height (m)', 9.5], ['gtLi', 'Inlet transition length (m)', 0], ['gtnI', 'Inlet roughness', 0.5], ['gtW', 'Main width (m)', 5], ['gtH', 'Main water depth (m)', 4.2], ['gtL', 'Main length (m)', 8], ['gtn', "Manning's n", 0.015], ['gtC', 'Number of gravel traps', 1],
        'Approach culvert', ['acB', 'Width (m)', 3], ['acH', 'Height (m)', 2.5], ['acL', 'Length (m)', 310], ['acn', "Manning's n", 0.015], ['bif', 'Bifurcation loss (m)', 0.08],
        'Settling basin', ['igCd', 'Inlet gate coefficient', 0.2], ['ke', 'Expansion coefficient Ke', 0.08], ['sbW', 'Basin width (m)', 6.8], ['sbH', 'Basin depth (m)', 5.6], ['sbL', 'Basin length (m)', 50], ['sbN', 'Number of basins', 2], ['sbn', "Manning's n", 0.015],
        'Outlet', ['ogN', 'Gates per basin', 2], ['ogW', 'Gate width (m)', 2.4], ['ogH', 'Gate height (m)', 2.4], ['ogCd', 'Outlet gate coefficient', 0.2], ['piC', 'Pond inlet coefficient', 0.2], ['exC', 'Exit coefficient', 1]
      ],
      run: function (v) {
        return H.headworksHeadloss({ NWL: v.NWL, Qd: v.Qd, addFraction: v.addPct / 100,
          intake: { n: v.inN, w: v.inW, h: v.inH, Cd: v.inCd },
          rack: { w: v.rkW, h: v.rkH, t: v.rkT, b: v.rkB, Kt: v.rkKt, phi: v.rkPhi, nOpenings: v.rkN, areaFactor: v.rkF },
          gravel: { WT: v.gtWT, HT: v.gtHT, Li: v.gtLi, nInlet: v.gtnI, W: v.gtW, H: v.gtH, L: v.gtL, n: v.gtn, count: v.gtC },
          approach: { B: v.acB, H: v.acH, n: v.acn, L: v.acL }, bifurcationLoss: v.bif,
          inletGate: { Cd: v.igCd }, transition: { Ke: v.ke }, basin: { W: v.sbW, H: v.sbH, L: v.sbL, n: v.sbN, manning: v.sbn },
          outletGate: { n: v.ogN, w: v.ogW, h: v.ogH, Cd: v.ogCd }, pondInlet: { coeff: v.piC }, exit: { coeff: v.exC } });
      },
      rows: [['Total head loss', 'totalLoss', 'm', 3], ['Water level at headrace entrance', 'finalLevel', 'm a.s.l.', 3]],
      extra: function (r) { return U.table(['Stage', 'Loss (m)', 'Level after (m a.s.l.)'], r.stages.map(function (s) { return [s.name, s.loss, s.levelAfter]; }), 4); },
      note: 'The approach culvert friction uses the full culvert section, as is common in simple estimates. A culvert running part-full would lose slightly more.' }
  ] });
})();
