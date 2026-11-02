/* Daily streaks: tick habits each day, see the streak grow. */
(function () {
  var root = T.root, $ = T.$;
  var habits = T.store.get('habits', []);
  var DAYS = 14;

  root.innerHTML =
    '<div class="tcard"><h2>Dream · Discipline · Dedication</h2><div class="trow"><label class="tfield" style="flex:1;min-width:220px">New habit' +
    '<input id="h-name" type="text" maxlength="60" placeholder="for example: Study 1 hour, Walk, Write code" autocomplete="off"></label>' +
    '<button type="button" class="tbtn tbtn--primary" id="h-add" style="align-self:flex-end">Add habit</button></div>' +
    '<p class="thint">Tick today when you have done it. You can also tap a past day to fill it in or undo it.</p></div><div id="h-list"></div>' +
    '<p class="thint" id="h-empty">No habits yet. Start with one small thing you can do every day.</p>';

  function save() { T.store.set('habits', habits); }
  function dayAt(offset) { var d = new Date(); d.setDate(d.getDate() - offset); return d; }
  function current(h) {
    var n = 0, off = h.days[T.key(dayAt(0))] ? 0 : 1;
    while (h.days[T.key(dayAt(off + n))]) n++;
    return n;
  }
  function best(h) {
    var keys = Object.keys(h.days).filter(function (k) { return h.days[k]; }).sort(), b = 0, run = 0, prev = null;
    keys.forEach(function (k) {
      var d = new Date(k + 'T00:00:00');
      if (prev && Math.round((d - prev) / 86400000) === 1) run++; else run = 1;
      if (run > b) b = run; prev = d;
    });
    return b;
  }
  function render() {
    var box = $('#h-list'); box.innerHTML = ''; $('#h-empty').hidden = habits.length > 0;
    habits.forEach(function (h) {
      var card = document.createElement('div'); card.className = 'tcard habit';
      var head = document.createElement('div'); head.className = 'habit-head';
      var name = document.createElement('span'); name.className = 'habit-name'; name.textContent = h.name;
      var streak = document.createElement('span'); streak.className = 'habit-streak';
      var c = current(h); streak.innerHTML = '<b>' + c + '</b> day' + (c === 1 ? '' : 's') + ' in a row · best ' + best(h);
      var tick = document.createElement('button'); tick.type = 'button';
      var doneToday = !!h.days[T.today()]; tick.className = 'tbtn' + (doneToday ? '' : ' tbtn--primary'); tick.textContent = doneToday ? 'Done today ✓' : 'Mark today done';
      tick.addEventListener('click', function () { h.days[T.today()] = !doneToday; save(); render(); });
      var del = document.createElement('button'); del.type = 'button'; del.className = 'tx'; del.setAttribute('aria-label', 'Delete habit'); del.textContent = '×';
      del.addEventListener('click', function () { if (confirm('Delete “' + h.name + '” and its history?')) { habits = habits.filter(function (z) { return z.id !== h.id; }); save(); render(); } });
      var right = document.createElement('div'); right.className = 'trow'; right.appendChild(streak); right.appendChild(tick); right.appendChild(del);
      head.appendChild(name); head.appendChild(right); card.appendChild(head);
      var days = document.createElement('div'); days.className = 'days'; days.setAttribute('aria-label', 'Last ' + DAYS + ' days');
      for (var i = DAYS - 1; i >= 0; i--) (function (i) {
        var d = dayAt(i), k = T.key(d), b = document.createElement('button'); b.type = 'button';
        b.className = 'day' + (h.days[k] ? ' on' : '') + (i === 0 ? ' today' : ''); b.textContent = d.getDate();
        b.title = d.toDateString(); b.setAttribute('aria-pressed', h.days[k] ? 'true' : 'false');
        b.addEventListener('click', function () { h.days[k] = !h.days[k]; save(); render(); }); days.appendChild(b);
      })(i);
      card.appendChild(days); box.appendChild(card);
    });
  }
  function add() {
    var n = $('#h-name').value.trim(); if (!n) { $('#h-name').focus(); return; }
    habits.push({ id: T.uid(), name: n, days: {} }); save(); $('#h-name').value = ''; render();
  }
  $('#h-add').addEventListener('click', add);
  $('#h-name').addEventListener('keydown', function (e) { if (e.key === 'Enter') add(); });
  render();
})();
