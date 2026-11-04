# Adding a new tool

Every tool is two small files. The Tools page, menu, search and styling pick it up automatically.

## Quick way

    python3 scripts/new-tool.py "Word Counter" --group Focus --icon "🔢" --desc "Count words and characters."

This creates:

| File | What it is |
|---|---|
| `content/tools/word-counter.md` | the page: title, one-line description, category, icon |
| `assets/js/tools/wordcounter.js` | the code, with a small working example to edit |

Open it with `hugo server` at `/tools/word-counter/`. Replace the example code with your own.

## Categories

Categories live in `data/tool_groups.yaml`. To add one, add a block there and use its `key` as the tool's `group`.
A tool with an unknown group still appears, under "More tools".

## What you can use in your code

`common.js` gives every tool a small toolbox, named `T`:

| Helper | Use |
|---|---|
| `T.root` | the empty box your tool draws into |
| `T.$(selector)`, `T.$$(selector)` | find one or many elements |
| `T.store.get(name, fallback)`, `T.store.set(name, value)` | save and read data on the visitor's device |
| `T.today()`, `T.key(date)` | dates as `YYYY-MM-DD` |
| `T.uid()`, `T.rnd(n)`, `T.num(text)` | unique id, random number, safe text-to-number |

Ready-made styles (`assets/css/tools.css`): `tcard`, `tgrid`, `tfield`, `tbtn`, `tbtn--primary`, `tchip`, `tresult`, `tlist`, `thint`, `tmsg`.
Colours come from the site theme, so dark mode works automatically.

## Using a shared script or a library

List extra scripts, loaded before your tool, in the page's front matter (paths are inside `assets/js/`):

    scripts = ["tools/bs"]          # shared Nepali calendar engine
    scripts = ["vendor/preeti"]     # a third-party library kept in assets/js/vendor/

Keep any library's licence file next to it.

## Good habits

- Show anything a visitor types with `.textContent`, not `.innerHTML`.
- Make it work from the keyboard (Enter to submit) and give buttons real text or an `aria-label`.
- Say where data or formulas come from, and what is only an estimate. Put that in the page body (the text under the front matter).
- Keep everything in the browser: no sending of visitors' data anywhere.
- Test it: open the page in light and dark mode and on a phone-width window.

## Removing a tool

Delete its two files. Nothing else needs to change.
