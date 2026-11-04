(function () {
"use strict";
/**
 * hydrolib.js (browser build of hydropower_calc.js; generated, edit the source and regenerate)
 * Run-of-river headworks design calculations (preliminary design).
 *
 * - Pure functions, no dependencies, no DOM. Works in browsers (<script type="module">),
 *   Node >= 14 (ESM) and is also attached to globalThis.HydroCalc for plain <script> use.
 * - SI units everywhere (m, m3/s, mm only where stated in the name/comment).
 * - Every function returns { inputs, results, checks } so a UI can render it directly.
 *   checks[] items: { name, ok:boolean, value, limit, note }
 *
 * IMPORTANT: Preliminary-design tool. Verify against the governing guidelines
 * (DoED Design Guidelines, USBR, Mosonyi, ITDG, NTNU) before use on a real project.
 */

const G = 9.81;
const rad = (d) => (d * Math.PI) / 180;
const ceilTo = (x, step) => Math.ceil(x / step - 1e-9) * step; // Excel CEILING(x, step)
const roundUp1 = (x) => Math.ceil(x * 10 - 1e-9) / 10;         // Excel ROUNDUP(x,1)
const chk = (name, ok, value, limit, note = "") => ({ name, ok, value, limit, note });

/** Generic bisection root finder on [lo, hi] for monotonic f. */
function bisect(f, lo, hi, tol = 1e-9, maxIter = 200) {
  let flo = f(lo);
  for (let i = 0; i < maxIter; i++) {
    const mid = 0.5 * (lo + hi);
    const fm = f(mid);
    if (Math.abs(fm) < tol || (hi - lo) / 2 < tol) return mid;
    if (Math.sign(fm) === Math.sign(flo)) { lo = mid; flo = fm; } else { hi = mid; }
  }
  return 0.5 * (lo + hi);
}

/* ------------------------------------------------------------------ */
/* 0. Shared hydraulics                                                */
/* ------------------------------------------------------------------ */

/** Rectangular channel/culvert section properties at flow depth y. */
function rectSection(B, y) {
  const A = B * y, P = B + 2 * y;
  return { A, P, R: A / P };
}

/** Manning discharge for a rectangular section. S in m/m. */
function manningQ(B, y, n, S) {
  const { A, R } = rectSection(B, y);
  return (1 / n) * A * Math.pow(R, 2 / 3) * Math.sqrt(S);
}

/**
 * Normal depth of a rectangular channel (replaces manual Goal Seek iteration).
 * Returns y (m). NOTE: if y > H the culvert runs full -> check freeboard.
 */
function normalDepthRect(Q, B, n, S, yMax = 50) {
  return bisect((y) => manningQ(B, y, n, S) - Q, 1e-4, yMax, 1e-10);
}

/** Friction head loss  hf = n^2 Q^2 L / (A^2 R^(4/3))  (full section A,R given). */
const manningHf = (n, Q, L, A, R) => (n * n * Q * Q * L) / (A * A * Math.pow(R, 4 / 3));

/** Minimum non-silting velocities (particle d in mm). */
const vMinACI = (d_mm) => 0.155 * Math.sqrt(d_mm);
const vMinChailly = (d_mm) => (5.67 * Math.sqrt((2.65 * d_mm) / 304.8)) / 3.28;

/* ------------------------------------------------------------------ */
/* 1. Dam height optimisation (storage for peaking)                    */
/* ------------------------------------------------------------------ */

/** Storage needed for `hours` of peaking. */
function peakingStorage({ Qpeak, Qmin, hours }) {
  return (Qpeak - Qmin) * hours * 3600; // m3
}

/**
 * Reservoir storage between LWL and HWL from an area-elevation table
 * (trapezoidal rule).
 * curve: [{elev, area}] ascending elev.
 */
function reservoirStorage({ curve, lwl, hwl, Qpeak, Qmin }) {
  let vol = 0;
  for (let i = 1; i < curve.length; i++) {
    const a = curve[i - 1], b = curve[i];
    const lo = Math.max(a.elev, lwl), hi = Math.min(b.elev, hwl);
    if (hi <= lo) continue;
    const areaAt = (e) => a.area + ((b.area - a.area) * (e - a.elev)) / (b.elev - a.elev);
    vol += ((areaAt(lo) + areaAt(hi)) / 2) * (hi - lo);
  }
  const peakingHours = vol / ((Qpeak - Qmin) * 3600);
  return { inputs: arguments[0], results: { volume: vol, peakingHours }, checks: [] };
}

/* ------------------------------------------------------------------ */
/* 2. Overflow gated spillway                                          */
/* ------------------------------------------------------------------ */

function gatedSpillway(p) {
  const {
    Qflood, hfl, crest, upstreamApron, k = [1, 1, 1, 1], Co = 1.7,
    nPiers = 3, Kp = 0.01, Ka = 0.02, gateWidthProvided = 6, // m
  } = p;
  const Ho = hfl - crest;
  const P = crest - upstreamApron;
  const C = k[0] * k[1] * k[2] * k[3] * Co;
  const Le = Qflood / C / Math.pow(Ho, 1.5);
  // Common spreadsheet form (does not multiply Kp by N). Strict USBR form shown as Lo_strict.
  const Lo = roundUp1(Le + 2 * (Kp + Ka) * Ho);
  const Lo_strict = Le + 2 * (nPiers * Kp + Ka) * Ho;
  const nGates = nPiers - 1;
  const widthRequired = Lo / nGates;
  const totalProvided = gateWidthProvided * nGates;
  const qSpecific = Qflood / nGates / widthRequired;
  return {
    inputs: p,
    results: { Ho, P, C, Le, Lo, Lo_strict, nGates, widthRequired, totalProvided, qSpecific },
    checks: [chk("Provided gate clear width >= required", totalProvided >= Lo, totalProvided, Lo,
      "Compares the total clear gate width with the crest length required.")],
  };
}

/** USBR gate-controlled flow Q = 2/3 sqrt(2g) C L (H1^1.5 - H2^1.5); table of openings. */
function gatedFlowTable({ H1, L, openings /* [{d, C}] */ }) {
  return openings.map(({ d, C }) => {
    const H2 = H1 - d;
    const Q = H2 >= 0 ? (2 / 3) * Math.sqrt(2 * G) * C * L * (Math.pow(H1, 1.5) - Math.pow(H2, 1.5)) : null; // null => beyond design head
    return { d, dOverH1: d / H1, C, Q };
  });
}

/** Ogee crest downstream profile  y = -x^n / (K H^(n-1)), plus arc radii. */
function ogeeProfile({ H, K = 2, n = 1.85, xMax = 16, dx = 1 }) {
  const pts = [];
  for (let x = 0; x <= xMax + 1e-9; x += dx) pts.push({ x, y: -Math.pow(x, n) / (K * Math.pow(H, n - 1)) });
  return { r1: 0.5 * H, r2: 0.2 * H, a: 0.175 * H, b: 0.282 * H, points: pts };
}

/* ------------------------------------------------------------------ */
/* 3. Stilling basin (USBR Type IV-style ogee) / ski-jump / cavitation  */
/* ------------------------------------------------------------------ */

function stillingBasin(p) {
  const { Q, L, crestElev, upstreamApron, He, dsBedElev, dsDepth, dsWidth, jumpElev = dsBedElev,
    basinFloorDrop = 4.5, providedLength } = p;
  const q = Q / L;
  const P = crestElev - upstreamApron;
  const yc = Math.cbrt((q * q) / G);
  const usTEL = crestElev + He;
  const dsWL = dsBedElev + dsDepth;
  const vds = Q / (dsDepth * dsWidth);
  const dsTEL = dsWL + (vds * vds) / (2 * G);
  const headDiff = usTEL - dsTEL;
  const Ef2 = dsTEL - jumpElev;
  const Ef1 = Ef2 + headDiff;
  // supercritical depth y1: y1 + q^2/(2 g y1^2) = Ef1  (take root below critical depth)
  const f = (y) => y + (q * q) / (2 * G * y * y) - Ef1;
  const y1 = bisect(f, 1e-3, yc, 1e-10);
  const v1 = q / y1;
  const Fr1 = v1 / Math.sqrt(G * y1);
  const y2 = (y1 / 2) * (-1 + Math.sqrt(1 + 8 * Fr1 * Fr1));
  const HL = Math.pow(y2 - y1, 3) / (4 * y1 * y2);
  const Lreq = 5 * (y2 - y1);
  return {
    inputs: p,
    results: {
      q, P, yc, usTEL, dsWL, vds, dsTEL, headDiff, Ef2, Ef1, y1, v1, Fr1, y2, HL,
      floorElev: jumpElev - basinFloorDrop, Lreq,
      chuteBlock: { w: y1, spacing: 2.5 * y1, height: 2 * y1 },
      dentatedSill: 1.25 * y1,
    },
    checks: [
      chk("Tailwater depth above basin floor >= sequent depth y2", dsDepth + basinFloorDrop >= y2, dsDepth + basinFloorDrop, y2,
        "Tailwater depth plus the floor drop below the jump level. Often overlooked in simple checks."),
      chk("Provided basin length >= 5(y2-y1)", providedLength == null ? true : providedLength >= Lreq,
        providedLength, Lreq),
    ],
  };
}

/** Ski-jump bucket throw distance. */
function skiJump({ waterLevel, lipInvert, lipAngleDeg, lipToTailwater }) {
  const V = Math.sqrt(2 * G * (waterLevel - lipInvert));
  const Hv = (V * V) / (2 * G);
  const phi = rad(lipAngleDeg);
  const X = (Math.sin(2 * phi) + 2 * Math.cos(phi) * Math.sqrt(Math.sin(phi) ** 2 + lipToTailwater / Hv)) * Hv;
  return { inputs: arguments[0], results: { V, Hv, X }, checks: [] };
}

/** Cavitation index and protection class (Foroudi & Barati 2022 bands). */
function cavitation({ hfl, invert, pVapour = 3170 /* Pa, 25 C */, rho = 1000 }) {
  const head = hfl - invert;
  const P = rho * G * head;
  const V = Math.sqrt(2 * G * head);
  const sigma = (P - pVapour) / (0.5 * rho * V * V);
  let action;
  if (sigma > 1.8) action = "No protection needed against cavitation";
  else if (sigma > 0.25) action = "Surface protection via modification of irregularities";
  else if (sigma > 0.17) action = "Design modification (e.g., increased boundary curvature)";
  else if (sigma > 0.12) action = "Protection using air galleries";
  else action = "Surface cannot be protected; redesign required";
  return { inputs: arguments[0], results: { P, V, sigma, action }, checks: [chk("sigma >= 0.12", sigma >= 0.12, sigma, 0.12)] };
}

/* ------------------------------------------------------------------ */
/* 4. Intake, trashrack, submergence                                   */
/* ------------------------------------------------------------------ */

function intake(p) {
  const {
    Qd, flushFraction = 0.2, nOpenings = 2, openingH = 3, openingW = 3.2,
    lowestRegWL, minSubmergence = 1.5,
    nRacks = 2, barT_mm = 12, clearSpace_mm = 100, rackAngleDeg = 85, Cs = 1,
    rackHeight = 3, rackWidth = 3, Vmax = 1.1,
  } = p;
  const QT = Qd * (1 + flushFraction);
  const invert = lowestRegWL - minSubmergence - openingH;
  const area = nOpenings * openingH * openingW;
  const v = QT / area;
  // trashrack
  const Qrack = QT / nRacks;
  const sinA = Math.sin(rad(rackAngleDeg));
  const kBar = (barT_mm + clearSpace_mm) / clearSpace_mm;
  const AtReq = (1 / Cs) * kBar * (Qrack / Vmax) / sinA;
  const WrackReq = AtReq / (rackHeight * sinA);
  const nBarsExact = (rackWidth * 1000) / (barT_mm + clearSpace_mm) + 1;
  const nBars = Math.ceil(nBarsExact);
  const Wnet = rackWidth - (nBars * barT_mm) / 1000;
  const Anet = (Wnet * rackHeight) / sinA * Cs;
  const Vapproach = (1 / Cs) * kBar * Qrack / (rackHeight * rackWidth) / sinA;
  // submergence (SI Gordon coefficient 0.545 symmetric; the 0.4 ft-unit coefficient must not be used with SI values)
  const SgordonSI = 0.545 * v * Math.sqrt(openingH);
  return {
    inputs: p,
    results: { QT, invert, area, v, Qrack, AtReq, WrackReq, nBars, Wnet, Anet, Vapproach, SgordonSI },
    checks: [
      chk("Intake velocity 0.6-1.4 m/s", v >= 0.6 && v <= 1.4, v, "0.6-1.4"),
      chk("Trashrack approach velocity <= Vmax", Vapproach <= Vmax, Vapproach, Vmax),
      chk("Provided submergence >= Gordon (SI) S", minSubmergence >= SgordonSI, minSubmergence, SgordonSI),
    ],
  };
}

/** Intake / headpond submergence for pipe intake: four methods, adopt the max. */
function pipeSubmergence({ Q, D, symmetric = true }) {
  const A = (Math.PI * D * D) / 4;
  const v = Q / A;
  const Fr = v / Math.sqrt(G * D);
  const gordon = (symmetric ? 0.545 : 0.727) * v * Math.sqrt(D); // SI equivalent of 0.3/0.4 ft-units
  const prosser = 1.5 * D;
  const itdg = (1.5 * v * v) / (2 * G);
  const knauss = D * (2 * Fr + 0.5);
  const adopted = Math.max(gordon, prosser, itdg, knauss);
  return {
    inputs: arguments[0],
    results: { A, v, Fr, gordon, prosser, itdg, knauss, adopted },
    checks: [chk("Froude number < 0.5", Fr < 0.5, Fr, 0.5, "Above 0.5 the Knauss submergence usually governs.")],
  };
}

/** Air vent pipe sizing for penstock/headrace pipe. */
function airVent({ Q, airFraction = 0.22, c = 0.5, t, d, safety = 3.5 }) {
  const Qair = airFraction * Q;
  const A = (Qair * Math.sqrt(safety) * Math.pow(d / t, 1.5)) / (750000 * c);
  return { inputs: arguments[0], results: { Qair, A, diameter: Math.sqrt((4 * A) / Math.PI) }, checks: [] };
}

/* ------------------------------------------------------------------ */
/* 5. Gravel trap / Settling basin (continuous, Camp/Vetter, DoED)     */
/* ------------------------------------------------------------------ */

/** Camp's critical (permissible) velocity: Vc = a*sqrt(d_mm). */
function campCriticalVelocity(d_mm) {
  const a = d_mm > 1 ? 0.36 : d_mm > 0.1 ? 0.44 : 0.51;
  return { a, Vc: a * Math.sqrt(d_mm) };
}

/**
 * Generic continuous settling basin (used for BOTH gravel trap and desander).
 *  p.d_mm  limiting particle; p.w  fall velocity (m/s) for that particle (read from graph/table);
 *  p.conc_ppm  sediment concentration (mg/l);  p.flushHours  flushing interval.
 */
function settlingBasin(p) {
  const {
    Q, flushFraction = 0.1, nBays = 2, d_mm = 0.2, w, conc_ppm = 5000,
    packing = 0.5, rhoS = 2600, flushHours = 8, n = 0.015, B, Hb, Lprov,
    hopperTopW = B, hopperBottomW = 0.9, hopperAngleDeg = 45, tempC = 10,
    transitionAngleDeg = 11, feederWidth = 1.8, adoptedTransitionLength,
    LBmin = 4, // minimum L/B (0.4 for a gravel trap)
    extras = true, // false => omit desander-only checks (inlet transition, re-entrainment), e.g. for a gravel trap
  } = p;
  const QT = Q * (1 + flushFraction);
  const Qb = QT / nBays;
  const { a, Vc } = campCriticalVelocity(d_mm);
  const Hmin = Qb / (Vc * B);
  const V = Qb / (B * Hb);
  const Lreq = (Hb * V) / w;
  const A = B * Hb, P = B + 2 * Hb, R = A / P;
  const Se = Math.pow(V / ((1 / n) * Math.pow(R, 2 / 3)), 2);
  const ustar = Math.sqrt(G * R * Se);
  const ustarEmp = (0.042 * V) / Math.pow(R, 1 / 6); // DoED 2H-10 
  const LreqShear = (Hb * V) / (w - ustarEmp);
  const As = B * Lprov;
  const wAsQ = (w * As) / Qb;
  const etaVetter = 1 - Math.exp(-wAsQ);
  // sediment storage
  const S = (Qb * flushHours * 3600 * conc_ppm) / 1000; // kg per bay
  const Vsed = S / (rhoS * packing);
  const ystorage = Vsed / (Lprov * B);
  const hopperDepth = ceilTo(((hopperTopW - hopperBottomW) / 2) * Math.tan(rad(hopperAngleDeg)), 0.1);
  const hopperArea = 0.5 * hopperDepth * (hopperTopW + hopperBottomW);
  const AreqStorage = Vsed / Lprov;
  const extraArea = AreqStorage - hopperArea > 0 ? AreqStorage - hopperArea : 0;
  const extraDepth = ceilTo(extraArea / B, 0.1);
  const storageDepth = hopperDepth + extraDepth;
  // transition
  const Ltrans = (B - feederWidth) / 2 / Math.tan(rad(transitionAngleDeg));
  // re-entrainment (DoED M7 4.6.9c)
  const nu = 1.32e-6;
  const Vreent = 5.65 * ustar * Math.log10((12.3 * R) / (d_mm / 1000));
  const tauC = 0.155 + (0.409 * d_mm * d_mm) / Math.sqrt(1 + 0.177 * d_mm * d_mm);
  const tau0 = G * R * Se * 1000;
  return {
    inputs: p,
    results: {
      QT, Qb, a, Vc, Hmin, V, Lreq, A, P, R, Se, ustar, ustarEmp, LreqShear, LoverB: Lprov / B,
      As, wAsQ, etaVetter, sedimentLoadKg: S, Vsed, ystorage, hopperDepth, hopperArea, AreqStorage,
      extraArea, extraDepth, storageDepth, Ltrans, Vreent, Re: (ustar * (d_mm / 1000)) / nu, tauC, tau0,
      totalBasinVolumePerBay: B * Lprov * Hb,
    },
    checks: [
      chk("Adopted depth >= minimum depth", Hb > Hmin, Hb, Hmin),
      chk("Horizontal velocity < Camp Vc", V < Vc, V, Vc),
      chk("Provided length >= Lreq (H*V/w)", Lprov >= Lreq, Lprov, Lreq),
      chk("Provided length >= Lreq with shear correction H*V/(w-u*)", Lprov >= LreqShear, Lprov, LreqShear,
        "Applies the shear-velocity correction to the basic length check."),
      chk(`L/B between ${LBmin} and 10`, Lprov / B > LBmin && Lprov / B <= 10, Lprov / B, `${LBmin}-10`),
      ...(extras ? [
        chk("Bed shear stress < critical (no re-entrainment)", tau0 < tauC, tau0, tauC),
        chk("Transition angle 5-15 deg", transitionAngleDeg >= 5 && transitionAngleDeg <= 15, transitionAngleDeg, "5-15"),
        chk("Adopted transition length >= computed", adoptedTransitionLength == null || adoptedTransitionLength >= Ltrans, adoptedTransitionLength, Ltrans),
      ] : []),
    ],
  };
}

/** Bouvard minimum bed slope and bed-load mobility (Shields) check. */
function basinBedChecks({ q_perM, dMax_mm, rhoW = 1000, rhoS = 2600, D50_mm, ustar, R, Se, nu = 1.32e-6 }) {
  const Smin = 0.3 * Math.pow(dMax_mm / 1000, 9 / 7) / Math.pow(q_perM, 6 / 7);
  const tau0 = rhoW * Se * R;
  const Rep = (ustar * D50_mm) / 1000 / nu;
  const mobility = tau0 / (rhoS - rhoW) / (D50_mm / 1000);
  return { inputs: arguments[0], results: { Smin, tau0, Rep, mobility, scour: mobility >= 0.03 }, checks: [] };
}

/** Orifice sediment-flushing capacity and flushable particle size (d = 11*R*S*1000 mm). */
function flushingOrifice({ width, depth, headAbove, Cd = 0.7, bedSlope, Qflush }) {
  const area = width * depth;
  const Qcap = Cd * area * Math.sqrt(2 * G * headAbove);
  const R = area / (2 * depth + width);
  const dFlush_mm = 11 * R * bedSlope * 1000;
  return {
    inputs: arguments[0], results: { area, Qcap, R, dFlush_mm },
    checks: [chk("Orifice capacity >= flushing discharge", Qcap >= Qflush, Qcap, Qflush)],
  };
}

/** Outlet gate velocity of settling basin. */
function basinOutlet({ Q, nBays, nGatesPerBay, w, h }) {
  return { inputs: arguments[0], results: { v: Q / nBays / w / h / nGatesPerBay, area: w * h }, checks: [] };
}

/** Gravel-trap flushing culvert + flushing pipes. */
function gravelTrapFlushing({ Qflush, invertAtHopper, waterLevel, nPipes = 2, pipeD = 0.5, pipes /* [{L,slope}] */, f = 0.013 }) {
  const head = waterLevel - invertAtHopper;
  const Areq = Qflush / Math.sqrt(2 * G * head);
  const Vinlet = 0.9 * Math.sqrt(2 * G * head);
  const Apipe = (Math.PI * pipeD * pipeD) / 4;
  const Qp = Qflush / nPipes;
  const vp = Qp / Apipe;
  const pipeRes = pipes.map(({ L, slope }) => {
    const hf = (f * L * vp * vp) / (2 * G * pipeD);
    return { L, slope, hf, requiredSlopeOneIn: 1 / (hf * slope) };
  });
  return { inputs: arguments[0], results: { head, Areq, Vinlet, Apipe, vp, pipeRes }, checks: [] };
}

/* ------------------------------------------------------------------ */
/* 6. Culverts / canals (approach, bifurcation, flushing)              */
/* ------------------------------------------------------------------ */

function culvert(p) {
  const { Qd, flushPercent = 10, nCulverts = 1, B, H, n = 0.015, L, slopeOneIn, dMax_mm = 25 } = p;
  const Qtot = Qd * (1 + flushPercent / 100);
  const Q = Qtot / nCulverts;
  const S = 1 / slopeOneIn;
  const y = normalDepthRect(Q, B, n, S, H * 3);
  const { A, R } = rectSection(B, y);
  const v = Q / A;
  const E = y + (v * v) / (2 * G);
  const hf = manningHf(n, Q, L, A, R);
  const fb = H - y;
  const Vmin = Math.max(vMinACI(dMax_mm), vMinChailly(dMax_mm));
  const Fr = v / Math.sqrt(G * y);
  const Qfull = manningQ(B, H, n, S);
  return {
    inputs: p, results: { Qtot, Q, S, y, A, R, v, E, hf, freeboard: fb, Fr, Qfull, Vmin },
    checks: [
      chk("Normal depth <= culvert height", y <= H, y, H),
      chk("Freeboard >= 0.3 m (recommended)", fb >= 0.3, fb, 0.3, "Design preference; adjust to your guideline."),
      chk("v >= self-cleansing velocity", v >= Vmin, v, Vmin),
    ],
  };
}

/** Slope-vs-capacity table (full-section Manning). */
function culvertSlopeTable({ B, H, n, L, slopes }) {
  const { A, R } = rectSection(B, H);
  return slopes.map((oneIn) => {
    const S = 1 / oneIn, v = (1 / n) * Math.pow(R, 2 / 3) * Math.sqrt(S), Q = v * A;
    return { slopeOneIn: oneIn, v, Qfull: Q, hf: manningHf(n, Q, L, A, R) };
  });
}

/* ------------------------------------------------------------------ */
/* 7. Headpond & headpond spillway                                     */
/* ------------------------------------------------------------------ */

function headpond(p) {
  const { Qd, flushPercent = 10, NWL, freeboard = 1, pipeD, supplyMinutes = 2, vPond = 0.4, width, depth, length, providedSubmergence, settlingVolume = 0, adoptedSubmergenceReq } = p;
  const Qtot = Qd * (1 + flushPercent / 100);
  const Vreq = Qtot * supplyMinutes * 60;
  const Vprov = depth * width * length;
  const Apipe = (Math.PI * pipeD * pipeD) / 4;
  const vp = Qd / Apipe;
  const hs = (1.5 * vp * vp) / (2 * G);
  const flowDepth = Qtot / vPond / width;
  return {
    inputs: p, results: { Qtot, Vreq, Vprov, vp, hs, flowDepth, sideWallRL: NWL + freeboard, totalWithSettling: Vprov + settlingVolume },
    checks: [
      chk("Headpond volume >= Q*t", Vprov > Vreq, Vprov, Vreq),
      chk("Provided submergence >= required", adoptedSubmergenceReq == null || providedSubmergence >= adoptedSubmergenceReq, providedSubmergence, adoptedSubmergenceReq),
    ],
  };
}

function headpondSpillway({ Q, S0, b, Lw, Cd = 1.7, Hprov, n = 0.015, freeboard = 0.5, Vmin = 0.6, Vmax = 6 }) {
  const Hreq = Math.pow(Q / (Cd * Lw), 2 / 3);
  const yn = normalDepthRect(Q, b, n, S0, 50);
  const { A, R } = rectSection(b, yn);
  const V = Q / A;
  const q = Q / b;
  const yc = Math.cbrt((q * q) / G);
  const Fr = V / Math.sqrt(G * yn);
  const Ac = b * yc, Rc = Ac / (b + 2 * yc);
  const Sc = Math.pow((Q * n) / (Ac * Math.pow(Rc, 2 / 3)), 2);
  return {
    inputs: arguments[0],
    results: { Hreq, yn, A, R, V, yc, Fr, Sc, regime: S0 < Sc ? "MILD (subcritical)" : "STEEP (supercritical)", wallHeight: yn + freeboard },
    checks: [
      chk("Provided head >= required head", Hprov >= Hreq, Hprov, Hreq),
      chk("Vmin <= V <= Vmax", V >= Vmin && V <= Vmax, V, `${Vmin}-${Vmax}`),
    ],
  };
}

/* ------------------------------------------------------------------ */
/* 8. Head-loss waterfall (headworks) + tunnel/penstock                */
/* ------------------------------------------------------------------ */

/**
 * Sequential head-loss through the headworks, from NWL down to the headrace entrance.
 * Each stage returns {name, loss, levelAfter}.
 */
function headworksHeadloss(p) {
  const {
    NWL, Qd, addFraction = 0.2,
    intake: it, rack, gravel, approach, bifurcationLoss = 0, inletGate, transition, basin, outletGate, pondInlet, exit,
  } = p;
  const Q = Qd * (1 + addFraction);
  const stages = [];
  let level = NWL;
  const push = (name, loss) => { level -= loss; stages.push({ name, loss, levelAfter: level }); };

  // intake orifice: (1/Cd^2) v^2/2g
  const vInt = Q / (it.n * it.w * it.h);
  push("Intake orifice", (1 / (it.Cd * it.Cd)) * vInt * vInt / (2 * G));

  // trashrack: Kt (t/b)^(4/3) Va^2/2g sin(phi); net area factor 0.8 as in common practice
  const nBars = Math.ceil((rack.w * 1000) / (rack.t + rack.b) + 1);
  const Anet = ((rack.w - (nBars * rack.t) / 1000) * rack.h) / Math.sin(rad(rack.phi)) * (rack.areaFactor ?? 0.8);
  const Va = Q / Anet / rack.nOpenings;
  push("Trashrack", rack.Kt * Math.pow(rack.t / rack.b, 4 / 3) * ((Va * Va) / (2 * G)) * Math.sin(rad(rack.phi)));

  // gravel trap inlet (friction over Li) + main section
  const AT = gravel.WT * gravel.HT, PT = 2 * gravel.HT + gravel.WT, RT = AT / PT;
  const VT = Q / AT / 3;
  push("Gravel trap inlet transition", (gravel.nInlet ** 2) * VT * VT * gravel.Li / Math.pow(RT, 4 / 3));
  const Am = gravel.W * gravel.H, Pm = 2 * gravel.H + gravel.W, Rm = Am / Pm;
  const Vm = Q / Am / (gravel.count ?? 1);
  push("Gravel trap main", (gravel.n ** 2) * Vm * Vm * gravel.L / Math.pow(Rm, 4 / 3));

  // approach culvert friction (+ bifurcation loss). Uses the FULL section (B x H).
  const Aa = approach.B * approach.H, Pa = approach.B + 2 * approach.H, Ra = Aa / Pa;
  const va = Q / Aa;
  push("Approach culvert friction", (va * va * approach.n ** 2 * approach.L) / Math.pow(Ra, 4 / 3) + bifurcationLoss);

  // inlet gate, expansion transition, basin friction, outlet gate, pond inlet, exit
  push("Settling-basin inlet gate", inletGate.Cd * (va * va) / (2 * G));
  const Ab = basin.W * basin.H, Rb = Ab / (2 * basin.H + basin.W);
  const vb = (Qd * 1.1) / Ab / basin.n;
  push("Expansion transition", transition.Ke * (va * va - vb * vb) / (2 * G));
  push("Settling-basin friction", (vb * vb * basin.manning ** 2 * basin.L) / Math.pow(Rb, 4 / 3));
  const Ao = outletGate.n * outletGate.w * outletGate.h;
  const vo = Qd / 3 / Ao;
  push("Outlet gate", outletGate.Cd * (vo * vo) / (2 * G));
  push("Pond inlet", pondInlet.coeff * (vo * vo) / (2 * G));
  push("Exit", exit.coeff * (vo * vo) / (2 * G));

  const total = NWL - level;
  return { inputs: p, results: { Q, stages, totalLoss: total, finalLevel: level }, checks: [] };
}

/**
 * Headrace tunnel (concrete + shotcrete reaches) and penstock friction (Darcy-style as in
 * "Headloss_Summary_English"). All lengths in m, Q in m3/s.
 */
function conveyanceHeadloss({ Q, tunnel, penstocks = [], minorFraction = 0.1 }) {
  const out = { tunnel: null, penstocks: [] };
  if (tunnel) {
    const { concrete, shotcrete } = tunnel; // {A,P,n,L}
    const Rc = concrete.A / concrete.P, Rs = shotcrete.A / shotcrete.P;
    const vc = Q / concrete.A, vs = Q / shotcrete.A;
    // Each reach uses its own velocity (concrete: vc, shotcrete: vs).
    const hfC = (vc * vc * concrete.n ** 2 * concrete.L) / Math.pow(Rc, 4 / 3);
    const hfS = (vs * vs * shotcrete.n ** 2 * shotcrete.L) / Math.pow(Rs, 4 / 3);
    const major = hfC + hfS;
    out.tunnel = { vc, vs, hfC, hfS, major, total: major * (1 + minorFraction) };
  }
  for (const pen of penstocks) {
    const A = (Math.PI * pen.D * pen.D) / 4;
    const v = (Q / (pen.parallel ?? 1)) / A;
    const major = (pen.f * pen.L * v * v) / (2 * G * pen.D);
    out.penstocks.push({ D: pen.D, v, major, total: major * (1 + minorFraction) });
  }
  out.totalLoss = (out.tunnel?.total ?? 0) + out.penstocks.reduce((s, x) => s + x.total, 0);
  return { inputs: arguments[0], results: out, checks: [] };
}


window.HydroCalc = {
  bisect,
  rectSection,
  manningQ,
  normalDepthRect,
  manningHf,
  vMinACI,
  vMinChailly,
  peakingStorage,
  reservoirStorage,
  gatedSpillway,
  gatedFlowTable,
  ogeeProfile,
  stillingBasin,
  skiJump,
  cavitation,
  intake,
  pipeSubmergence,
  airVent,
  campCriticalVelocity,
  settlingBasin,
  basinBedChecks,
  flushingOrifice,
  basinOutlet,
  gravelTrapFlushing,
  culvert,
  culvertSlopeTable,
  headpond,
  headpondSpillway,
  headworksHeadloss,
  conveyanceHeadloss
};
})();
