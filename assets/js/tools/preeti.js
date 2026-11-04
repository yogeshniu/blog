/* Unicode <-> Preeti converter. Conversion engine: @lacspace/preeti (see assets/js/vendor/preeti.js for its notice). */
(function () {
  var root = T.root, $ = T.$, P = window.PreetiLib, mode = T.store.get('preeti-mode', 'u2p');
  var SAMPLE = { u2p: '\u0928\u0947\u092A\u093E\u0932 \u0938\u0930\u0915\u093E\u0930\u0915\u093E \u092A\u094D\u0930\u0927\u093E\u0928\u092E\u0928\u094D\u0924\u094D\u0930\u0940\u0932\u0947 \u0906\u0930\u094D\u0925\u093F\u0915 \u0938\u0941\u0927\u093E\u0930\u0915\u094B \u0918\u094B\u0937\u0923\u093E \u0917\u0930\u094D\u0928\u0941\u092D\u092F\u094B \u0964',
                 p2u: "g]kfn ;/sf/sf k|wfgdGqLn] cfly{s ;'wf/sf] 3f]if0ff ug'{eof] ." };

  root.innerHTML =
    '<div class="tcard"><div class="tchips" role="group" aria-label="Direction"><button type="button" class="tchip" id="p-u2p">Unicode \u2192 Preeti</button><button type="button" class="tchip" id="p-p2u">Preeti \u2192 Unicode</button></div>' +
    '<div class="tgrid pr-grid" style="margin-top:16px"><label class="tfield" id="p-inlab">Your text<textarea id="p-in" class="tinput pr-box" rows="8" spellcheck="false" placeholder="Type or paste here"></textarea></label>' +
    '<label class="tfield" id="p-outlab">Result<textarea id="p-out" class="tinput pr-box" rows="8" readonly spellcheck="false"></textarea></label></div>' +
    '<div class="trow" style="margin-top:14px"><button type="button" class="tbtn tbtn--primary" id="p-copy">Copy result</button><button type="button" class="tbtn" id="p-swap">Swap</button><button type="button" class="tbtn" id="p-sample">Try a sample</button><button type="button" class="tbtn" id="p-clear">Clear</button>' +
    '<label class="trow" id="p-mixrow" style="margin-left:auto" hidden><input type="checkbox" id="p-mix" style="accent-color:var(--accent)"> Text mixes English and Preeti</label></div>' +
    '<p class="thint" id="p-count"></p><div id="p-hint" aria-live="polite"></div></div>' +
    '<div class="tcard"><h2>About Preeti</h2><p class="thint" style="margin-top:0">Preeti is an older font where Latin keys draw Nepali letters, so the text looks like <code>g]kfn</code> unless the Preeti font is installed. ' +
    'Modern websites, phones and Google Docs use Unicode (\u0928\u0947\u092A\u093E\u0932). Use \u201CUnicode \u2192 Preeti\u201D when a printer, office form or older document needs Preeti, and paste the result into a document set in the Preeti font. ' +
    'If you have the Preeti font installed, the result box will show Nepali letters automatically.</p></div>';

  function Dev(s) { return /[\u0900-\u097F]/.test(s); }
  function convert(text) {
    if (!text) return '';
    if (mode === 'u2p') return P.unicodeToPreeti(text);
    return $('#p-mix').checked ? P.convertMixed(text) : P.preetiToUnicode(text);
  }
  function lay() {
    $('#p-u2p').setAttribute('aria-pressed', mode === 'u2p'); $('#p-p2u').setAttribute('aria-pressed', mode === 'p2u');
    $('#p-inlab').firstChild.nodeValue = mode === 'u2p' ? 'Nepali text (Unicode)' : 'Preeti text';
    $('#p-outlab').firstChild.nodeValue = mode === 'u2p' ? 'Preeti result' : 'Nepali result (Unicode)';
    $('#p-mixrow').hidden = mode !== 'p2u';
    $('#p-in').style.fontFamily = mode === 'u2p' ? '' : 'Preeti, "Preeti Normal", var(--font-sans), monospace';
    $('#p-out').style.fontFamily = mode === 'u2p' ? 'Preeti, "Preeti Normal", var(--font-sans), monospace' : '';
    $('#p-in').lang = mode === 'u2p' ? 'ne' : 'en'; $('#p-out').lang = mode === 'u2p' ? 'en' : 'ne';
  }
  function run() {
    var v = $('#p-in').value, out = convert(v);
    $('#p-out').value = out;
    $('#p-count').textContent = v.length ? v.length.toLocaleString() + ' characters in \u00B7 ' + out.length.toLocaleString() + ' out' : '';
    var h = $('#p-hint'); h.innerHTML = '';
    function hint(txt, btn, fn) {
      var p = document.createElement('p'); p.className = 'tmsg tmsg--info'; p.textContent = txt + ' ';
      if (btn) { var b = document.createElement('button'); b.type = 'button'; b.className = 'tbtn tbtn--small'; b.textContent = btn; b.addEventListener('click', fn); p.appendChild(b); }
      h.appendChild(p);
    }
    if (v && mode === 'u2p' && !Dev(v) && P.looksLikePreeti(v)) hint('This looks like Preeti text already.', 'Switch to Preeti \u2192 Unicode', function () { setMode('p2u'); });
    else if (v && mode === 'p2u' && Dev(v)) hint('This already contains Nepali Unicode letters. Preeti \u2192 Unicode will leave them as they are.');
  }
  function setMode(m) { mode = m; T.store.set('preeti-mode', m); lay(); run(); }
  $('#p-u2p').addEventListener('click', function () { setMode('u2p'); });
  $('#p-p2u').addEventListener('click', function () { setMode('p2u'); });
  $('#p-in').addEventListener('input', run); $('#p-mix').addEventListener('change', run);
  $('#p-sample').addEventListener('click', function () { $('#p-in').value = SAMPLE[mode]; run(); });
  $('#p-clear').addEventListener('click', function () { $('#p-in').value = ''; run(); $('#p-in').focus(); });
  $('#p-swap').addEventListener('click', function () { var o = $('#p-out').value; $('#p-in').value = o; setMode(mode === 'u2p' ? 'p2u' : 'u2p'); });
  $('#p-copy').addEventListener('click', function () {
    var b = this, old = b.textContent, txt = $('#p-out').value;
    function ok() { b.textContent = 'Copied'; setTimeout(function () { b.textContent = old; }, 1200); }
    if (navigator.clipboard) navigator.clipboard.writeText(txt).then(ok, ok); else { $('#p-out').select(); try { document.execCommand('copy'); } catch (e) {} ok(); }
  });
  lay(); run();
})();
