/* Reference formatting: APA 7, Harvard (Cite Them Right style), IEEE and BibTeX.
   Output uses *asterisks* to mark italics; use CiteLib.html() or CiteLib.plain() to render.
   Titles are used exactly as typed (capitalisation is not changed). */
window.CiteLib = (function () {
  function clean(s) { return String(s == null ? '' : s).replace(/\*/g, '').replace(/\s+/g, ' ').trim(); }
  function endDot(s) { return /[.?!]$/.test(s) ? s : s + '.'; }
  var MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var MONS = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];

  /* "Last, First Middle" or "First Last", one per line (or separated by ;). "org: Name" for an organisation. */
  function parseAuthors(text) {
    return String(text || '').split(/\n|;/).map(clean).filter(Boolean).map(function (l) {
      if (/^org:/i.test(l)) return { org: clean(l.replace(/^org:/i, '')) };
      if (l.indexOf(',') > -1) { var p = l.split(','); return { last: clean(p[0]), first: clean(p.slice(1).join(' ')) }; }
      var w = l.split(' '); if (w.length === 1) return { org: l };
      return { last: w[w.length - 1], first: w.slice(0, -1).join(' ') };
    });
  }
  function initials(first, joiner) {
    return first.split(/\s+/).filter(Boolean).map(function (n) {
      return n.split('-').map(function (x) { return x.charAt(0).toUpperCase() + '.'; }).join('-');
    }).join(joiner);
  }
  function name(a, style) {
    if (a.org) return a.org;
    if (!a.first) return a.last;
    if (style === 'ieee') return initials(a.first, ' ') + ' ' + a.last;
    return a.last + ', ' + initials(a.first, style === 'harvard' ? '' : ' ');
  }
  function list(A, style) {
    var n = A.map(function (a) { return name(a, style); }), k = n.length;
    if (!k) return '';
    if (k === 1) return n[0];
    if (style === 'apa') {
      if (k > 20) return n.slice(0, 19).join(', ') + ', . . . ' + n[k - 1];
      return k === 2 ? n[0] + ', & ' + n[1] : n.slice(0, -1).join(', ') + ', & ' + n[k - 1];
    }
    if (style === 'harvard') {
      if (k >= 4) return n[0] + ' et al.';
      return k === 2 ? n[0] + ' and ' + n[1] : n[0] + ', ' + n[1] + ' and ' + n[2];
    }
    if (k > 6) return n[0] + ' et al.';
    return k === 2 ? n[0] + ' and ' + n[1] : n.slice(0, -1).join(', ') + ', and ' + n[k - 1];
  }
  function pagesOf(p) { return clean(p).replace(/\s*[-–—]+\s*/, '–'); }
  function dateParts(iso) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(clean(iso)); return m ? { y: +m[1], m: +m[2], d: +m[3] } : null; }
  function doiOf(s) {
    var t = clean(s).replace(/^https?:\/\/(dx\.)?doi\.org\//i, '').replace(/^doi:\s*/i, '');
    return /^10\.\S+\/\S+/.test(t) ? t : '';
  }
  function norm(d) {
    var o = {}; ['year', 'title', 'container', 'volume', 'issue', 'pages', 'publisher', 'place', 'edition', 'reportNo', 'link', 'accessed'].forEach(function (k) { o[k] = clean(d[k]); });
    o.doi = doiOf(o.link); o.url = o.doi ? '' : o.link;
    o.edition = o.edition.replace(/\s*(ed\.?|edn\.?|edition)$/i, '');
    o.pages = pagesOf(o.pages); o.multi = /–/.test(o.pages); o.dp = dateParts(o.accessed);
    return o;
  }
  function join(a) { return a.filter(Boolean).join(' '); }

  function apa(t, d, A) {
    var au = list(A, 'apa'), y = '(' + (d.year || 'n.d.') + ').', url = d.doi ? 'https://doi.org/' + d.doi : d.url;
    var lead = au ? [endDot(au), y] : [];
    function title(extra) { var s = '*' + d.title + '*' + (extra ? ' ' + extra : ''); return (extra || !/[.?!]$/.test(d.title)) ? s + '.' : s; }
    var body;
    if (t === 'article') {
      var src = d.container ? '*' + d.container + '*' + (d.volume ? ', *' + d.volume + '*' : '') + (d.issue ? '(' + d.issue + ')' : '') + (d.pages ? ', ' + d.pages : '') + '.' : '';
      body = [endDot(d.title), src, url];
      return join(au ? lead.concat(body) : [endDot(d.title), y, src, url]);
    }
    if (t === 'book') body = [title(d.edition ? '(' + d.edition + ' ed.)' : ''), d.publisher && endDot(d.publisher), url];
    else if (t === 'report') body = [title(d.reportNo ? '(Report No. ' + d.reportNo + ')' : ''), d.publisher && endDot(d.publisher), url];
    else body = [title(''), d.container && endDot(d.container), url];
    return join(au ? lead.concat(body) : [body[0], y].concat(body.slice(1)));
  }

  function harvard(t, d, A) {
    var au = list(A, 'harvard'), y = '(' + (d.year || 'no date') + ')', acc = d.dp ? d.dp.d + ' ' + MON[d.dp.m - 1] + ' ' + d.dp.y : '';
    var avail = d.doi ? 'doi:' + d.doi : d.url ? 'Available at: ' + d.url + (acc ? ' (Accessed: ' + acc + ')' : '') : '';
    var ital = '*' + d.title + '*';
    if (t === 'article') {
      var ref = [d.container && '*' + d.container + '*', (d.volume || d.issue) && (d.volume + (d.issue ? '(' + d.issue + ')' : '')), d.pages && (d.multi ? 'pp. ' : 'p. ') + d.pages].filter(Boolean).join(', ');
      return join(au ? [au, y, "'" + d.title + "',", ref + '.', avail] : ["'" + d.title + "'", y, ref + '.', avail]);
    }
    var pub = (d.place ? d.place + ': ' : '') + d.publisher;
    var tail;
    if (t === 'book') tail = [d.edition && d.edition + ' edn.', d.publisher && endDot(pub), avail];
    else if (t === 'report') tail = [d.reportNo && '(Report No. ' + d.reportNo + ').', d.publisher && endDot(pub), avail];
    else tail = [d.container && endDot(d.container), avail];
    return join(au ? [au, y, endDot(ital)].concat(tail) : [endDot(ital), y].concat(tail));
  }

  function ieee(t, d, A) {
    var au = list(A, 'ieee'), acc = d.dp ? MONS[d.dp.m - 1] + ' ' + d.dp.d + ', ' + d.dp.y : '', q = '“' + d.title + ',”';
    var s, lead = au ? au + ', ' : '';
    if (t === 'article') {
      var parts = [d.container && '*' + d.container + '*', d.volume && 'vol. ' + d.volume, d.issue && 'no. ' + d.issue, d.pages && (d.multi ? 'pp. ' : 'p. ') + d.pages, d.year, d.doi && 'doi: ' + d.doi].filter(Boolean).join(', ');
      s = lead + q + ' ' + parts + '.';
      if (!d.doi && d.url) s = s.replace(/\.$/, '') + '. [Online]. Available: ' + d.url;
      return s.replace(/\s+/g, ' ');
    }
    if (t === 'book') return (lead + '*' + d.title + '*' + (d.edition ? ', ' + d.edition + ' ed' : '') + '. ' + (d.place ? d.place + ': ' : '') + d.publisher + (d.year ? ', ' + d.year : '') + '.').replace(/\.\./g, '.');
    if (t === 'report') return lead + q + ' ' + [d.publisher, d.place, d.reportNo && 'Rep. ' + d.reportNo, d.year].filter(Boolean).join(', ') + '.';
    return join([lead + q, d.container && endDot(d.container), d.url, acc && '(accessed ' + acc + ').']);
  }

  function bibtex(t, d, A) {
    var key = ((A[0] && (A[0].last || A[0].org) || 'ref').toLowerCase().replace(/[^a-z]/g, '') + (d.year || '') +
      ((d.title.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(function (w) { return w.length > 3; })[0]) || '')) || 'ref';
    var au = A.map(function (a) { return a.org ? '{' + a.org + '}' : a.last + (a.first ? ', ' + a.first : ''); }).join(' and ');
    var kind = { article: 'article', book: 'book', web: 'misc', report: 'techreport' }[t];
    var f = [['author', au], ['title', d.title], ['year', d.year]];
    if (t === 'article') f.push(['journal', d.container], ['volume', d.volume], ['number', d.issue], ['pages', d.pages.replace('–', '--')], ['doi', d.doi], ['url', d.url]);
    else if (t === 'book') f.push(['edition', d.edition], ['publisher', d.publisher], ['address', d.place], ['doi', d.doi], ['url', d.url]);
    else if (t === 'report') f.push(['institution', d.publisher], ['address', d.place], ['number', d.reportNo], ['url', d.url || (d.doi && 'https://doi.org/' + d.doi)]);
    else f.push(['howpublished', d.url ? '\\url{' + d.url + '}' : ''], ['note', d.container + (d.accessed ? ' (accessed ' + d.accessed + ')' : '')]);
    return '@' + kind + '{' + key + ',\n' + f.filter(function (x) { return x[1]; }).map(function (x) { return '  ' + x[0] + ' = {' + x[1] + '}'; }).join(',\n') + '\n}';
  }

  /* type: article | book | web | report.  data fields: authors, year, title, container, volume, issue, pages,
     publisher, place, edition, reportNo, link (DOI or URL), accessed (yyyy-mm-dd) */
  function format(type, data) {
    var d = norm(data), A = parseAuthors(data.authors);
    if (!d.title) throw new Error('Add a title.');
    return { apa: apa(type, d, A), harvard: harvard(type, d, A), ieee: ieee(type, d, A), bibtex: bibtex(type, d, A) };
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  return { format: format, parseAuthors: parseAuthors, plain: function (s) { return s.replace(/\*/g, ''); },
    html: function (s) { return esc(s).replace(/\*([^*]+)\*/g, '<i>$1</i>'); } };
})();
