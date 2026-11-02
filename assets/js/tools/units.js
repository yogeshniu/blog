/* Unit converter with hydrology units. Factors are exact definitions, relative to a base unit. */
(function () {
  var root = T.root, $ = T.$;
  var FT = 0.3048, FT3 = 0.028316846592, GAL = 0.003785411784;
  var CATS = {
    'Flow': { base: 'm³/s', u: [['m³/s', 1], ['L/s', 0.001], ['m³/h', 1 / 3600], ['m³/day', 1 / 86400], ['MCM/day', 1e6 / 86400], ['ft³/s (cfs)', FT3], ['US gal/min', GAL / 60]] },
    'Length': { base: 'm', u: [['m', 1], ['km', 1000], ['cm', 0.01], ['mm', 0.001], ['ft', FT], ['in', 0.0254], ['mile', 1609.344]] },
    'Area': { base: 'm²', u: [['m²', 1], ['hectare', 10000], ['km²', 1e6], ['ft²', FT * FT], ['acre', 4046.8564224]] },
    'Volume': { base: 'm³', u: [['m³', 1], ['litre', 0.001], ['MCM (million m³)', 1e6], ['ft³', FT3], ['acre-ft', 1233.48183754752], ['US gallon', GAL]] },
    'Pressure': { base: 'Pa', u: [['Pa', 1], ['kPa', 1000], ['MPa', 1e6], ['bar', 1e5], ['atm', 101325], ['psi', 6894.757293168], ['m of water', 9806.65]] },
    'Power': { base: 'W', u: [['W', 1], ['kW', 1000], ['MW', 1e6], ['GW', 1e9], ['horsepower', 745.69987158227]] },
    'Energy': { base: 'J', u: [['J', 1], ['kJ', 1000], ['MJ', 1e6], ['kWh', 3.6e6], ['MWh', 3.6e9], ['GWh', 3.6e12]] },
    'Speed': { base: 'm/s', u: [['m/s', 1], ['km/h', 1 / 3.6], ['mph', 0.44704], ['ft/s', FT]] },
    'Temperature': { temp: true, u: [['°C'], ['°F'], ['K']] }
  };
  var names = Object.keys(CATS), cat = 'Flow';
  function toBase(c, i, x) {
    if (CATS[c].temp) { return i === 0 ? x : i === 1 ? (x - 32) * 5 / 9 : x - 273.15; }   /* base = °C */
    return x * CATS[c].u[i][1];
  }
  function fromBase(c, i, x) {
    if (CATS[c].temp) { return i === 0 ? x : i === 1 ? x * 9 / 5 + 32 : x + 273.15; }
    return x / CATS[c].u[i][1];
  }
  function fmt(x) {
    if (!isFinite(x)) return '–';
    if (x === 0) return '0';
    var a = Math.abs(x);
    if (a >= 1e12 || a < 1e-6) return x.toExponential(6).replace(/\.?0+e/, 'e');
    return String(Number(x.toPrecision(10)));
  }
  root.innerHTML =
    '<div class="tcard"><div class="tchips" id="u-cats" role="group" aria-label="Quantity"></div>' +
    '<div class="uc-pair" style="margin-top:16px"><label class="tfield">From<input id="u-a" type="number" inputmode="decimal" step="any" value="1"><select id="u-ua" aria-label="From unit"></select></label>' +
    '<span class="uc-eq">=</span><label class="tfield">To<input id="u-b" type="number" inputmode="decimal" step="any"><select id="u-ub" aria-label="To unit"></select></label></div>' +
    '<p style="margin:14px 0 0"><button type="button" class="tbtn tbtn--small" id="u-swap">Swap units</button></p></div>' +
    '<div class="tcard"><h2 id="u-title">All conversions</h2><div class="uc-all" id="u-all"></div></div>';

  function fillUnits() {
    ['u-ua', 'u-ub'].forEach(function (id, k) {
      var s = $('#' + id); s.innerHTML = '';
      CATS[cat].u.forEach(function (u, i) { var o = document.createElement('option'); o.value = i; o.textContent = u[0]; s.appendChild(o); });
      s.value = k === 0 ? 0 : Math.min(1, CATS[cat].u.length - 1);
    });
  }
  function calc(fromA) {
    var ia = +$('#u-ua').value, ib = +$('#u-ub').value;
    if (fromA === false) {
      var y = T.num($('#u-b').value); if (isNaN(y)) { $('#u-a').value = ''; return all(NaN); }
      var bv = toBase(cat, ib, y); $('#u-a').value = fmt(fromBase(cat, ia, bv)); return all(bv);
    }
    var x = T.num($('#u-a').value); if (isNaN(x)) { $('#u-b').value = ''; return all(NaN); }
    var b = toBase(cat, ia, x); $('#u-b').value = fmt(fromBase(cat, ib, b)); all(b);
  }
  function all(b) {
    var box = $('#u-all'); box.innerHTML = '';
    if (isNaN(b)) return;
    var ia = +$('#u-ua').value, x = fromBase(cat, ia, b);
    $('#u-title').textContent = 'All conversions of ' + fmt(x) + ' ' + CATS[cat].u[ia][0];
    CATS[cat].u.forEach(function (u, i) {
      var d = document.createElement('div'), v = document.createElement('b'), n = document.createElement('span');
      v.textContent = fmt(fromBase(cat, i, b)); n.textContent = u[0]; d.appendChild(v); d.appendChild(n); box.appendChild(d);
    });
  }
  names.forEach(function (n) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'tchip'; b.textContent = n; b.setAttribute('aria-pressed', n === cat ? 'true' : 'false');
    b.addEventListener('click', function () {
      cat = n; T.$$('#u-cats .tchip').forEach(function (c) { c.setAttribute('aria-pressed', c === b ? 'true' : 'false'); });
      fillUnits(); calc(true);
    }); $('#u-cats').appendChild(b);
  });
  $('#u-a').addEventListener('input', function () { calc(true); });
  $('#u-b').addEventListener('input', function () { calc(false); });
  $('#u-ua').addEventListener('change', function () { calc(true); });
  $('#u-ub').addEventListener('change', function () { calc(true); });
  $('#u-swap').addEventListener('click', function () {
    var a = $('#u-ua').value; $('#u-ua').value = $('#u-ub').value; $('#u-ub').value = a; calc(true);
  });
  fillUnits(); calc(true);
})();
