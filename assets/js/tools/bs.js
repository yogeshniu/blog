/* Bikram Sambat (Nepali) calendar engine. Pure functions, no dependencies. Exposed as window.BS.
 *
 * DATA: month lengths for BS 2000-2090. The table was built from open-source Nepali date libraries and cross-checked
 *       (see docs/NEPALI-CALENDAR-DATA.md). Anchor: 1 Baisakh 2000 BS = 14 April 1943 AD.
 * VERIFIED: 2000-2083 BS. Five independent libraries agree on every month, and sample dates were checked against
 *       published calendars. 2084-2090 BS are ESTIMATES: the official calendar is not published yet and the sources
 *       differ by a day in some months. The tools mark these dates clearly.
 */
(function () {
  var MIN_YEAR = 2000, MAX_YEAR = 2090, VERIFIED_YEAR = 2083;
  var ANCHOR = Date.UTC(1943, 3, 14), DAY = 86400000;
  var MONTHS = {
    2000: [30,32,31,32,31,30,30,30,29,30,29,31],
    2001: [31,31,32,31,31,31,30,29,30,29,30,30],
    2002: [31,31,32,32,31,30,30,29,30,29,30,30],
    2003: [31,32,31,32,31,30,30,30,29,29,30,31],
    2004: [30,32,31,32,31,30,30,30,29,30,29,31],
    2005: [31,31,32,31,31,31,30,29,30,29,30,30],
    2006: [31,31,32,32,31,30,30,29,30,29,30,30],
    2007: [31,32,31,32,31,30,30,30,29,29,30,31],
    2008: [31,31,31,32,31,31,29,30,30,29,29,31],
    2009: [31,31,32,31,31,31,30,29,30,29,30,30],
    2010: [31,31,32,32,31,30,30,29,30,29,30,30],
    2011: [31,32,31,32,31,30,30,30,29,29,30,31],
    2012: [31,31,31,32,31,31,29,30,30,29,30,30],
    2013: [31,31,32,31,31,31,30,29,30,29,30,30],
    2014: [31,31,32,32,31,30,30,29,30,29,30,30],
    2015: [31,32,31,32,31,30,30,30,29,29,30,31],
    2016: [31,31,31,32,31,31,29,30,30,29,30,30],
    2017: [31,31,32,31,31,31,30,29,30,29,30,30],
    2018: [31,32,31,32,31,30,30,29,30,29,30,30],
    2019: [31,32,31,32,31,30,30,30,29,30,29,31],
    2020: [31,31,31,32,31,31,30,29,30,29,30,30],
    2021: [31,31,32,31,31,31,30,29,30,29,30,30],
    2022: [31,32,31,32,31,30,30,30,29,29,30,30],
    2023: [31,32,31,32,31,30,30,30,29,30,29,31],
    2024: [31,31,31,32,31,31,30,29,30,29,30,30],
    2025: [31,31,32,31,31,31,30,29,30,29,30,30],
    2026: [31,32,31,32,31,30,30,30,29,29,30,31],
    2027: [30,32,31,32,31,30,30,30,29,30,29,31],
    2028: [31,31,32,31,31,31,30,29,30,29,30,30],
    2029: [31,31,32,31,32,30,30,29,30,29,30,30],
    2030: [31,32,31,32,31,30,30,30,29,29,30,31],
    2031: [30,32,31,32,31,30,30,30,29,30,29,31],
    2032: [31,31,32,31,31,31,30,29,30,29,30,30],
    2033: [31,31,32,32,31,30,30,29,30,29,30,30],
    2034: [31,32,31,32,31,30,30,30,29,29,30,31],
    2035: [30,32,31,32,31,31,29,30,30,29,29,31],
    2036: [31,31,32,31,31,31,30,29,30,29,30,30],
    2037: [31,31,32,32,31,30,30,29,30,29,30,30],
    2038: [31,32,31,32,31,30,30,30,29,29,30,31],
    2039: [31,31,31,32,31,31,29,30,30,29,30,30],
    2040: [31,31,32,31,31,31,30,29,30,29,30,30],
    2041: [31,31,32,32,31,30,30,29,30,29,30,30],
    2042: [31,32,31,32,31,30,30,30,29,29,30,31],
    2043: [31,31,31,32,31,31,29,30,30,29,30,30],
    2044: [31,31,32,31,31,31,30,29,30,29,30,30],
    2045: [31,32,31,32,31,30,30,29,30,29,30,30],
    2046: [31,32,31,32,31,30,30,30,29,29,30,31],
    2047: [31,31,31,32,31,31,30,29,30,29,30,30],
    2048: [31,31,32,31,31,31,30,29,30,29,30,30],
    2049: [31,32,31,32,31,30,30,30,29,29,30,30],
    2050: [31,32,31,32,31,30,30,30,29,30,29,31],
    2051: [31,31,31,32,31,31,30,29,30,29,30,30],
    2052: [31,31,32,31,31,31,30,29,30,29,30,30],
    2053: [31,32,31,32,31,30,30,30,29,29,30,30],
    2054: [31,32,31,32,31,30,30,30,29,30,29,31],
    2055: [31,31,32,31,31,31,30,29,30,29,30,30],
    2056: [31,31,32,31,32,30,30,29,30,29,30,30],
    2057: [31,32,31,32,31,30,30,30,29,29,30,31],
    2058: [30,32,31,32,31,30,30,30,29,30,29,31],
    2059: [31,31,32,31,31,31,30,29,30,29,30,30],
    2060: [31,31,32,32,31,30,30,29,30,29,30,30],
    2061: [31,32,31,32,31,30,30,30,29,29,30,31],
    2062: [30,32,31,32,31,31,29,30,29,30,29,31],
    2063: [31,31,32,31,31,31,30,29,30,29,30,30],
    2064: [31,31,32,32,31,30,30,29,30,29,30,30],
    2065: [31,32,31,32,31,30,30,30,29,29,30,31],
    2066: [31,31,31,32,31,31,29,30,30,29,29,31],
    2067: [31,31,32,31,31,31,30,29,30,29,30,30],
    2068: [31,31,32,32,31,30,30,29,30,29,30,30],
    2069: [31,32,31,32,31,30,30,30,29,29,30,31],
    2070: [31,31,31,32,31,31,29,30,30,29,30,30],
    2071: [31,31,32,31,31,31,30,29,30,29,30,30],
    2072: [31,32,31,32,31,30,30,29,30,29,30,30],
    2073: [31,32,31,32,31,30,30,30,29,29,30,31],
    2074: [31,31,31,32,31,31,30,29,30,29,30,30],
    2075: [31,31,32,31,31,31,30,29,30,29,30,30],
    2076: [31,32,31,32,31,30,30,30,29,29,30,30],
    2077: [31,32,31,32,31,30,30,30,29,30,29,31],
    2078: [31,31,31,32,31,31,30,29,30,29,30,30],
    2079: [31,31,32,31,31,31,30,29,30,29,30,30],
    2080: [31,32,31,32,31,30,30,30,29,29,30,30],
    2081: [31,32,31,32,31,30,30,30,29,30,29,31],
    2082: [31,31,32,31,31,31,30,29,30,29,30,30],
    2083: [31,31,32,31,31,31,30,29,30,29,30,30],
    2084: [31,32,31,32,31,30,30,30,29,29,30,31],
    2085: [30,32,31,32,31,30,30,30,29,30,29,31],
    2086: [31,31,32,31,31,31,30,29,30,29,30,30],
    2087: [31,31,32,32,31,30,30,29,30,29,30,30],
    2088: [31,32,31,32,31,30,30,30,29,29,30,31],
    2089: [30,32,31,32,31,30,30,30,29,30,29,31],
    2090: [31,31,32,31,31,31,30,29,30,29,30,30]
  };
  var EN = ['Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin', 'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'];
  var NE = ['\u092C\u0948\u0936\u093E\u0916', '\u091C\u0947\u0920', '\u0905\u0938\u093E\u0930', '\u0938\u093E\u0909\u0928', '\u092D\u0926\u094C', '\u0905\u0938\u094B\u091C', '\u0915\u093E\u0930\u094D\u0924\u093F\u0915', '\u092E\u0902\u0938\u093F\u0930', '\u092A\u094C\u0937', '\u092E\u093E\u0918', '\u092B\u093E\u0932\u094D\u0917\u0941\u0928', '\u091A\u0948\u0924'];
  var AD_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var WD_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var WD_NE = ['\u0906\u0907\u0924\u092C\u093E\u0930', '\u0938\u094B\u092E\u092C\u093E\u0930', '\u092E\u0919\u094D\u0917\u0932\u092C\u093E\u0930', '\u092C\u0941\u0927\u092C\u093E\u0930', '\u092C\u093F\u0939\u0940\u092C\u093E\u0930', '\u0936\u0941\u0915\u094D\u0930\u092C\u093E\u0930', '\u0936\u0928\u093F\u092C\u093E\u0930'];
  var WD_NE_SHORT = ['\u0906\u0907\u0924', '\u0938\u094B\u092E', '\u092E\u0919\u094D\u0917\u0932', '\u092C\u0941\u0927', '\u092C\u093F\u0939\u0940', '\u0936\u0941\u0915\u094D\u0930', '\u0936\u0928\u093F'];
  var ND = ['\u0966', '\u0967', '\u0968', '\u0969', '\u096A', '\u096B', '\u096C', '\u096D', '\u096E', '\u096F'];

  var START = {}, total = 0, y, i;
  for (y = MIN_YEAR; y <= MAX_YEAR; y++) { START[y] = total; for (i = 0; i < 12; i++) total += MONTHS[y][i]; }

  function daysInMonth(y, m) { return MONTHS[y] && MONTHS[y][m - 1] || 0; }
  function validBs(y, m, d) { return y >= MIN_YEAR && y <= MAX_YEAR && m >= 1 && m <= 12 && d >= 1 && d <= daysInMonth(y, m); }
  function toDays(y, m, d) { var n = START[y]; for (var k = 1; k < m; k++) n += MONTHS[y][k - 1]; return n + d - 1; }
  function dayInfo(n) { var dt = new Date(ANCHOR + n * DAY); return { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate(), wd: dt.getUTCDay() }; }

  /* BS -> AD. Returns {y, m, d, wd} (wd: 0 = Sunday) or null when the BS date does not exist. */
  function bsToAd(y, m, d) { return validBs(y, m, d) ? dayInfo(toDays(y, m, d)) : null; }

  /* AD -> BS. Returns {y, m, d, wd} or null when outside the supported range. */
  function adToBs(y, m, d) {
    var dt = new Date(Date.UTC(y, m - 1, d));
    if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) return null;   /* e.g. 31 February */
    var n = Math.round((dt.getTime() - ANCHOR) / DAY);
    if (n < 0 || n >= total) return null;
    var yy = MIN_YEAR; while (yy < MAX_YEAR && START[yy + 1] <= n) yy++;
    var rem = n - START[yy], mm = 1; while (rem >= MONTHS[yy][mm - 1]) { rem -= MONTHS[yy][mm - 1]; mm++; }
    return { y: yy, m: mm, d: rem + 1, wd: dt.getUTCDay() };
  }

  /* Today's date in Nepal (UTC+5:45, no daylight saving), whatever the visitor's own time zone. */
  function todayAd() { var t = new Date(Date.now() + 20700000); return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() }; }
  function toDigits(s, ne) { s = String(s); return ne ? s.replace(/[0-9]/g, function (c) { return ND[+c]; }) : s; }
  function pad2(n) { return n < 10 ? '0' + n : '' + n; }
  function dayNumber(y, m, d) { return Math.round((Date.UTC(y, m - 1, d) - ANCHOR) / DAY); }   /* days since the anchor, for date differences */
  function adLast() { var x = dayInfo(total - 1); return { y: x.y, m: x.m, d: x.d }; }

  window.BS = {
    MIN_YEAR: MIN_YEAR, MAX_YEAR: MAX_YEAR, VERIFIED_YEAR: VERIFIED_YEAR, TOTAL_DAYS: total,
    MONTHS_EN: EN, MONTHS_NE: NE, AD_MONTHS: AD_MONTHS, WD_EN: WD_EN, WD_NE: WD_NE, WD_NE_SHORT: WD_NE_SHORT,
    daysInMonth: daysInMonth, validBs: validBs, bsToAd: bsToAd, adToBs: adToBs, todayAd: todayAd, toDigits: toDigits,
    pad2: pad2, dayNumber: dayNumber, adMin: { y: 1943, m: 4, d: 14 }, adMax: adLast(),
    isEstimated: function (y) { return y > VERIFIED_YEAR; }
  };
})();
