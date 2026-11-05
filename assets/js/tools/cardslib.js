/* Flashcards: parsing and a simple spaced-repetition schedule (Leitner boxes 0-5). */
window.CardsLib = (function () {
  var INTERVALS = [0, 1, 3, 7, 14, 30]; /* days until a card is due again, by box */
  function hash(s) { var h = 5381; for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); }
  /* One card per line: "front | back" (also a tab or "::"). */
  function parse(text) {
    var cards = [], seen = {}, skipped = 0;
    String(text || '').split(/\r?\n/).forEach(function (ln) {
      var t = ln.trim(); if (!t) return;
      var i, sep = 0;
      if ((i = t.indexOf('\t')) > -1) sep = 1; else if ((i = t.indexOf('|')) > -1) sep = 1; else if ((i = t.indexOf('::')) > -1) sep = 2;
      if (!sep) { skipped++; return; }
      var f = t.slice(0, i).trim(), b = t.slice(i + sep).trim();
      if (!f || !b) { skipped++; return; }
      var id = hash(f + '\u0001' + b); if (seen[id]) return; seen[id] = 1;
      cards.push({ id: id, f: f, b: b });
    });
    return { cards: cards, skipped: skipped };
  }
  function dayNumber(d) { d = d || new Date(); return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5); }
  function isDue(st, today) { return !st || st.due <= today; }
  function review(st, known, today) { var box = known ? Math.min(((st && st.box) || 0) + 1, 5) : 0; return { box: box, due: today + INTERVALS[box] }; }
  function shuffle(a, rnd) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = rnd(i + 1), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  return { INTERVALS: INTERVALS, parse: parse, dayNumber: dayNumber, isDue: isDue, review: review, shuffle: shuffle };
})();
