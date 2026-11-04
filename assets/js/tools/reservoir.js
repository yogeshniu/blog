/* Reservoir storage between two levels from an area-elevation table, and the peaking hours it supports. */
(function () {
  var H = HydroCalc;
  var SAMPLE = '552, 0\n553, 1474\n554, 1965\n555, 2456\n556, 3111\n557, 3766\n558, 4421\n559, 5076\n560, 5732\n561, 7205\n562, 8679\n563, 10153\n564, 11626\n565, 13100\n566, 15229\n567, 17358\n568, 19487\n569, 21616\n570, 23745\n571, 26529';
  function parse(t) {
    var p = t.split(/\n/).map(function (l) { return l.trim().split(/[\s,;]+/).map(Number); })
      .filter(function (a) { return a.length >= 2 && isFinite(a[0]) && isFinite(a[1]); }).map(function (a) { return { elev: a[0], area: a[1] }; });
    if (p.length < 2) throw new Error('Give at least two lines of "elevation, area".');
    for (var i = 1; i < p.length; i++) if (p[i].elev <= p[i - 1].elev) throw new Error('Elevations must increase from line to line.');
    return p;
  }
  HydroUI.mount({ sections: [
    { title: 'Peaking storage and reservoir volume',
      intro: 'Compares the storage needed for peaking with the usable volume between the lowest and highest regulating levels (trapezoidal rule).',
      fields: [['Qpeak', 'Peak plant discharge (m³/s)', 80], ['Qmin', 'Minimum river flow (m³/s)', 23.5], ['hours', 'Peaking hours wanted (h)', 4], ['lwl', 'Lowest regulating level (m a.s.l.)', 558], ['hwl', 'Highest regulating level (m a.s.l.)', 571],
        ['curve', 'Area-elevation table: one line per level, "elevation, area (m²)"', SAMPLE, { text: true, rows: 8 }]],
      run: function (v) {
        if (!(v.hwl > v.lwl)) throw new Error('The highest level must be above the lowest level.');
        var r = H.reservoirStorage({ curve: parse(v.curve), lwl: v.lwl, hwl: v.hwl, Qpeak: v.Qpeak, Qmin: v.Qmin });
        r.results.required = H.peakingStorage({ Qpeak: v.Qpeak, Qmin: v.Qmin, hours: v.hours });
        r.checks = [{ name: 'Peaking hours supported by the storage', ok: r.results.peakingHours >= v.hours, value: r.results.peakingHours, limit: v.hours }];
        return r;
      },
      rows: [['Storage needed for the wanted hours', 'required', 'm³', 0], ['Usable storage between the levels', 'volume', 'm³', 0], ['Peaking hours supported', 'peakingHours', 'h', 2]],
      note: 'Pre-filled with an example table (area in m² at each metre of elevation); replace it with your own. Only the slices between your two levels are counted.' }
  ] });
})();
