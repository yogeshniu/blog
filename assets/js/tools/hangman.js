/* Hangman with words from hydropower, hydrology, Nepal and coding. */
(function () {
  var root = T.root, $ = T.$;
  var WORDS = {
    'Hydropower': ['reservoir', 'turbine', 'penstock', 'spillway', 'generator', 'tailrace', 'headrace', 'forebay', 'powerhouse', 'transformer', 'cavitation', 'governor', 'pelton', 'francis', 'kaplan', 'cofferdam', 'embankment', 'gabion', 'trashrack', 'sediment'],
    'Hydrology': ['catchment', 'rainfall', 'runoff', 'aquifer', 'watershed', 'evaporation', 'discharge', 'hydrograph', 'infiltration', 'baseflow', 'precipitation', 'streamflow', 'floodplain', 'glacier', 'snowmelt', 'monsoon', 'groundwater', 'tributary', 'estuary', 'drought'],
    'Nepal': ['kathmandu', 'pokhara', 'lumbini', 'everest', 'annapurna', 'bhaktapur', 'dashain', 'tihar', 'himalaya', 'sherpa', 'koshi', 'gandaki', 'narayani', 'janakpur', 'biratnagar', 'dhaulagiri', 'langtang', 'kanchenjunga', 'chitwan', 'bagmati', 'karnali', 'trishuli', 'namaste', 'thamel'],
    'Coding': ['variable', 'function', 'algorithm', 'iteration', 'recursion', 'python', 'javascript', 'database', 'compiler', 'debugging', 'library', 'dictionary', 'boolean', 'integer', 'framework', 'repository']
  };
  var MAX = 6, cats = Object.keys(WORDS), cat = 'Hydropower', word = '', got = {}, bad = [], over = false, last = '';
  var stats = T.store.get('hangman', { win: 0, loss: 0, streak: 0, best: 0 });
  var PARTS = ['<circle class="part" cx="130" cy="62" r="16"/>', '<line class="part" x1="130" y1="78" x2="130" y2="128"/>', '<line class="part" x1="130" y1="90" x2="108" y2="112"/>',
               '<line class="part" x1="130" y1="90" x2="152" y2="112"/>', '<line class="part" x1="130" y1="128" x2="110" y2="158"/>', '<line class="part" x1="130" y1="128" x2="150" y2="158"/>'];

  root.innerHTML =
    '<div class="tcard"><div class="trow" style="justify-content:space-between"><div class="tchips" id="h-cats" role="group" aria-label="Word category"></div>' +
    '<div class="tstat"><span>Wins <b id="h-w">0</b></span><span>Losses <b id="h-l">0</b></span><span>Streak <b id="h-s">0</b></span><span>Best <b id="h-b">0</b></span></div></div></div>' +
    '<div class="tcard"><div class="hm"><svg viewBox="0 0 200 180" role="img" aria-label="Hangman drawing"><g class="gallows"><line x1="20" y1="170" x2="120" y2="170"/><line x1="50" y1="170" x2="50" y2="20"/><line x1="50" y1="20" x2="130" y2="20"/><line x1="130" y1="20" x2="130" y2="46"/></g>' + PARTS.join('') + '</svg>' +
    '<div><p class="thint" style="margin:0">Category: <b id="h-cat"></b> · <span id="h-n"></span> letters · Lives left: <b id="h-lives"></b></p><div class="hm-word" id="h-word" aria-live="polite"></div>' +
    '<div class="hm-keys" id="h-keys"></div><div id="h-msg" aria-live="assertive"></div>' +
    '<div class="trow" style="margin-top:14px"><button type="button" class="tbtn tbtn--primary" id="h-new">New word</button><button type="button" class="tbtn" id="h-hint">Hint (costs a life)</button></div>' +
    '<p class="thint">You can also type letters on your keyboard.</p></div></div></div>';

  function save() { T.store.set('hangman', stats); }
  function pick() {
    var list = WORDS[cat], i = T.rnd(list.length);
    if (list[i] === last) i = (i + 1) % list.length;      /* never the same word twice in a row, and never loops forever */
    last = list[i]; return last;
  }
  function start() {
    word = pick(); got = {}; bad = []; over = false; $('#h-msg').innerHTML = ''; render();
  }
  function render() {
    $('#h-cat').textContent = cat; $('#h-n').textContent = word.length; $('#h-lives').textContent = MAX - bad.length;
    var box = $('#h-word'); box.innerHTML = '';
    word.split('').forEach(function (ch) {
      var s = document.createElement('span'); s.className = 'hm-letter' + (over && !got[ch] ? ' missed' : ''); s.textContent = (got[ch] || over) ? ch : ''; box.appendChild(s);
    });
    T.$$('.part', root).forEach(function (p, i) { p.classList.toggle('show', i < bad.length); });
    var keys = $('#h-keys'); keys.innerHTML = '';
    'abcdefghijklmnopqrstuvwxyz'.split('').forEach(function (ch) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'hm-key'; b.textContent = ch;
      var used = got[ch] || bad.indexOf(ch) !== -1;
      if (got[ch]) b.classList.add('ok'); if (bad.indexOf(ch) !== -1) b.classList.add('no');
      b.disabled = used || over; b.addEventListener('click', function () { guess(ch); }); keys.appendChild(b);
    });
    $('#h-hint').disabled = over || (MAX - bad.length) <= 1;
    $('#h-w').textContent = stats.win; $('#h-l').textContent = stats.loss; $('#h-s').textContent = stats.streak; $('#h-b').textContent = stats.best;
  }
  function finish(won) {
    over = true;
    if (won) { stats.win++; stats.streak++; if (stats.streak > stats.best) stats.best = stats.streak; $('#h-msg').innerHTML = '<p class="tmsg tmsg--win">You got it! “' + word + '”. Keep going.</p>'; }
    else { stats.loss++; stats.streak = 0; $('#h-msg').innerHTML = '<p class="tmsg tmsg--lose">Not this time. The word was “' + word + '”. Try another, never give up.</p>'; }
    save(); render();
  }
  function guess(ch) {
    if (over || got[ch] || bad.indexOf(ch) !== -1) return;
    if (word.indexOf(ch) !== -1) {
      got[ch] = true;
      if (word.split('').every(function (c) { return got[c]; })) return finish(true);
    } else { bad.push(ch); if (bad.length >= MAX) return finish(false); }
    render();
  }
  cats.forEach(function (c) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'tchip'; b.textContent = c; b.setAttribute('aria-pressed', c === cat ? 'true' : 'false');
    b.addEventListener('click', function () { cat = c; T.$$('#h-cats .tchip').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); start(); });
    $('#h-cats').appendChild(b);
  });
  $('#h-new').addEventListener('click', start);
  $('#h-hint').addEventListener('click', function () {
    if (over || MAX - bad.length <= 1) return;
    var left = word.split('').filter(function (c) { return !got[c]; }); if (!left.length) return;
    var ch = left[T.rnd(left.length)]; bad.push('·' + ch); got[ch] = true;      /* costs one life, reveals the letter */
    if (word.split('').every(function (c) { return got[c]; })) return finish(true);
    render();
  });
  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
    if (/^[a-z]$/i.test(e.key)) guess(e.key.toLowerCase());
  });
  start();
})();
