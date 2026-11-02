/* Shared helpers for the tools. Everything stays in the visitor's browser. */
window.T = (function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem('ysn:' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('ysn:' + k, JSON.stringify(v)); } catch (e) {} }
  };
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function key(d) { d = d || new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function rnd(n) { return Math.floor(Math.random() * n); }
  function num(v) { var x = parseFloat(String(v).replace(',', '.')); return isFinite(x) ? x : NaN; }
  return { $: $, $$: $$, store: store, pad: pad, key: key, today: function () { return key(); }, uid: uid, rnd: rnd, num: num,
           root: document.getElementById('tool-root') };
})();
