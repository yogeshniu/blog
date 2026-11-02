/* To-do list saved in this browser. */
(function () {
  var root = T.root, $ = T.$;
  var tasks = T.store.get('todo', []), filter = 'all';
  var PRI = { high: 0, normal: 1, low: 2 };

  root.innerHTML =
    '<div class="tcard"><div class="tgrid"><label class="tfield" style="grid-column:1/-1">New task' +
    '<input id="t-text" type="text" maxlength="200" placeholder="What needs to be done?" autocomplete="off"></label>' +
    '<label class="tfield">Priority<select id="t-pri"><option value="normal">Normal</option><option value="high">High</option><option value="low">Low</option></select></label>' +
    '<label class="tfield">Due date (optional)<input id="t-due" type="date"></label></div>' +
    '<p style="margin:14px 0 0"><button type="button" class="tbtn tbtn--primary" id="t-add">Add task</button></p></div>' +
    '<div class="tcard"><div class="trow" style="justify-content:space-between"><div class="tchips" id="t-filters"></div><span class="thint" id="t-left" style="margin:0"></span></div>' +
    '<ul class="tlist" id="t-list" style="margin-top:14px"></ul><p class="thint" id="t-empty">No tasks here. Add your first one above.</p>' +
    '<p style="margin:12px 0 0"><button type="button" class="tbtn tbtn--small" id="t-clear">Clear completed</button></p></div>';

  function save() { T.store.set('todo', tasks); }
  function visible() {
    return tasks.filter(function (t) { return filter === 'all' || (filter === 'active' ? !t.done : t.done); }).sort(function (a, b) {
      if (a.done !== b.done) return a.done ? 1 : -1;
      if (PRI[a.pri] !== PRI[b.pri]) return PRI[a.pri] - PRI[b.pri];
      return (a.due || '9999') < (b.due || '9999') ? -1 : 1;
    });
  }
  function render() {
    var ul = $('#t-list'); ul.innerHTML = '';
    var items = visible(), today = T.today();
    $('#t-empty').hidden = items.length > 0;
    items.forEach(function (t) {
      var li = document.createElement('li'); li.className = 'todo-item' + (t.done ? ' is-done' : '');
      var cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = t.done; cb.setAttribute('aria-label', 'Done');
      cb.addEventListener('change', function () { t.done = cb.checked; save(); render(); });
      var tx = document.createElement('span'); tx.className = 'todo-text'; tx.textContent = t.text;
      li.appendChild(cb); li.appendChild(tx);
      if (t.pri === 'high') { var h = document.createElement('span'); h.className = 'tbadge tbadge--high'; h.textContent = 'High'; li.appendChild(h); }
      if (t.pri === 'low') { var l = document.createElement('span'); l.className = 'tbadge'; l.textContent = 'Low'; li.appendChild(l); }
      if (t.due) { var d = document.createElement('span'); d.className = 'tbadge' + (!t.done && t.due < today ? ' tbadge--late' : ''); d.textContent = (!t.done && t.due < today ? 'Overdue · ' : 'Due ') + t.due; li.appendChild(d); }
      var x = document.createElement('button'); x.type = 'button'; x.className = 'tx'; x.setAttribute('aria-label', 'Delete task'); x.textContent = '×';
      x.addEventListener('click', function () { tasks = tasks.filter(function (z) { return z.id !== t.id; }); save(); render(); });
      li.appendChild(x); ul.appendChild(li);
    });
    var left = tasks.filter(function (t) { return !t.done; }).length;
    $('#t-left').textContent = left + (left === 1 ? ' task left' : ' tasks left');
    T.$$('#t-filters .tchip').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-f') === filter ? 'true' : 'false'); });
  }
  [['all', 'All'], ['active', 'Active'], ['done', 'Done']].forEach(function (f) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'tchip'; b.setAttribute('data-f', f[0]); b.textContent = f[1];
    b.addEventListener('click', function () { filter = f[0]; render(); }); $('#t-filters').appendChild(b);
  });
  function add() {
    var text = $('#t-text').value.trim(); if (!text) { $('#t-text').focus(); return; }
    tasks.push({ id: T.uid(), text: text, done: false, pri: $('#t-pri').value, due: $('#t-due').value || '' });
    save(); $('#t-text').value = ''; $('#t-due').value = ''; $('#t-text').focus(); render();
  }
  $('#t-add').addEventListener('click', add);
  $('#t-text').addEventListener('keydown', function (e) { if (e.key === 'Enter') add(); });
  $('#t-clear').addEventListener('click', function () { tasks = tasks.filter(function (t) { return !t.done; }); save(); render(); });
  render();
})();
