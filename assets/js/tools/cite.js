/* Citation maker: APA 7, Harvard, IEEE and BibTeX. Everything stays in the browser. */
(function () {
  var T = window.T, $ = T.$, $$ = T.$$, C = CiteLib, root = T.root;
  var FIELDS = [ /* [id, label, shows for, type] */
    ['container', 'Journal', 'article', 'text'], ['container', 'Website or organisation name', 'web', 'text'],
    ['volume', 'Volume', 'article', 'text'], ['issue', 'Issue', 'article', 'text'], ['pages', 'Pages (for example 123-145)', 'article', 'text'],
    ['publisher', 'Publisher', 'book report', 'text'], ['place', 'Place of publication (optional)', 'book report', 'text'],
    ['edition', 'Edition (for example 2nd)', 'book', 'text'], ['reportNo', 'Report number', 'report', 'text'],
    ['link', 'DOI or URL', 'article book web report', 'text'], ['accessed', 'Date accessed', 'web article', 'date']
  ];
  var html = '<div class="tcard"><h2>1. Source details</h2><div class="tgrid">' +
    '<label class="tfield">Source type<select id="ci-type"><option value="article">Journal article</option><option value="book">Book</option><option value="web">Web page</option><option value="report">Report</option></select></label>' +
    '<label class="tfield">Year<input id="ci-year" type="text" placeholder="2020" autocomplete="off"></label>' +
    '<label class="tfield hu-wide">Title (type it exactly as it should appear)<input id="ci-title" type="text" autocomplete="off"></label>' +
    '<label class="tfield hu-wide">Authors, one per line as "Last, First Middle". For an organisation write "org: Name".<textarea id="ci-authors" class="tinput" rows="3" spellcheck="false"></textarea></label>';
  FIELDS.forEach(function (f, i) {
    html += '<label class="tfield" data-for="' + f[2] + '">' + f[1] + '<input id="ci-f' + i + '" type="' + f[3] + '" autocomplete="off"' + (f[3] === 'date' ? ' value="' + T.today() + '"' : '') + '></label>';
  });
  html += '</div><div id="ci-msg" aria-live="polite"></div></div><div id="ci-out"></div>' +
    '<p class="thint">Citation styles have many variations between universities and journals. Check the result against your own style guide.</p>';
  root.innerHTML = html;

  function copy(text, htmlText, btn) {
    function done() { var o = btn.textContent; btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = o; }, 1200); }
    function fallback() { var ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); done(); } catch (e) {} document.body.removeChild(ta); }
    try {
      if (htmlText && window.ClipboardItem && navigator.clipboard && navigator.clipboard.write) {
        navigator.clipboard.write([new ClipboardItem({ 'text/html': new Blob([htmlText], { type: 'text/html' }), 'text/plain': new Blob([text], { type: 'text/plain' }) })]).then(done, fallback);
      } else if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
      else fallback();
    } catch (e) { fallback(); }
  }

  function read() {
    var d = { authors: $('#ci-authors').value, year: $('#ci-year').value, title: $('#ci-title').value };
    var type = $('#ci-type').value;
    FIELDS.forEach(function (f, i) { if (f[2].split(' ').indexOf(type) > -1) d[f[0]] = $('#ci-f' + i).value; });
    if (type === 'article' && !d.link) d.accessed = '';
    return { type: type, data: d };
  }

  var last = {};
  function render() {
    var type = $('#ci-type').value;
    $$('[data-for]', root).forEach(function (l) { l.hidden = l.getAttribute('data-for').split(' ').indexOf(type) < 0; });
    var r = read(), out = $('#ci-out'), msg = $('#ci-msg');
    try {
      var f = C.format(r.type, r.data); msg.innerHTML = '';
      var blocks = [['APA 7', 'apa'], ['Harvard', 'harvard'], ['IEEE', 'ieee']];
      out.innerHTML = blocks.map(function (b, i) {
        return '<div class="tcard"><h3>' + b[0] + '</h3><p class="cite-text" id="ci-t' + i + '">' + C.html(f[b[1]]) + '</p><button class="tbtn tbtn--small" type="button" data-i="' + i + '">Copy</button></div>';
      }).join('') + '<div class="tcard"><h3>BibTeX</h3><pre class="cite-bib" id="ci-bib"></pre><button class="tbtn tbtn--small" type="button" data-i="3">Copy</button></div>';
      $('#ci-bib').textContent = f.bibtex; last = f;
    } catch (e) { out.innerHTML = ''; msg.innerHTML = '<div class="tmsg tmsg--info">' + (e && e.message ? e.message : 'Check the details.') + '</div>'; last = {}; }
  }
  root.addEventListener('input', function (e) { if (!(e.target && e.target.getAttribute && e.target.getAttribute('data-i'))) render(); });
  root.addEventListener('change', render);
  root.addEventListener('click', function (e) {
    var b = e.target; if (!b || !b.getAttribute) return; var i = b.getAttribute('data-i'); if (i === null) return;
    var keys = ['apa', 'harvard', 'ieee', 'bibtex'], s = last[keys[+i]]; if (!s) return;
    if (+i === 3) copy(s, '', b); else copy(C.plain(s), C.html(s), b);
  });
  render();
})();
