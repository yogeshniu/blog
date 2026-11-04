#!/usr/bin/env python3
"""Rebuild the month-length table used by assets/js/tools/bs.js.

Usage:   pip install nepali nepali-datetime && python3 scripts/build_bs_data.py
Prints the JavaScript rows for 2000..2090 BS (from the `nepali` library) and compares them with `nepali-datetime`.
Paste the rows into the MONTHS object in assets/js/tools/bs.js, and read docs/NEPALI-CALENDAR-DATA.md first.
"""
import datetime
from nepali.date_converter import converter
import nepali_datetime as nd

def lengths(y):
    out = []
    for m in range(1, 13):
        a = datetime.date(*converter.nepali_to_english(y, m, 1))
        b = datetime.date(*converter.nepali_to_english(y + (m == 12), 1 if m == 12 else m + 1, 1))
        out.append((b - a).days)
    return out

other_diff = []
for y in range(2000, 2091):
    row = lengths(y)
    print(f"    {y}: [{','.join(map(str, row))}]" + ("," if y < 2090 else ""))
    try:
        o = [(nd.date(y + (m == 12), 1 if m == 12 else m + 1, 1) - nd.date(y, m, 1)).days for m in range(1, 13)]
        if o != row: other_diff.append(y)
    except Exception:
        pass
print("\nYears where nepali-datetime differs:", other_diff or "none")
