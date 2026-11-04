#!/usr/bin/env python3
"""Create a new tool for the Tools section.

    python3 scripts/new-tool.py "Word Counter" --group Focus --icon "🔢" --desc "Count words and characters."

It creates two files (and refuses to overwrite existing ones):
    content/tools/<slug>.md        the page (title, description, category)
    assets/js/tools/<id>.js        the tool's code, with a working starter example

Then run `hugo server` and open /tools/. Full guide: docs/ADDING-A-TOOL.md
"""
import argparse, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def groups():
    path = os.path.join(ROOT, "data", "tool_groups.yaml")
    return re.findall(r"^- key:\s*(\S+)", open(path, encoding="utf-8").read(), re.M)

def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("title", help='Tool name, e.g. "Word Counter"')
    ap.add_argument("--group", default="Focus", help="category key from data/tool_groups.yaml (default: Focus)")
    ap.add_argument("--icon", default="🧰", help="one emoji for the card")
    ap.add_argument("--desc", default="", help="one-line description shown on the Tools page")
    ap.add_argument("--weight", type=int, default=50, help="order inside its category (smaller = earlier)")
    a = ap.parse_args()

    known = groups()
    if a.group not in known:
        sys.exit(f"Unknown group '{a.group}'. Choose one of: {', '.join(known)} (or add it to data/tool_groups.yaml).")
    slug = re.sub(r"[^a-z0-9]+", "-", a.title.lower()).strip("-")
    tool_id = slug.replace("-", "")
    if not slug:
        sys.exit("Please give the tool a name with letters or numbers.")
    page = os.path.join(ROOT, "content", "tools", slug + ".md")
    code = os.path.join(ROOT, "assets", "js", "tools", tool_id + ".js")
    for p in (page, code):
        if os.path.exists(p):
            sys.exit(f"Already exists, not overwriting: {os.path.relpath(p, ROOT)}")
    desc = (a.desc or f"{a.title}.").replace('"', "'")

    open(page, "w", encoding="utf-8").write(f'''+++
title = "{a.title.replace('"', "'")}"
description = "{desc}"
layout = "tool"
tool = "{tool_id}"
weight = {a.weight}
group = "{a.group}"
icon = "{a.icon}"
hideMeta = true
ShowToc = false
comments = false
+++

Optional text shown under the tool (notes, sources, how to use it). Delete this line if you do not need it.
''')
    open(code, "w", encoding="utf-8").write(f'''/* {a.title}
   Helpers you can use (see assets/js/tools/common.js):
     T.root                    the empty box your tool draws into
     T.$(sel) / T.$$(sel)      find one / many elements
     T.store.get(k, default)   read something saved on this device     T.store.set(k, value)   save it
     T.today()                 today's date as YYYY-MM-DD              T.uid()   a unique id
     T.rnd(n)                  random whole number from 0 to n-1       T.num(text)   text to number (NaN if not a number)
   Ready-made look: classes tcard, tfield, tbtn, tbtn--primary, tchip, tresult, tlist, thint (see assets/css/tools.css).
   Safety: show anything a visitor types with .textContent, never .innerHTML. */
(function () {{
  var root = T.root, $ = T.$;
  var count = T.store.get('{tool_id}-count', 0);

  root.innerHTML =
    '<div class="tcard"><h2>Try it</h2>' +
    '<label class="tfield">Your text<input id="x-in" type="text" placeholder="Type something" autocomplete="off"></label>' +
    '<p style="margin:14px 0 0"><button type="button" class="tbtn tbtn--primary" id="x-go">Go</button></p>' +
    '<div class="tresult" id="x-out" aria-live="polite">Nothing yet.</div></div>';

  $('#x-go').addEventListener('click', function () {{
    var text = $('#x-in').value.trim();
    count++; T.store.set('{tool_id}-count', count);              // remembered even after the page is closed
    $('#x-out').textContent = text ? 'You typed ' + text.length + ' characters. Uses so far: ' + count : 'Please type something first.';
  }});
}})();
''')
    print(f"Created:\n  {os.path.relpath(page, ROOT)}\n  {os.path.relpath(code, ROOT)}\nNext: run  hugo server  and open /tools/{slug}/")

main()
