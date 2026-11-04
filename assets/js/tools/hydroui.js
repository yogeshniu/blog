/* Card renderer shared by the hydropower design tools (settling basin, gravel trap, intake, ...).
   A tool page describes its calculators as data; this file draws the inputs, results table and pass/fail checks.

   HydroUI.mount({ sections: [ section, ... ] })
   section = {
     title, intro,                      heading and one line under it
     fields: [ [key, label, default, options?], 'Sub-heading text', ... ]
        options: { opts: [[value,'Label'], ...] }  -> drop-down      { text: true, rows: 6 } -> text / text area
     run(values) -> { results, checks }  a HydroCalc function (values are numbers; text fields stay text)
     rows: [ [label, 'key' | fn(results, values), unit, decimals?], ... ]   rows of the results table
     extra(results, values) -> HTML      optional extra table (build it with HydroUI.table / HydroUI.esc)
     note                                small print under the card
   }
   Everything a visitor types is only ever read as a number or shown with textContent / escaped. */
window.HydroUI = (function () {
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function fmt(x, d) {
    if (typeof x === 'string') return esc(x);
    if (typeof x === 'boolean') return x ? 'Yes' : 'No';
    if (x === null || x === undefined || typeof x !== 'number' || !isFinite(x)) return '–';
    if (d === undefined) { var a = Math.abs(x); d = a === 0 ? 0 : a >= 1000 ? 1 : a >= 100 ? 2 : a >= 1 ? 3 : 5; }
    return x.toLocaleString(undefined, { maximumFractionDigits: d });
  }

  function get(o, path) { return String(path).split('.').reduce(function (a, k) { return a == null ? a : a[k]; }, o); }

  /* Small HTML table: head = ['A','B'], body = [[1,2],[3,4]] (numbers are formatted, strings escaped). */
  function table(head, body, dec) {
    return '<div class="hu-scroll"><table class="hu-table hu-grid"><thead><tr>' + head.map(function (h) { return '<th>' + esc(h) + '</th>'; }).join('') +
      '</tr></thead><tbody>' + body.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + fmt(c, dec) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
  }

  /* Run one section with a plain {key: value} object. No DOM needed (this is also what the tests call). */
  function evaluate(sec, v) {
    var r = sec.run(v), res = r.results || {};
    var rows = (sec.rows || []).map(function (x) {
      var val = typeof x[1] === 'function' ? x[1](res, v) : get(res, x[1]);
      return [x[0], val, x[2] || '', x[3]];
    });
    return { rows: rows, checks: r.checks || [], extra: sec.extra ? sec.extra(res, v) : '' };
  }

  function render(ev) {
    var h = !ev.rows.length ? '' : '<table class="hu-table"><tbody>' + ev.rows.map(function (r) {
      return '<tr><td>' + esc(r[0]) + '</td><td>' + fmt(r[1], r[3]) + '</td><td>' + esc(r[2]) + '</td></tr>';
    }).join('') + '</tbody></table>';
    if (ev.checks.length) {
      h += '<ul class="hu-checks">' + ev.checks.map(function (c) {
        var lim = c.limit === undefined || c.limit === null ? '' : ' (limit ' + fmt(c.limit) + ')';
        return '<li class="' + (c.ok ? 'hu-ok' : 'hu-bad') + '"><b aria-hidden="true">' + (c.ok ? '✓' : '✗') + '</b> <span class="hu-sr">' + (c.ok ? 'Pass: ' : 'Check: ') + '</span>' +
          esc(c.name) + ' <span class="hu-val">' + fmt(c.value) + lim + '</span>' + (c.note ? '<br><small>' + esc(c.note) + '</small>' : '') + '</li>';
      }).join('') + '</ul>';
    }
    return h + ev.extra;
  }

  function fieldHtml(id, f) {
    var o = f[3] || {}, lab = esc(f[1]);
    if (o.opts) {
      return '<label class="tfield">' + lab + '<select id="' + id + '">' + o.opts.map(function (p) {
        return '<option value="' + esc(p[0]) + '"' + (p[0] === f[2] ? ' selected' : '') + '>' + esc(p[1]) + '</option>';
      }).join('') + '</select></label>';
    }
    if (o.text && o.rows) return '<label class="tfield hu-wide">' + lab + '<textarea id="' + id + '" rows="' + o.rows + '" spellcheck="false" class="tinput hu-area">' + esc(f[2]) + '</textarea></label>';
    if (o.text) return '<label class="tfield hu-wide">' + lab + '<input id="' + id + '" type="text" class="tinput" value="' + esc(f[2]) + '" autocomplete="off"></label>';
    return '<label class="tfield">' + lab + '<input id="' + id + '" type="number" inputmode="decimal" step="any" value="' + esc(f[2]) + '"></label>';
  }

  function mount(def) {
    var T = window.T, root = T.root;
    root.innerHTML = def.sections.map(function (sec, si) {
      return '<div class="tcard" id="hu-' + si + '"><h2>' + esc(sec.title) + '</h2>' +
        (sec.intro ? '<p class="thint" style="margin:0 0 12px">' + esc(sec.intro) + '</p>' : '') +
        '<div class="tgrid">' + sec.fields.map(function (f, fi) {
          return typeof f === 'string' ? '<h3 class="hu-sub">' + esc(f) + '</h3>' : fieldHtml('hu-' + si + '-' + fi, f);
        }).join('') + '</div><div class="hu-out" aria-live="polite"></div>' +
        (sec.note ? '<p class="thint">' + esc(sec.note) + '</p>' : '') + '</div>';
    }).join('');

    def.sections.forEach(function (sec, si) {
      var card = T.$('#hu-' + si), out = T.$('.hu-out', card);
      function go() {
        var v = {}, ok = true;
        sec.fields.forEach(function (f, fi) {
          if (typeof f === 'string') return;
          var el = T.$('#hu-' + si + '-' + fi), o = f[3] || {};
          if (o.text) { v[f[0]] = el.value; return; }
          var x = T.num(el.value); if (isNaN(x)) ok = false; v[f[0]] = x;
        });
        if (!ok) { out.innerHTML = '<div class="tmsg tmsg--info">Enter a number in every box to see the results.</div>'; return; }
        try { out.innerHTML = render(evaluate(sec, v)); }
        catch (e) { out.innerHTML = '<div class="tmsg tmsg--lose">Cannot calculate with these values: ' + esc(e && e.message ? e.message : 'check the inputs') + '</div>'; }
      }
      card.addEventListener('input', go); card.addEventListener('change', go); go();
    });
  }

  return { mount: mount, evaluate: evaluate, render: render, table: table, esc: esc, fmt: fmt };
})();
