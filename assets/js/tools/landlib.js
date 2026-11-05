/* Nepali land-area units. Definitions: 1 ropani = 16 aana = 64 paisa = 256 daam = 5,476 ft²;
   1 bigha = 20 kattha = 400 dhur = 72,900 ft²; 1 ft² = 0.09290304 m² (exact). */
window.LandLib = (function () {
  var FT2 = 0.09290304, ROPANI = 5476 * FT2, BIGHA = 72900 * FT2;
  var UNITS = [['Ropani', ROPANI], ['Aana', ROPANI / 16], ['Paisa', ROPANI / 64], ['Daam', ROPANI / 256],
    ['Bigha', BIGHA], ['Kattha', BIGHA / 20], ['Dhur', BIGHA / 400],
    ['Square metre', 1], ['Square feet', FT2], ['Hectare', 10000], ['Acre', 4046.8564224]];
  function r4(x) { return Math.round(x * 1e4) / 1e4; }
  /* m² -> {ropani, aana, paisa, daam} (hill system) */
  function hill(m2) {
    var d = r4(m2 / (ROPANI / 256)), ro = Math.floor(d / 256 + 1e-9); d -= ro * 256;
    var aa = Math.floor(d / 16 + 1e-9); d -= aa * 16; var pa = Math.floor(d / 4 + 1e-9); d -= pa * 4;
    return { ropani: ro, aana: aa, paisa: pa, daam: Math.round(d * 100) / 100 };
  }
  /* m² -> {bigha, kattha, dhur} (Terai system) */
  function terai(m2) {
    var d = r4(m2 / (BIGHA / 400)), bi = Math.floor(d / 400 + 1e-9); d -= bi * 400;
    var ka = Math.floor(d / 20 + 1e-9); d -= ka * 20;
    return { bigha: bi, kattha: ka, dhur: Math.round(d * 100) / 100 };
  }
  function fromHill(r, a, p, d) { return r * ROPANI + a * ROPANI / 16 + p * ROPANI / 64 + d * ROPANI / 256; }
  function fromTerai(b, k, d) { return b * BIGHA + k * BIGHA / 20 + d * BIGHA / 400; }
  return { UNITS: UNITS, ROPANI: ROPANI, BIGHA: BIGHA, FT2: FT2, hill: hill, terai: terai, fromHill: fromHill, fromTerai: fromTerai };
})();
