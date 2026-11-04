/* Nepali (Bikram Sambat) calendar with English dates alongside. Needs bs.js (window.BS). */
(function () {
  var root = T.root, $ = T.$, B = window.BS;
  var today = B.todayAd(), tb = B.adToBs(today.y, today.m, today.d);
  var ne = !!T.store.get('cal-ne', false);
  var view = { y: tb.y, m: tb.m }, sel = { y: tb.y, m: tb.m, d: tb.d };
  var AD_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function D(n) { return B.toDigits(n, ne); }
  function mName(m) { return (ne ? B.MONTHS_NE : B.MONTHS_EN)[m - 1]; }

  root.innerHTML =
    '<div class="tcard bscal">' +
    '<div class="cal-bar"><button type="button" class="tbtn tbtn--small" id="c-prev" aria-label="Previous month">&larr;</button>' +
    '<div class="cal-title"><select id="c-m" aria-label="Month"></select><select id="c-y" aria-label="Year"></select></div>' +
    '<button type="button" class="tbtn tbtn--small" id="c-next" aria-label="Next month">&rarr;</button></div>' +
    '<div class="trow cal-tools"><button type="button" class="tbtn tbtn--small tbtn--primary" id="c-today">Today</button>' +
    '<div class="tchips" role="group" aria-label="Language"><button type="button" class="tchip" id="c-en">English</button><button type="button" class="tchip" id="c-ne" lang="ne">\u0928\u0947\u092A\u093E\u0932\u0940</button></div></div>' +
    '<p class="thint cal-span" id="c-span"></p><div class="tmsg tmsg--info" id="c-est" hidden>These dates are <b>estimates</b>. The official calendar from 2084 BS onward has not been published yet, and sources differ by a day in some months.</div>' +
    '<div class="cal-grid" id="c-grid" role="grid"></div></div>' +
    '<div class="tcard" id="c-detail" aria-live="polite"></div>';

  function fill() {
    var ms = $('#c-m'), ys = $('#c-y'); ms.innerHTML = ''; ys.innerHTML = '';
    for (var m = 1; m <= 12; m++) { var o = document.createElement('option'); o.value = m; o.textContent = mName(m); ms.appendChild(o); }
    for (var y = B.MIN_YEAR; y <= B.MAX_YEAR; y++) { var p = document.createElement('option'); p.value = y; p.textContent = D(y) + (B.isEstimated(y) ? ' *' : ''); ys.appendChild(p); }
  }
  function adSpan(y, m) {
    var a = B.bsToAd(y, m, 1), z = B.bsToAd(y, m, B.daysInMonth(y, m));
    var s = AD_SHORT[a.m - 1] + ' ' + a.d + (a.y !== z.y ? ', ' + a.y : '') + ' \u2013 ' + AD_SHORT[z.m - 1] + ' ' + z.d + ', ' + z.y;
    return s;
  }
  function render() {
    $('#c-m').value = view.m; $('#c-y').value = view.y;
    $('#c-en').setAttribute('aria-pressed', ne ? 'false' : 'true'); $('#c-ne').setAttribute('aria-pressed', ne ? 'true' : 'false');
    $('#c-prev').disabled = view.y === B.MIN_YEAR && view.m === 1; $('#c-next').disabled = view.y === B.MAX_YEAR && view.m === 12;
    $('#c-span').textContent = (ne ? B.MONTHS_NE[view.m - 1] + ' ' + D(view.y) + ' \u2192 ' : B.MONTHS_EN[view.m - 1] + ' ' + view.y + ' BS \u2192 ') + adSpan(view.y, view.m) + ' AD \u00B7 ' + B.daysInMonth(view.y, view.m) + ' days';
    $('#c-est').hidden = !B.isEstimated(view.y);
    var g = $('#c-grid'); g.innerHTML = '';
    for (var i = 0; i < 7; i++) {
      var h = document.createElement('div'); h.className = 'cal-h' + (i === 6 ? ' sat' : ''); h.setAttribute('role', 'columnheader');
      h.textContent = ne ? B.WD_NE_SHORT[i] : B.WD_EN[i].slice(0, 3); g.appendChild(h);
    }
    var first = B.bsToAd(view.y, view.m, 1), n = B.daysInMonth(view.y, view.m);
    for (var k = 0; k < first.wd; k++) { var e = document.createElement('div'); e.className = 'cal-empty'; g.appendChild(e); }
    for (var d = 1; d <= n; d++) (function (d) {
      var ad = B.bsToAd(view.y, view.m, d), b = document.createElement('button'); b.type = 'button';
      var isToday = view.y === tb.y && view.m === tb.m && d === tb.d, isSel = sel.y === view.y && sel.m === view.m && sel.d === d;
      b.className = 'cal-day' + (ad.wd === 6 ? ' sat' : '') + (isToday ? ' today' : '') + (isSel ? ' sel' : '') + (B.isEstimated(view.y) ? ' est' : '');
      b.setAttribute('data-d', d); b.tabIndex = isSel ? 0 : -1;
      b.setAttribute('aria-label', (ne ? B.WD_NE : B.WD_EN)[ad.wd] + ', ' + d + ' ' + B.MONTHS_EN[view.m - 1] + ' ' + view.y + ' BS, ' + ad.d + ' ' + B.AD_MONTHS[ad.m - 1] + ' ' + ad.y);
      b.setAttribute('aria-pressed', isSel ? 'true' : 'false');
      b.innerHTML = '<b>' + D(d) + '</b><small>' + ((d === 1 || ad.d === 1) ? AD_SHORT[ad.m - 1] + ' ' : '') + ad.d + '</small>';
      b.addEventListener('click', function () { sel = { y: view.y, m: view.m, d: d }; render(); });
      b.addEventListener('keydown', function (ev) { key(ev); });
      g.appendChild(b);
    })(d);
    detail();
  }
  function shift(days) {                      /* move the selected day by N days, crossing months and years */
    var ad = B.bsToAd(sel.y, sel.m, sel.d), t = new Date(Date.UTC(ad.y, ad.m - 1, ad.d) + days * 86400000);
    var r = B.adToBs(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate()); if (!r) return;
    sel = { y: r.y, m: r.m, d: r.d }; view = { y: r.y, m: r.m }; render();
    var f = $('.cal-day.sel'); if (f) f.focus();
  }
  function key(ev) {
    var map = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (map[ev.key] !== undefined) { ev.preventDefault(); shift(map[ev.key]); }
    else if (ev.key === 'PageUp') { ev.preventDefault(); go(-1); } else if (ev.key === 'PageDown') { ev.preventDefault(); go(1); }
  }
  function go(dir) {
    var m = view.m + dir, y = view.y; if (m < 1) { m = 12; y--; } if (m > 12) { m = 1; y++; }
    if (y < B.MIN_YEAR || y > B.MAX_YEAR) return;
    view = { y: y, m: m }; if (!(sel.y === y && sel.m === m)) sel = { y: y, m: m, d: Math.min(sel.d, B.daysInMonth(y, m)) }; render();
  }
  function rel(ad) {
    var diff = Math.round((Date.UTC(ad.y, ad.m - 1, ad.d) - Date.UTC(today.y, today.m - 1, today.d)) / 86400000);
    return diff === 0 ? 'Today' : diff === 1 ? 'Tomorrow' : diff === -1 ? 'Yesterday' : diff > 0 ? 'In ' + diff.toLocaleString() + ' days' : Math.abs(diff).toLocaleString() + ' days ago';
  }
  function detail() {
    var ad = B.bsToAd(sel.y, sel.m, sel.d), box = $('#c-detail');
    var en = B.WD_EN[ad.wd] + ', ' + sel.d + ' ' + B.MONTHS_EN[sel.m - 1] + ' ' + sel.y + ' BS';
    var nep = B.WD_NE[ad.wd] + ', ' + B.toDigits(sel.d, true) + ' ' + B.MONTHS_NE[sel.m - 1] + ' ' + B.toDigits(sel.y, true);
    var adText = ad.d + ' ' + B.AD_MONTHS[ad.m - 1] + ' ' + ad.y;
    box.innerHTML = '<h2 style="margin:0 0 6px">' + en + '</h2><p style="margin:0 0 4px" lang="ne" class="cal-ne">' + nep + '</p>' +
      '<p style="margin:0">= <strong>' + adText + '</strong> AD \u00B7 ' + rel(ad) + '</p>' +
      (ad.wd === 6 ? '<p class="thint">Saturday is the weekly public holiday in Nepal.</p>' : '') +
      (B.isEstimated(sel.y) ? '<p class="thint">Estimated date: not yet officially published.</p>' : '') +
      '<p style="margin:12px 0 0"><button type="button" class="tbtn tbtn--small" id="c-copy">Copy date</button></p>';
    $('#c-copy').addEventListener('click', function () {
      var b = this, old = b.textContent, txt = sel.d + ' ' + B.MONTHS_EN[sel.m - 1] + ' ' + sel.y + ' BS (' + adText + ' AD)';
      function ok() { b.textContent = 'Copied'; setTimeout(function () { b.textContent = old; }, 1200); }
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(ok, ok); else ok();
    });
  }
  $('#c-prev').addEventListener('click', function () { go(-1); });
  $('#c-next').addEventListener('click', function () { go(1); });
  $('#c-m').addEventListener('change', function () { view.m = +this.value; sel = { y: view.y, m: view.m, d: Math.min(sel.d, B.daysInMonth(view.y, view.m)) }; render(); });
  $('#c-y').addEventListener('change', function () { view.y = +this.value; sel = { y: view.y, m: view.m, d: Math.min(sel.d, B.daysInMonth(view.y, view.m)) }; render(); });
  $('#c-today').addEventListener('click', function () { view = { y: tb.y, m: tb.m }; sel = { y: tb.y, m: tb.m, d: tb.d }; render(); });
  $('#c-en').addEventListener('click', function () { ne = false; T.store.set('cal-ne', false); fill(); render(); });
  $('#c-ne').addEventListener('click', function () { ne = true; T.store.set('cal-ne', true); fill(); render(); });
  fill(); render();
})();
