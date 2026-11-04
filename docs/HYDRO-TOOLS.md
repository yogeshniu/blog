# Hydropower design tools

Eight tool pages under *Tools → Engineering calculators*, ported from a run-of-river headworks design workbook.

| Page (`content/tools/`) | Script (`assets/js/tools/`) | Calculators on the page |
|---|---|---|
| settling-basin-design | settlingbasin.js | basin size / efficiency / storage, flushing orifice |
| gravel-trap-design | gravel.js | gravel trap, flushing opening and pipes |
| intake-trashrack-design | intake.js | intake and trashrack, pipe submergence, air vent |
| culvert-canal-flow | culvert.js | culvert normal depth, slope comparison |
| spillway-stilling-basin | spillway.js | gated spillway, ogee profile, stilling basin, ski-jump, cavitation |
| headpond-spillway-design | headpond.js | headpond storage, headpond spillway |
| reservoir-peaking-storage | reservoir.js | area-elevation storage and peaking hours |
| headworks-headloss | headloss.js | stage-by-stage head loss |

## How it fits together
- `hydrolib.js` holds **all the formulas** (`window.HydroCalc`). Each function returns `{ inputs, results, checks }`. To change a formula, edit it here.
- `hydroui.js` draws a calculator card from a short description (fields, result rows, checks). A tool page is only a list of those descriptions.
- Each page lists `scripts = ["tools/hydrolib", "tools/hydroui"]` in its front matter.

## Adding a calculator to a page
Add a section to the page's script:

    { title: 'My check', fields: [['Q', 'Discharge (m³/s)', 12.5]],
      run: function (v) { return HydroCalc.culvert({ ... }); },
      rows: [['Velocity', 'v', 'm/s', 3]] }

`fields` entries are `[key, label, default]`; a plain string makes a sub-heading. `rows` entries are `[label, 'resultKey' or function, unit, decimals]`.

## Testing without a browser
    node scripts/test-hydro-tools.js

Runs every card with its default values, checks for errors and checks internal consistency (independent re-calculations).

## Known limits
Charts and tables are inputs, not calculated: Camp's efficiency diagram, the fall-velocity graph, the Shields diagram and the gate discharge-coefficient curves. These are preliminary-design aids; check results against the governing guideline.
