+++
title = "Hydrology Formulas"
description = "Common hydrology formulas with small calculators: rational method, time of concentration, SCS runoff, Gumbel floods and risk."
layout = "tool"
tool = "hydrology"
scripts = ["tools/hydrologylib", "tools/hydroui"]
weight = 50
group = "Engineering"
icon = "🧮"
hideMeta = true
ShowToc = false
comments = false
+++

## Formula sheet

| Topic | Formula | Units and notes |
|---|---|---|
| Rational method | Q = C · i · A / 360 | Q m³/s, i mm/h, A ha |
| Time of concentration (Kirpich) | tc = 0.0195 · L^0.77 · S^−0.385 | tc min, L m, S m/m |
| SCS curve number | S = 25400/CN − 254, Ia = 0.2 S, Q = (P − Ia)² / (P − Ia + S) | all in mm |
| Gumbel frequency factor | K = −(√6/π) · [0.5772 + ln ln(T/(T − 1))] | Q_T = mean + K · σ |
| Risk over design life | R = 1 − (1 − 1/T)^n | T years, n years |
| Weibull plotting position | P = m / (n + 1) | m = rank, largest = 1 |
| Continuity | Q = A · v | m³/s |
| Manning | V = (1/n) · R^(2/3) · S^(1/2) | R hydraulic radius |
| Froude number | Fr = v / √(g · y) | below 1 subcritical, above 1 supercritical |
| Specific energy | E = y + v² / (2g) | m |
| Water balance | P = ET + Q + ΔS | over the same period and area |
| Specific discharge | q = Q / A | for example L/s/km² |
| Hydropower | P = ρ · g · Q · H · η | about 9.81 · Q · H · η kW |

These are standard textbook methods (ASCE rational method, Kirpich 1940, USDA NRCS curve number, Chow 1951 for Gumbel). They are quick estimates, not a replacement for a regional flood-frequency study or a calibrated model.
