/* Tutorial Finder: builds a good search phrase and opens it on YouTube or Google Videos. */
(function () {
  var root = T.root, $ = T.$;
  var SOFT = ['HEC-HMS', 'HEC-RAS', 'HEC-ResSim', 'SWAT', 'RESCON 2', 'Ansys', 'SAP2000', 'ETABS', 'AutoCAD', 'Civil 3D', 'Rhino',
              'ArcGIS', 'QGIS', 'Python', 'R programming', 'C programming', 'JavaScript', 'PHP', 'LaTeX', 'Excel', 'MS Project', 'Git and GitHub', 'Hugo'];
  var LEVEL = { any: '', beginner: 'for beginners', intermediate: 'intermediate', advanced: 'advanced' };
  var FORMAT = { any: 'tutorial', course: 'full course tutorial', quick: 'quick start tutorial', project: 'step by step project tutorial', fix: 'how to fix error troubleshooting' };
  var LANG = { en: '', ne: 'in Nepali', hi: 'in Hindi', zh: 'in Chinese' };
  var state = { soft: 'HEC-HMS', topic: '', level: 'any', format: 'any', lang: 'en' };
  var saved = T.store.get('finder-saved', []), recent = T.store.get('finder-recent', []);

  root.innerHTML =
    '<div class="tcard"><h2>1. Choose the software</h2><div class="tchips" id="f-soft"></div>' +
    '<div class="trow" style="margin-top:12px"><label class="tfield" style="flex:1;min-width:200px">Or type another software or subject' +
    '<input id="f-custom" type="text" placeholder="for example: WEAP, MODFLOW, Blender" autocomplete="off"></label></div></div>' +
    '<div class="tcard"><h2>2. Say what you want to learn</h2><div class="tgrid">' +
    '<label class="tfield" style="grid-column:1/-1">Topic (optional)<input id="f-topic" type="text" placeholder="for example: reservoir routing, hydrograph, cross-sections" autocomplete="off"></label>' +
    '<label class="tfield">Level<select id="f-level"><option value="any">Any level</option><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></label>' +
    '<label class="tfield">Format<select id="f-format"><option value="any">Any tutorial</option><option value="course">Full course</option><option value="quick">Quick start</option><option value="project">Step-by-step project</option><option value="fix">Fix an error</option></select></label>' +
    '<label class="tfield">Language<select id="f-lang"><option value="en">English</option><option value="ne">Nepali</option><option value="hi">Hindi</option><option value="zh">Chinese</option></select></label>' +
    '</div></div>' +
    '<div class="tcard"><h2>3. Search</h2><p class="tresult" id="f-phrase" aria-live="polite"></p>' +
    '<div class="trow" style="margin-top:14px"><a class="tbtn tbtn--primary" id="f-yt" target="_blank" rel="noopener noreferrer">Search on YouTube</a>' +
    '<a class="tbtn" id="f-gv" target="_blank" rel="noopener noreferrer">Google Videos</a>' +
    '<button type="button" class="tbtn" id="f-copy">Copy phrase</button><button type="button" class="tbtn" id="f-save">Save this search</button></div>' +
    '<p class="thint">Results open in a new tab on the video site. Tip: sort by upload date or add the software version (for example 2025) to avoid outdated lessons.</p></div>' +
    '<div class="tcard"><h2>Saved searches</h2><ul class="tlist" id="f-saved"></ul><p class="thint" id="f-saved-empty">Nothing saved yet. Press “Save this search” to keep one here.</p></div>' +
    '<div class="tcard"><h2>Recent searches</h2><ul class="tlist" id="f-recent"></ul><p class="thint" id="f-recent-empty">Your last searches will appear here.</p>' +
    '<p style="margin:10px 0 0"><button type="button" class="tbtn tbtn--small" id="f-clear">Clear recent</button></p></div>';

  function phrase() {
    var soft = ($('#f-custom').value.trim() || state.soft);
    var parts = [soft, state.topic.trim(), FORMAT[state.format], LEVEL[state.level], LANG[state.lang]].filter(Boolean);
    return parts.join(' ');
  }
  function yt(q) { return 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q); }
  function gv(q) { return 'https://www.google.com/search?tbm=vid&q=' + encodeURIComponent(q); }
  function pushRecent(q) {
    recent = [q].concat(recent.filter(function (x) { return x !== q; })).slice(0, 8);
    T.store.set('finder-recent', recent); renderLists();
  }
  function list(el, emptyEl, items, removable, onRemove) {
    el.innerHTML = '';
    emptyEl.hidden = items.length > 0;
    items.forEach(function (q, i) {
      var li = document.createElement('li'), a = document.createElement('a');
      a.href = yt(q); a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = q;
      a.addEventListener('click', function () { if (!removable) return; pushRecent(q); });
      li.appendChild(a);
      if (removable) {
        var x = document.createElement('button'); x.type = 'button'; x.className = 'tx'; x.setAttribute('aria-label', 'Remove'); x.textContent = '×';
        x.addEventListener('click', function () { onRemove(i); }); li.appendChild(x);
      }
      el.appendChild(li);
    });
  }
  function renderLists() {
    list($('#f-saved'), $('#f-saved-empty'), saved, true, function (i) { saved.splice(i, 1); T.store.set('finder-saved', saved); renderLists(); });
    list($('#f-recent'), $('#f-recent-empty'), recent, false);
  }
  function update() {
    var q = phrase();
    $('#f-phrase').textContent = 'Search phrase: ' + q;
    $('#f-yt').href = yt(q); $('#f-gv').href = gv(q);
  }
  var chips = $('#f-soft');
  SOFT.forEach(function (s) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'tchip'; b.textContent = s;
    b.setAttribute('aria-pressed', s === state.soft ? 'true' : 'false');
    b.addEventListener('click', function () {
      state.soft = s; $('#f-custom').value = '';
      T.$$('.tchip', chips).forEach(function (c) { c.setAttribute('aria-pressed', c === b ? 'true' : 'false'); });
      update();
    });
    chips.appendChild(b);
  });
  $('#f-custom').addEventListener('input', function () {
    if (this.value.trim()) T.$$('.tchip', chips).forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
    update();
  });
  $('#f-topic').addEventListener('input', function () { state.topic = this.value; update(); });
  $('#f-topic').addEventListener('keydown', function (e) { if (e.key === 'Enter') { var q = phrase(); pushRecent(q); window.open(yt(q), '_blank', 'noopener'); } });
  ['level', 'format', 'lang'].forEach(function (k) { $('#f-' + k).addEventListener('change', function () { state[k] = this.value; update(); }); });
  $('#f-yt').addEventListener('click', function () { pushRecent(phrase()); });
  $('#f-gv').addEventListener('click', function () { pushRecent(phrase()); });
  $('#f-save').addEventListener('click', function () {
    var q = phrase(); if (saved.indexOf(q) === -1) { saved.unshift(q); saved = saved.slice(0, 20); T.store.set('finder-saved', saved); renderLists(); }
    var b = this, old = b.textContent; b.textContent = 'Saved'; setTimeout(function () { b.textContent = old; }, 1200);
  });
  $('#f-copy').addEventListener('click', function () {
    var b = this, old = b.textContent, q = phrase();
    function ok() { b.textContent = 'Copied'; setTimeout(function () { b.textContent = old; }, 1200); }
    if (navigator.clipboard) navigator.clipboard.writeText(q).then(ok, ok); else ok();
  });
  $('#f-clear').addEventListener('click', function () { recent = []; T.store.set('finder-recent', recent); renderLists(); });
  update(); renderLists();
})();
