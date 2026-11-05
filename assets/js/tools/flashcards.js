/* Flashcards with spaced repetition. Your deck and progress are saved in this browser only. */
(function () {
  var T = window.T, $ = T.$, C = CardsLib, root = T.root;
  var STARTERS = {
    'Hydrology and hydropower': [
      'Flow duration curve | A plot of flow against the percentage of time the flow is equalled or exceeded.',
      'Q40 | The flow equalled or exceeded 40% of the time; a common choice of design discharge for run-of-river plants.',
      'Weibull plotting position | P = m / (n + 1), where m is the rank (largest flow = 1) and n the number of values.',
      'Power from flowing water | P = ρ g Q H η, which is about 9.81 · Q · H · η kW with Q in m³/s and H in m.',
      'Gross head and net head | Net head is gross head minus the hydraulic losses in the waterway.',
      'Run-of-river plant | A plant with little or no storage, so its output follows the river flow.',
      'Rational method | Q = C i A / 360 (Q in m³/s, i in mm/h, A in ha); used for small catchments.',
      'Return period T | The average interval between events of a given size; the yearly chance of exceedance is 1/T.',
      'Risk over n years | R = 1 − (1 − 1/T)^n',
      'Froude number | Fr = v / √(g y). Below 1 the flow is subcritical; above 1 it is supercritical.',
      'Hydraulic jump | A sudden change from supercritical to subcritical flow, with a large loss of energy.',
      "Manning's equation | V = (1/n) R^(2/3) S^(1/2), where R is the hydraulic radius and S the slope.",
      'Settling basin (desander) | Settles out suspended sediment above a chosen size so it does not damage the turbine.',
      'Trashrack | Bars at the intake that keep floating debris and large objects out of the waterway.',
      'Water hammer | A pressure surge in a pipe caused by a sudden change in flow velocity, such as a fast valve closure.',
      'Pelton turbine | An impulse turbine, used for high head and relatively small flow.',
      'Francis turbine | A reaction turbine, used for medium head and medium flow.',
      'Surge tank | Limits pressure surges by letting the water level rise and fall between a headrace tunnel and the penstock.'
    ].join('\n'),
    'Nepali land units': [
      '1 ropani | 16 aana = 5,476 square feet (about 508.7 m²).',
      '1 aana | 4 paisa (about 31.8 m²).',
      '1 paisa | 4 daam (about 7.95 m²).',
      '1 bigha | 20 kattha = 72,900 square feet (about 6,772.6 m²).',
      '1 kattha | 20 dhur (about 338.6 m²).',
      'Where is the ropani used? | In the hills and mountains. The bigha-kattha-dhur system is used in the Terai.'
    ].join('\n')
  };
  var names = Object.keys(STARTERS);
  var deckText = T.store.get('fc:deck', null); if (deckText === null) deckText = STARTERS[names[0]];
  var states = T.store.get('fc:state', {}), cards = [], queue = [], pos = 0, flipped = false, today = C.dayNumber();

  root.innerHTML =
    '<div class="tcard"><h2>1. Your deck</h2><div class="tchips" id="fc-chips" role="group" aria-label="Starter decks"></div>' +
    '<label class="tfield hu-wide" style="margin-top:12px">Cards, one per line as: front | back (a tab also works)<textarea id="fc-text" class="tinput hu-area" rows="8" spellcheck="false"></textarea></label>' +
    '<p class="thint" id="fc-sum" aria-live="polite"></p>' +
    '<div class="fc-row"><button id="fc-due" class="tbtn tbtn--primary" type="button">Study due cards</button><button id="fc-all" class="tbtn" type="button">Study all, shuffled</button><button id="fc-reset" class="tbtn tbtn--small" type="button">Reset progress</button></div></div>' +
    '<div class="tcard" id="fc-study" hidden><p class="thint" id="fc-prog" style="margin:0 0 10px"></p>' +
    '<div class="fc-card" id="fc-card" tabindex="0" role="button" aria-label="Flip card"><div><div class="fc-side" id="fc-side"></div><div id="fc-face"></div></div></div>' +
    '<div class="fc-row"><button id="fc-again" class="tbtn" type="button" disabled>Again</button><button id="fc-know" class="tbtn tbtn--primary" type="button" disabled>Got it</button></div>' +
    '<p class="thint">Tap the card or press Space to flip. After flipping: right arrow = got it, left arrow = again.</p><div id="fc-done"></div></div>';

  function setChips() {
    var cur = $('#fc-text').value.trim();
    $('#fc-chips').innerHTML = names.map(function (n) { return '<button type="button" class="tchip" data-deck="' + n + '" aria-pressed="' + (STARTERS[n].trim() === cur) + '">' + n + '</button>'; }).join('');
  }
  function summary() {
    var p = C.parse($('#fc-text').value); cards = p.cards;
    var due = 0, mastered = 0; cards.forEach(function (c) { if (C.isDue(states[c.id], today)) due++; if (states[c.id] && states[c.id].box === 5) mastered++; });
    $('#fc-sum').textContent = cards.length + ' cards, ' + due + ' due today, ' + mastered + ' mastered' + (p.skipped ? '. ' + p.skipped + ' line(s) skipped (they need a | or tab between front and back).' : '.');
    T.store.set('fc:deck', $('#fc-text').value); setChips();
    $('#fc-due').disabled = !cards.length; $('#fc-all').disabled = !cards.length;
  }
  function show() {
    var done = $('#fc-done'); done.innerHTML = '';
    if (pos >= queue.length) {
      $('#fc-card').hidden = true; $('#fc-again').disabled = true; $('#fc-know').disabled = true; $('#fc-prog').textContent = '';
      done.innerHTML = '<div class="tmsg tmsg--win">Session finished. Cards you marked "Got it" come back after a longer gap each time.</div>'; summary(); return;
    }
    flipped = false; $('#fc-card').hidden = false;
    $('#fc-prog').textContent = 'Card ' + (pos + 1) + ' of ' + queue.length;
    $('#fc-side').textContent = 'Front'; $('#fc-face').textContent = queue[pos].f;
    $('#fc-again').disabled = true; $('#fc-know').disabled = true;
  }
  function flip() {
    if (pos >= queue.length) return;
    flipped = !flipped; $('#fc-side').textContent = flipped ? 'Back' : 'Front'; $('#fc-face').textContent = flipped ? queue[pos].b : queue[pos].f;
    $('#fc-again').disabled = false; $('#fc-know').disabled = false;
  }
  function answer(known) {
    if (pos >= queue.length) return; var c = queue[pos];
    states[c.id] = C.review(states[c.id], known, today); T.store.set('fc:state', states);
    if (!known) queue.push(c);
    pos++; show(); if (pos < queue.length) $('#fc-card').focus();
  }
  function start(all) {
    summary(); today = C.dayNumber();
    var list = all ? cards : cards.filter(function (c) { return C.isDue(states[c.id], today); });
    $('#fc-study').hidden = false;
    if (!list.length) { queue = []; pos = 0; $('#fc-card').hidden = true; $('#fc-prog').textContent = ''; $('#fc-done').innerHTML = '<div class="tmsg tmsg--info">Nothing is due today. Come back tomorrow, or study all cards.</div>'; return; }
    queue = C.shuffle(list, T.rnd); pos = 0; show(); $('#fc-card').focus();
  }

  $('#fc-text').value = deckText; summary();
  $('#fc-text').addEventListener('input', summary);
  $('#fc-chips').addEventListener('click', function (e) {
    var n = e.target && e.target.getAttribute && e.target.getAttribute('data-deck'); if (!n) return;
    var cur = $('#fc-text').value.trim(), isStarter = names.some(function (k) { return STARTERS[k].trim() === cur; });
    if (cur && !isStarter && !window.confirm('Replace the cards in the box with this starter deck?')) return;
    $('#fc-text').value = STARTERS[n]; summary();
  });
  $('#fc-due').addEventListener('click', function () { start(false); });
  $('#fc-all').addEventListener('click', function () { start(true); });
  $('#fc-reset').addEventListener('click', function () { if (window.confirm('Reset all progress for every card?')) { states = {}; T.store.set('fc:state', states); summary(); } });
  $('#fc-card').addEventListener('click', flip);
  $('#fc-card').addEventListener('keydown', function (e) {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); }
    else if (e.key === 'ArrowRight' && flipped) { e.preventDefault(); answer(true); }
    else if (e.key === 'ArrowLeft' && flipped) { e.preventDefault(); answer(false); }
  });
  $('#fc-know').addEventListener('click', function () { answer(true); });
  $('#fc-again').addEventListener('click', function () { answer(false); });
})();
