/* Nepali (BS) <-> English (AD) date converter. Needs bs.js (window.BS). */
(function () {
  var root = T.root, $ = T.$, B = window.BS, mode = 'bs2ad';
  var t = B.todayAd(), tb = B.adToBs(t.y, t.m, t.d);
  function iso(o) { return o.y + '-' + B.pad2(o.m) + '-' + B.pad2(o.d); }

  root.innerHTML =
    '<div class="tcard"><div class="tchips" role="group" aria-label="Direction"><button type="button" class="tchip" id="v-b2a" aria-pressed="true">Nepali (BS) \u2192 English (AD)</button><button type="button" class="tchip" id="v-a2b" aria-pressed="false">English (AD) \u2192 Nepali (BS)</button></div>' +
    '<div id="v-bs" class="tgrid" style="margin-top:16px"><label class="tfield">Year (BS)<select id="v-y"></select></label><label class="tfield">Month<select id="v-m"></select></label><label class="tfield">Day<select id="v-d"></select></label></div>' +
    '<div id="v-ad" hidden style="margin-top:16px"><label class="tfield" style="max-width:260px">English date (AD)<input type="date" id="v-date"></label></div>' +
    '<p style="margin:14px 0 0"><button type="button" class="tbtn tbtn--small" id="v-today">Use today</button></p></div>' +
    '<div class="tcard" id="v-out" aria-live="polite"></div>';

  function fillBs() {
    var ys = $('#v-y'), ms = $('#v-m'); ys.innerHTML = ''; ms.innerHTML = '';
    for (var y = B.MIN_YEAR; y <= B.MAX_YEAR; y++) { var o = document.createElement('option'); o.value = y; o.textContent = y + (B.isEstimated(y) ? ' (estimate)' : ''); ys.appendChild(o); }
    for (var m = 1; m <= 12; m++) { var p = document.createElement('option'); p.value = m; p.textContent = m + ' \u00B7 ' + B.MONTHS_EN[m - 1] + ' (' + B.MONTHS_NE[m - 1] + ')'; ms.appendChild(p); }
  }
  function fillDays(keep) {
    var n = B.daysInMonth(+$('#v-y').value, +$('#v-m').value), ds = $('#v-d'), cur = keep || +ds.value || 1; ds.innerHTML = '';
    for (var d = 1; d <= n; d++) { var o = document.createElement('option'); o.value = d; o.textContent = d; ds.appendChild(o); }
    ds.value = Math.min(cur, n);
  }
  function show(bs, ad) {
    var en = B.WD_EN[ad.wd] + ', ' + bs.d + ' ' + B.MONTHS_EN[bs.m - 1] + ' ' + bs.y + ' BS';
    var nep = B.WD_NE[ad.wd] + ', ' + B.toDigits(bs.d, true) + ' ' + B.MONTHS_NE[bs.m - 1] + ' ' + B.toDigits(bs.y, true);
    var adText = B.WD_EN[ad.wd] + ', ' + ad.d + ' ' + B.AD_MONTHS[ad.m - 1] + ' ' + ad.y;
    var head = mode === 'bs2ad' ? adText : en, sub = mode === 'bs2ad' ? en : adText;
    $('#v-out').innerHTML = '<p class="thint" style="margin:0">Result</p><h2 style="margin:4px 0 6px">' + head + '</h2><p style="margin:0">' + sub + '</p>' +
      '<p style="margin:4px 0 0" lang="ne" class="cal-ne">' + nep + '</p>' + '<p style="margin:4px 0 0" class="thint">ISO date (AD): ' + iso(ad) + '</p>' +
      (B.isEstimated(bs.y) ? '<p class="tmsg tmsg--info">Estimated: dates from 2084 BS are not yet officially published and may shift by a day.</p>' : '') +
      '<p style="margin:12px 0 0"><button type="button" class="tbtn tbtn--small" id="v-copy">Copy result</button></p>';
    $('#v-copy').addEventListener('click', function () {
      var b = this, old = b.textContent, txt = bs.d + ' ' + B.MONTHS_EN[bs.m - 1] + ' ' + bs.y + ' BS = ' + ad.d + ' ' + B.AD_MONTHS[ad.m - 1] + ' ' + ad.y + ' AD';
      function ok() { b.textContent = 'Copied'; setTimeout(function () { b.textContent = old; }, 1200); }
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(ok, ok); else ok();
    });
  }
  function error(msg) { $('#v-out').innerHTML = '<p class="tmsg tmsg--lose" style="margin:0">' + msg + '</p>'; }
  function run() {
    if (mode === 'bs2ad') {
      var y = +$('#v-y').value, m = +$('#v-m').value, d = +$('#v-d').value, ad = B.bsToAd(y, m, d);
      if (!ad) return error('That Nepali date does not exist.'); show({ y: y, m: m, d: d }, ad);
    } else {
      var v = $('#v-date').value; if (!v) return error('Pick an English date.');
      var p = v.split('-').map(Number), bs = B.adToBs(p[0], p[1], p[2]);
      if (!bs) return error('This tool covers 14 April 1943 to 13 April 2034 (2000 to 2090 BS).');
      show(bs, { y: p[0], m: p[1], d: p[2], wd: bs.wd });
    }
  }
  function setMode(m) {
    mode = m; $('#v-b2a').setAttribute('aria-pressed', m === 'bs2ad'); $('#v-a2b').setAttribute('aria-pressed', m === 'ad2bs');
    $('#v-bs').hidden = m !== 'bs2ad'; $('#v-ad').hidden = m !== 'ad2bs'; run();
  }
  function useToday() {
    $('#v-y').value = tb.y; $('#v-m').value = tb.m; fillDays(tb.d); $('#v-d').value = tb.d; $('#v-date').value = iso(t); run();
  }
  fillBs(); $('#v-date').min = iso(B.adMin); $('#v-date').max = iso(B.adMax);
  $('#v-y').addEventListener('change', function () { fillDays(); run(); });
  $('#v-m').addEventListener('change', function () { fillDays(); run(); });
  $('#v-d').addEventListener('change', run); $('#v-date').addEventListener('input', run);
  $('#v-b2a').addEventListener('click', function () { setMode('bs2ad'); }); $('#v-a2b').addEventListener('click', function () { setMode('ad2bs'); });
  $('#v-today').addEventListener('click', useToday);
  useToday(); setMode('bs2ad');
})();
