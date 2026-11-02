/* Number guessing game with three levels and best scores. */
(function () {
  var root = T.root, $ = T.$;
  var LV = { easy: { name: 'Easy', max: 50, tries: 10 }, medium: { name: 'Medium', max: 100, tries: 7 }, hard: { name: 'Hard', max: 500, tries: 9 } };
  var lv = 'medium', secret = 0, hist = [], over = false;
  var best = T.store.get('guess-best', {});

  root.innerHTML =
    '<div class="tcard"><div class="trow" style="justify-content:space-between"><div class="tchips" id="g-lv" role="group" aria-label="Difficulty"></div>' +
    '<div class="tstat"><span>Best (this level) <b id="g-best">–</b></span></div></div></div>' +
    '<div class="tcard"><p style="margin:0 0 4px" id="g-info"></p><div class="gs-bar"><i id="g-bar" style="width:100%"></i></div>' +
    '<div class="trow" style="margin-top:16px"><input class="tinput gs-input" id="g-in" type="number" inputmode="numeric" aria-label="Your guess" placeholder="?"><button type="button" class="tbtn tbtn--primary" id="g-go">Guess</button><button type="button" class="tbtn" id="g-new">New game</button></div>' +
    '<div id="g-msg" aria-live="polite"></div><div class="gs-hist" id="g-hist" aria-label="Your guesses"></div>' +
    '<p class="thint">Tip: start in the middle and halve the range each time. That finds any number from 1 to 100 in 7 tries or fewer.</p></div>';

  function newGame() {
    secret = 1 + T.rnd(LV[lv].max); hist = []; over = false; $('#g-msg').innerHTML = ''; $('#g-in').value = ''; $('#g-in').disabled = false; $('#g-go').disabled = false; render(); $('#g-in').focus();
  }
  function render() {
    var L = LV[lv];
    $('#g-info').textContent = 'I am thinking of a number from 1 to ' + L.max + '. You have ' + (L.tries - hist.length) + ' of ' + L.tries + ' tries left.';
    $('#g-bar').style.width = (100 * (L.tries - hist.length) / L.tries) + '%';
    $('#g-best').textContent = best[lv] ? best[lv] + ' tries' : '–';
    var h = $('#g-hist'); h.innerHTML = '';
    hist.forEach(function (g) {
      var s = document.createElement('span'); s.className = 'gs-chip ' + (g.n === secret ? '' : g.n < secret ? 'low' : 'high'); s.textContent = g.n + (g.n === secret ? ' ✓' : g.n < secret ? ' ↑' : ' ↓'); h.appendChild(s);
    });
  }
  function warmth(diff, max) {
    var r = diff / max;
    return r <= 0.03 ? 'Burning hot!' : r <= 0.08 ? 'Very warm.' : r <= 0.2 ? 'Warm.' : r <= 0.4 ? 'Cool.' : 'Cold.';
  }
  function guess() {
    if (over) return;
    var L = LV[lv], n = parseInt($('#g-in').value, 10), msg = $('#g-msg');
    if (isNaN(n) || n < 1 || n > L.max) { msg.innerHTML = '<p class="tmsg tmsg--info">Enter a whole number from 1 to ' + L.max + '.</p>'; return; }
    if (hist.some(function (g) { return g.n === n; })) { msg.innerHTML = '<p class="tmsg tmsg--info">You already tried ' + n + '.</p>'; return; }
    hist.push({ n: n });
    if (n === secret) {
      over = true; var t = hist.length, isBest = !best[lv] || t < best[lv]; if (isBest) { best[lv] = t; T.store.set('guess-best', best); }
      msg.innerHTML = '<p class="tmsg tmsg--win">Correct! ' + secret + ' in ' + t + (t === 1 ? ' try' : ' tries') + (isBest ? '. New best!' : '.') + '</p>';
    } else if (hist.length >= L.tries) {
      over = true; msg.innerHTML = '<p class="tmsg tmsg--lose">Out of tries. The number was ' + secret + '. Start a new game and go again.</p>';
    } else {
      msg.innerHTML = '<p class="tmsg tmsg--info">' + (n < secret ? 'Higher ↑' : 'Lower ↓') + ' · ' + warmth(Math.abs(n - secret), L.max) + '</p>';
    }
    $('#g-in').value = ''; if (over) { $('#g-in').disabled = true; $('#g-go').disabled = true; } else $('#g-in').focus();
    render();
  }
  Object.keys(LV).forEach(function (k) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'tchip'; b.textContent = LV[k].name + ' (1–' + LV[k].max + ')'; b.setAttribute('aria-pressed', k === lv ? 'true' : 'false');
    b.addEventListener('click', function () { lv = k; T.$$('#g-lv .tchip').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); newGame(); });
    $('#g-lv').appendChild(b);
  });
  $('#g-go').addEventListener('click', guess);
  $('#g-in').addEventListener('keydown', function (e) { if (e.key === 'Enter') guess(); });
  $('#g-new').addEventListener('click', newGame);
  newGame();
})();
