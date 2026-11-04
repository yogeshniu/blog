# Where the Nepali calendar data comes from

The calendar and date converter use a table of month lengths for 2000 to 2090 BS (`assets/js/tools/bs.js`).
There is no formula for Bikram Sambat month lengths, so every Nepali date tool relies on a table like this.

## How it was checked (November 2026)

1. The table was built from the open-source `nepali` library.
2. It was compared month by month with four other libraries: `nepali-datetime`, `bikram-sambat`,
   `nepali-date-converter` and `@remotemerge/nepali-date-converter`.
3. **2000 to 2083 BS: all five agree**, except one month: the start of Jestha 2062 (14 or 15 May 2005).
   Published calendars (a calendar site's day-by-day pages for May 2005, and the Temporal calendar cookbook table) show a
   30-day Baisakh, so Jestha 1, 2062 = 14 May 2005. The table uses that.
4. **2084 to 2090 BS: the libraries disagree** (up to a day, in 32 months). These years are treated as **estimates** and
   are marked in the tools. They should be replaced when the official calendar is published.
5. Real-world dates checked: Nepali New Year 2080 to 2083, Constitution Day (3 Asoj 2072 = 20 Sep 2015),
   Republic Day (15 Jestha 2065 = 28 May 2008), Loktantra Diwas (11 Baisakh 2063 = 24 Apr 2006), and the full 2083 table
   on a published calendar site (including 17 Kartik 2083 = 3 Nov 2026).
6. The JavaScript engine was tested on every day from 2000 to 2090 (33,238 days): zero differences from the source library,
   zero weekday errors, and BS to AD to BS round trips all match.

## Updating for a new year

When the official calendar for 2084 BS is published, update that year's row in `MONTHS` in `assets/js/tools/bs.js`, and move
`VERIFIED_YEAR` up (the tools then stop marking that year as an estimate).
`scripts/build_bs_data.py` prints the rows from the Python libraries for comparison.

## Preeti converter

Uses `@lacspace/preeti` 1.1.0 (copy in `assets/js/vendor/`, licence in `assets/js/vendor/LICENSE-lacspace-preeti.txt`).
Tested by converting 122 sentences of Nepali from this site to Preeti and back (all identical) and by comparing with
the independent `preeti-unicode` converter (it agreed on all 122 once its two-character form of the "o" vowel sign was normalised to the standard single character).
