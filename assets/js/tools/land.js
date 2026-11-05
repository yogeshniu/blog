/* Nepali land-area converter (ropani-aana-paisa-daam, bigha-kattha-dhur, m², ft², hectare, acre). */
(function () {
  var L = LandLib, U = HydroUI, esc = U.esc;
  function hillTxt(h) { return h.ropani + ' ropani, ' + h.aana + ' aana, ' + h.paisa + ' paisa, ' + h.daam + ' daam'; }
  function teraiTxt(t) { return t.bigha + ' bigha, ' + t.kattha + ' kattha, ' + t.dhur + ' dhur'; }
  function positive(x) { if (!(x >= 0)) throw new Error('Enter zero or a positive area.'); }
  U.mount({ sections: [
    { title: '1. Convert an area',
      intro: 'Type an area, pick its unit, and see it in every other unit.',
      fields: [['value', 'Area', 1], ['unit', 'Unit', 0, { opts: L.UNITS.map(function (u, i) { return [i, u[0]]; }) }]],
      run: function (v) { positive(v.value); return { results: { m2: v.value * L.UNITS[v.unit][1] }, checks: [] }; },
      rows: L.UNITS.map(function (u) { return [u[0], function (r) { return r.m2 / u[1]; }, '']; }),
      extra: function (r) { return '<p class="thint">In the hill system: ' + esc(hillTxt(L.hill(r.m2))) + '<br>In the Terai system: ' + esc(teraiTxt(L.terai(r.m2))) + '</p>'; },
      note: 'Ropani is used in the hills and mountains; bigha is used in the Terai. Check the area on your land ownership certificate (lalpurja) for legal use.' },
    { title: '2. Ropani, aana, paisa, daam to metric',
      fields: [['r', 'Ropani', 1], ['a', 'Aana', 0], ['p', 'Paisa', 0], ['d', 'Daam', 0]],
      run: function (v) {
        positive(v.r); positive(v.a); positive(v.p); positive(v.d);
        var m2 = L.fromHill(v.r, v.a, v.p, v.d);
        return { results: { m2: m2, t: teraiTxt(L.terai(m2)) }, checks: [
          { name: 'Aana is below 16', ok: v.a < 16, value: v.a, limit: 16 }, { name: 'Paisa is below 4', ok: v.p < 4, value: v.p, limit: 4 }, { name: 'Daam is below 4', ok: v.d < 4, value: v.d, limit: 4 }] };
      },
      rows: [['Square metres', 'm2', 'm²', 2], ['Square feet', function (r) { return r.m2 / L.FT2; }, 'ft²', 1], ['Hectare', function (r) { return r.m2 / 10000; }, 'ha', 5], ['Acre', function (r) { return r.m2 / 4046.8564224; }, 'acre', 5], ['Terai system', 't', '']],
      note: '1 ropani = 16 aana = 64 paisa = 256 daam = 5,476 ft² (about 508.7 m²).' },
    { title: '3. Bigha, kattha, dhur to metric',
      fields: [['b', 'Bigha', 1], ['k', 'Kattha', 0], ['d', 'Dhur', 0]],
      run: function (v) {
        positive(v.b); positive(v.k); positive(v.d);
        var m2 = L.fromTerai(v.b, v.k, v.d);
        return { results: { m2: m2, h: hillTxt(L.hill(m2)) }, checks: [
          { name: 'Kattha is below 20', ok: v.k < 20, value: v.k, limit: 20 }, { name: 'Dhur is below 20', ok: v.d < 20, value: v.d, limit: 20 }] };
      },
      rows: [['Square metres', 'm2', 'm²', 2], ['Square feet', function (r) { return r.m2 / L.FT2; }, 'ft²', 1], ['Hectare', function (r) { return r.m2 / 10000; }, 'ha', 5], ['Acre', function (r) { return r.m2 / 4046.8564224; }, 'acre', 5], ['Hill system', 'h', '']],
      note: '1 bigha = 20 kattha = 400 dhur = 72,900 ft² (about 6,772.6 m²).' }
  ] });
})();
