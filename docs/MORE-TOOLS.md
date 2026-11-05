# Land converter, flow duration curve, hydrology formulas, citation maker, flashcards

| Page (`content/tools/`) | Group | Page script | Logic library |
|---|---|---|---|
| land-area-converter | Nepali tools | land.js (card renderer) | landlib.js |
| flow-duration-curve | Engineering | fdc.js | fdclib.js |
| hydrology-formulas | Engineering | hydrology.js (card renderer) | hydrologylib.js |
| citation-maker | Learn | cite.js | citelib.js |
| flashcards | Learn | flashcards.js | cardslib.js |

Pattern: the **library** (`window.XxxLib`) holds the logic and has no DOM code, so it can be tested in Node. The **page script** builds the interface. Pages list their libraries in `scripts = [...]` in the front matter. `land.js` and `hydrology.js` reuse `hydroui.js` (see `HYDRO-TOOLS.md`).

## Tests (no browser needed)
    node scripts/test-new-tools.js    # libraries against hand-worked answers
    node scripts/test-new-pages.js    # page scripts against a small fake DOM
    node scripts/test-hydro-tools.js  # hydropower design tools

## Notes
- **Land units:** 1 ropani = 5,476 ft², 1 bigha = 72,900 ft², 1 ft² = 0.09290304 m². Change `LandLib` if you want another definition.
- **Flow duration curve:** Weibull plotting position P = m/(n+1); chart is inline SVG, no chart library.
- **Citations:** styles are in `citelib.js` (`apa`, `harvard`, `ieee`, `bibtex`). To add a source type, add a branch in each.
- **Flashcards:** progress is stored in `localStorage` under `ysn:fc:deck` and `ysn:fc:state`. Review intervals are in `CardsLib.INTERVALS`.
