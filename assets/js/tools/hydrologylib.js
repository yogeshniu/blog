/* Basic hydrology formulas (SI). */
window.HydrologyLib = (function () {
  return {
    /* Rational method: Q (m³/s) = C i A / 360, i in mm/h, A in ha */
    rational: function (C, i, Aha) { return C * i * Aha / 360; },
    /* Kirpich time of concentration (min) = 0.0195 L^0.77 S^-0.385, L in m, S in m/m */
    kirpich: function (L, S) { return 0.0195 * Math.pow(L, 0.77) * Math.pow(S, -0.385); },
    /* SCS curve number: S = 25400/CN - 254 (mm), Ia = lambda S, Q = (P-Ia)^2/(P-Ia+S) for P > Ia */
    scs: function (P, CN, lambda) {
      var S = 25400 / CN - 254, Ia = lambda * S, Q = P > Ia ? Math.pow(P - Ia, 2) / (P - Ia + S) : 0;
      return { S: S, Ia: Ia, Q: Q };
    },
    /* Gumbel (EV1) frequency factor K = -(sqrt6/pi)(0.5772 + ln ln(T/(T-1))), Q_T = mean + K sd */
    gumbel: function (mean, sd, T) {
      var K = -(Math.sqrt(6) / Math.PI) * (0.5772156649 + Math.log(Math.log(T / (T - 1))));
      return { K: K, QT: mean + K * sd };
    },
    /* Chance of at least one T-year event in n years, and the T needed for a given risk */
    risk: function (T, n) { return 1 - Math.pow(1 - 1 / T, n); },
    returnPeriodFor: function (risk, n) { return 1 / (1 - Math.pow(1 - risk, 1 / n)); },
    /* Catchment-area ratio transfer: Q_site = Q_gauged (A_site / A_gauged)^b */
    areaRatio: function (Qg, Ag, As, b) { return Qg * Math.pow(As / Ag, b); }
  };
})();
