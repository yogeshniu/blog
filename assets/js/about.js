/* About page interactions: tabs, filters, search, section highlight, counters, copy buttons.
   Everything still reads fine if this script does not run. */
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- tabs (Experience / Education) ---- */
  var tabs = $$('.a-tabs [role="tab"]'), panels = $$('.a-panel');
  function showTab(name, focus) {
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-tab') === name;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    panels.forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== name; });
  }
  if (tabs.length) {
    showTab('exp');
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { showTab(t.getAttribute('data-tab')); });
      t.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        var n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
        showTab(n.getAttribute('data-tab'), true);
      });
    });
  }

  /* ---- publication filter ---- */
  var chips = $$('.a-chips button'), pubs = $$('.a-pub');
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      var f = c.getAttribute('data-filter');
      chips.forEach(function (x) { var on = x === c; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      pubs.forEach(function (p) { p.hidden = !(f === 'all' || p.getAttribute('data-type') === f); });
    });
  });

  /* ---- certificate search ---- */
  var box = $('#cert-filter'), certs = $$('.a-cert'), count = $('#cert-count'), none = $('#cert-empty');
  if (box) box.addEventListener('input', function () {
    var q = box.value.trim().toLowerCase(), shown = 0;
    certs.forEach(function (li) {
      var ok = !q || li.textContent.toLowerCase().indexOf(q) !== -1;
      li.hidden = !ok; if (ok) shown++;
    });
    count.textContent = shown + ' of ' + certs.length;
    none.hidden = shown !== 0;
  });

  /* ---- highlight the current section in the sticky nav ---- */
  var links = $$('.a-nav a');
  if ('IntersectionObserver' in window && links.length) {
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove('is-active'); });
        var a = map[en.target.id]; if (a) a.classList.add('is-active');
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
  }
  links.forEach(function (a) {
    a.addEventListener('click', function (e) {
      var t = document.getElementById(a.getAttribute('href').slice(1));
      if (!t) return; e.preventDefault();
      t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', a.getAttribute('href'));
    });
  });

  /* ---- count-up numbers + fade-in on scroll ---- */
  function countUp(el) {
    var end = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (reduce || end === 0) { el.textContent = end; return; }
    var start = null, dur = 900;
    function tick(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    }
    el.textContent = '0'; requestAnimationFrame(tick);
  }
  var reveals = $$('.a-hero, .a-stats, .a-section');
  reveals.forEach(function (el) { el.classList.add('a-reveal'); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        $$('[data-count]', en.target).forEach(countUp);
        io.unobserve(en.target);
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---- copy buttons (email, citations) ---- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-copy]');
    if (!b) return;
    var text = b.getAttribute('data-copy'), done = b.getAttribute('data-copied') || 'Copied!', old = b.textContent;
    function ok() { b.textContent = done; setTimeout(function () { b.textContent = old; }, 1600); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, ok);
    else {
      var ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (err) {} document.body.removeChild(ta); ok();
    }
  });
})();
