/* Focus timer (Pomodoro). Uses real clock time, so it stays accurate even if the tab sleeps. */
(function () {
  var root = T.root, $ = T.$;
  var s = T.store.get('pomo-settings', { focus: 25, short: 5, long: 15, every: 4, auto: false });
  var done = T.store.get('pomo-' + T.today(), 0);
  var mode = 'focus', left = s.focus * 60000, end = 0, running = false, timer = null, baseTitle = document.title;
  var LABEL = { focus: 'Focus', short: 'Short break', long: 'Long break' };
  var C = 2 * Math.PI * 105;

  root.innerHTML =
    '<div class="tcard pomo" id="p-card"><div class="tchips" id="p-modes" role="tablist"></div>' +
    '<div class="pomo-ring"><svg viewBox="0 0 240 240" aria-hidden="true"><circle class="bg" cx="120" cy="120" r="105"/><circle class="fg" id="p-fg" cx="120" cy="120" r="105" stroke-dasharray="' + C + '" stroke-dashoffset="0"/></svg>' +
    '<div class="pomo-time"><b id="p-time" aria-live="off">25:00</b><span id="p-label">Focus</span></div></div>' +
    '<div class="trow"><button type="button" class="tbtn tbtn--primary" id="p-go">Start</button><button type="button" class="tbtn" id="p-reset">Reset</button><button type="button" class="tbtn" id="p-skip">Skip</button></div>' +
    '<p class="tstat" style="justify-content:center;margin-top:14px"><span>Focus sessions today <b id="p-done">0</b></span><span>Focused time today <b id="p-mins">0</b> min</span></p></div>' +
    '<div class="tcard"><h2>Settings (minutes)</h2><div class="tgrid">' +
    '<label class="tfield">Focus<input type="number" min="1" max="120" id="s-focus"></label>' +
    '<label class="tfield">Short break<input type="number" min="1" max="60" id="s-short"></label>' +
    '<label class="tfield">Long break<input type="number" min="1" max="90" id="s-long"></label>' +
    '<label class="tfield">Long break every<input type="number" min="2" max="10" id="s-every"></label></div>' +
    '<label class="trow" style="margin-top:12px"><input type="checkbox" id="s-auto" style="accent-color:var(--accent)"> Start the next session automatically</label>' +
    '<p class="thint">A soft beep plays when a session ends. Your count is saved on this device and resets each day.</p></div>';

  function dur(m) { return s[m] * 60000; }
  function fmt(ms) { var t = Math.ceil(ms / 1000), m = Math.floor(t / 60), x = t % 60; return T.pad(m) + ':' + T.pad(x); }
  function beep() {
    try {
      var A = window.AudioContext || window.webkitAudioContext, c = new A(), t = c.currentTime;
      [0, 0.28, 0.56].forEach(function (d) {
        var o = c.createOscillator(), g = c.createGain(); o.frequency.value = 880; o.connect(g); g.connect(c.destination);
        g.gain.setValueAtTime(0.0001, t + d); g.gain.exponentialRampToValueAtTime(0.25, t + d + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.22);
        o.start(t + d); o.stop(t + d + 0.25);
      });
    } catch (e) {}
  }
  function render() {
    $('#p-time').textContent = fmt(left);
    $('#p-label').textContent = LABEL[mode];
    $('#p-go').textContent = running ? 'Pause' : (left < dur(mode) ? 'Resume' : 'Start');
    $('#p-fg').setAttribute('stroke-dashoffset', String(C * (1 - left / dur(mode))));
    $('#p-card').classList.toggle('is-break', mode !== 'focus');
    $('#p-done').textContent = done; $('#p-mins').textContent = done * s.focus;
    T.$$('#p-modes .tchip').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-m') === mode ? 'true' : 'false'); });
    document.title = running ? fmt(left) + ' · ' + LABEL[mode] : baseTitle;
  }
  function setMode(m) { clearInterval(timer); running = false; mode = m; left = dur(m); render(); }
  function start() { if (running) return; running = true; end = Date.now() + left; timer = setInterval(tick, 250); render(); }
  function pause() { if (!running) return; left = Math.max(0, end - Date.now()); running = false; clearInterval(timer); render(); }
  function tick() { left = Math.max(0, end - Date.now()); if (left === 0) finish(); else { $('#p-time').textContent = fmt(left); $('#p-fg').setAttribute('stroke-dashoffset', String(C * (1 - left / dur(mode)))); document.title = fmt(left) + ' · ' + LABEL[mode]; } }
  function finish() {
    clearInterval(timer); running = false; beep();
    var next;
    if (mode === 'focus') { done++; T.store.set('pomo-' + T.today(), done); next = (done % s.every === 0) ? 'long' : 'short'; } else next = 'focus';
    setMode(next); if (s.auto) start();
  }
  ['focus', 'short', 'long'].forEach(function (m) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'tchip'; b.setAttribute('data-m', m); b.textContent = LABEL[m];
    b.addEventListener('click', function () { setMode(m); }); $('#p-modes').appendChild(b);
  });
  $('#p-go').addEventListener('click', function () { running ? pause() : start(); });
  $('#p-reset').addEventListener('click', function () { setMode(mode); });
  $('#p-skip').addEventListener('click', function () { if (mode === 'focus') setMode('short'); else setMode('focus'); });
  ['focus', 'short', 'long', 'every'].forEach(function (k) {
    var el = $('#s-' + k); el.value = s[k];
    el.addEventListener('change', function () {
      var v = Math.max(parseInt(el.min, 10), Math.min(parseInt(el.max, 10), parseInt(el.value, 10) || s[k]));
      el.value = v; s[k] = v; T.store.set('pomo-settings', s); if (!running && k === mode) { left = dur(mode); } render();
    });
  });
  $('#s-auto').checked = !!s.auto;
  $('#s-auto').addEventListener('change', function () { s.auto = this.checked; T.store.set('pomo-settings', s); });
  document.addEventListener('keydown', function (e) {
    if (e.code === 'Space' && !/INPUT|SELECT|TEXTAREA|BUTTON/.test(e.target.tagName)) { e.preventDefault(); running ? pause() : start(); }
  });
  window.addEventListener('beforeunload', function () { document.title = baseTitle; });
  render();
})();
