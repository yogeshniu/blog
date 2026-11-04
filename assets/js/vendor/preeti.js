/*! @lacspace/preeti v1.1.0 (https://github.com/lacspace/npm-packages/tree/main/preeti)
   Copyright (c) 2026 Lacspace. Used under the Lacspace Free Licence 1.0 (full text in assets/js/vendor/LICENSE-lacspace-preeti.txt).
   Only change: the final ES-module `export` line was replaced so the code runs as a normal browser script (window.PreetiLib). */
(function(){
// src/english.ts
var WORDS = `
about above across act action activity actually add added address admin administration admission admit admitted
advance advanced after again against age agency agent ago agree agreement ahead aid air all allow allowed almost alone
along already also although always am among amount an analysis and announce announced announcement annual another
answer answers any anyone anything appear appendix applicant applicants application applications applied apply
appointed appointment approval approve approved april are area areas around arrange art article as ask asked assembly
assessment assistant associate association at attach attached attend attendance attention august authority available
average away back bachelor bad bank bar base based basic basis be became because become been before began begin
behind being believe below best better between big bill birth bit board body book both box boy branch break bring
brought budget build building business but buy by call called came campus can candidate candidates cannot capital card
care career case cases cause cell center central centre certain certificate certificates chairman chairperson chance
change changed chapter charge check chief child children choice choose circular citizen citizenship city civil claim
class classes clear clerk close closed code college come commission committee common community company complete
completed computer concerned condition conditions conduct conducted confirm consider contact content continue contract
control copy corner corporation correct cost could council count country course court cover create cross current
cut data date dated day days dead deal dear december decide decided decision degree department deputy describe design
detail details develop development did die different diploma direct direction director district division do document
documents does done door down draft due during each early east economic education effect either election else
email employee employees end engineer engineering english enough enter entrance entry environment equal even evening
event ever every everyone everything exam examination examinations examinee example except experience extension
face fact faculty fail failed family far father february federal fee fees feel few field figure file filled final
finance financial find first five floor follow following food for foreign form format former forms forward found four
free friday friend from front full fund further future gave general get girl give given go god going good got govt
government grade graded grades graduate great green ground group grow guide had half hall hand happen hard has have
having he head health hear heard held hello help her here herself high higher him himself his history hold home hope
hospital hour hours house how however human hundred idea if image important in include included including income
increase index india individual information inside institute institution instruction instructions interest
international interview into introduction is issue issued it item its itself january job join joint journal july june
just justice keep key kind knew know knowledge known land language large last late later law lead leader learn least
leave left legal less let letter level licence license life light like line list little live local long look lot love
low made main maintain major make management manager many march mark marks master math mathematics matter may maybe
me mean medical meet meeting member members memo might minister ministry minute minutes miss model monday money month
months more morning most mother move much municipality must my name national nature near need needed nepal nepali net
network never new news next night nine no non none nor north not note notes notice notification november now number
object october of off offer office officer officers official often oh old on once one online only open operation
or order ordinance organization other others our out outside over own page pages paper paragraph parent part
participate particular party pass passed past pay people per percent percentage period person personal phone physics
place plan play please point police policy political position possible post power practical pre prepare present
president press pretty previous price primary principal print private probably problem procedure process produce
product professor program programme project province provincial provide public publish published put qualification
quality question questions quite race rank rate rather read ready real really reason receive received recent record
recruitment reduce reference regarding region register registered registration regular related release released
remain remark remarks remember report representative request require required requirement research reserved resource
respect respective response rest result results return review right road roll room round rule rules run rural said
same saturday say school science score scores search seat seats second secretary section sector see seem selected
selection semester send senior sense september serial series serve service services session set seven several shall
she sheet short should show side sign signature signed simple since single sir site six size small so social society
some someone something sometimes son soon sorry sort source south space speak special staff stage stand standard start
state statement status stay step still stop story street strong student students study subject subjects submission
submit submitted such sunday supply support sure system table take taken talk tax teacher teaching team technical
technology tell ten term terms test than thank thanks that the their them themselves then theory there therefore
these they thing things think third this those though thought thousand three through thursday time timetable title to
today together told too took top total toward towards town trade training transfer travel tribhuvan true try tuesday
turn two type under understand union unit university until up update updated upon urban us use used user using usual
vacancy valid value various very via vice view village visit vote want war was watch water way we website wednesday
week well went were west what when where whether which while white who whole whom whose why wide wife will win window
with within without woman women word work worker world would write written wrong year years yes yet you young your
yours youth zone don doesn didn isn wasn aren weren won couldn wouldn shouldn haven hasn hadn pdf www http https html com org gov edu np net nos sn sl ltd pvt inc etc vs viz ie eg dr mr mrs ms
st nd rd th am pm km kg mm cm ml mb gb kb no rs nrs
academic accountant accounts ad admit agriculture amendment annex applicable architecture arts assistant audit auditor
bachelors bachelor's bs bsc ba bba bbs bed bit be bpharm biology botany calendar capacity category chemistry civil
commerce computer constitution coordinator curriculum dean diploma economics electrical electronics engineering
evaluation exam's examination examiner extension forestry geography geology gpa grading health hseb humanities
institute journalism law lecturer level licensing literature management mba mbbs mechanical medicine merit msc
neb nursing nepal's npc nrb objective optional paper pharmacy physics pharmacist plus position post psc psychology
quota rank re reexamination retotaling revised roll routine rural sample scholarship see sem semester set slc
sociology statistics supplementary symbol syllabus teacher tentative tu ugc unit vacancy viva written zoology
grade graded gradesheet marksheet result results notice notices board class date page government ministry office
officer province municipality ward district secretariat commission authority bureau council department directorate
programme scheme project budget fiscal tender bid quotation invitation procurement contract ref reference
kathmandu lalitpur bhaktapur pokhara biratnagar birgunj janakpur dharan butwal bharatpur hetauda dhangadhi nepalgunj
koshi madhesh bagmati gandaki lumbini karnali sudurpashchim
ability able absence absent absolutely academy accept acceptable accepted access accident accompany according account
accurate achieve achievement acquire actor actual adapt addition additional adequate adjust adult advantage advertise
advertisement advice advise advisor affair affect afford afraid afternoon afterwards agenda aim allocate allocation
alternative amazing analyse analyze ancient angle angry animal announce anybody anyway apart apparent appeal approach
appropriate approximately argue argument arise arm army arrival arrive artist aside aspect assess asset assign assist
assistance assume assure attack attempt attract audience author automatic autumn avoid award aware baby background
bag balance ball band basket battle beach bear beat beautiful beauty bed beginning behalf behave behaviour believe
belong benefit beside beyond bike bird black blood blue boat bonus border born borrow boss bottom bought brain brief
bright brilliant broad broken brother brown burden burn bus busy button cabinet calculate camera camp cancel cancelled
captain capture car careful carry cash cast catch category ceiling celebrate centre ceremony chain chair challenge
champion channel chapter character charity chart cheap chemical chest chief circle circumstance claim classic clean
client climate clinic clock club coach coast coffee cold collect collection colour column combination combine comfort
command comment commercial commit commitment communicate communication compare comparison compete competition complain
complaint complex component concept concern concert conclude conclusion concrete conference confidence conflict
connect connection consequence conservative considerable consist constant construct construction consult consumer
contain context contribute contribution convention conversation convert cook cool cooperation coordinate core cotton
couple courage cousin creative credit crime crisis criteria critical crop crowd culture cup currently customer cycle
daily damage dance danger dangerous dark daughter debate debt decade declare decline deep defence define definitely
definition deliver delivery demand democracy democratic demonstrate deny depend deposit depth derive desk despite
destroy determine device die diet difference difficult difficulty digital dinner disaster discipline discount discover
discuss discussion disease display distance distinct distribute distribution divide doctor dog dollar domestic double
doubt dozen drama draw dream dress drink drive driver drop drug dry duty earn earth ease easily easy eat economy edge
editor educate effective efficient effort eight elect electric electricity element eligible eligibility eliminate
emergency emphasis employ employment empty enable encourage enemy energy engage enhance enjoy ensure entire entirely
equipment error escape especially essential establish established estate estimate ethnic evaluate evidence exact
exactly examine excellent exchange exciting executive exercise exhibition exist existence expand expect expectation
expense expensive expert explain explanation explore export express expression extend extent external extra extreme
facility factor factory fair faith fall false familiar famous fan farm farmer fashion fast fat fault favour favourite
fear feature feeling female festival fight fill film finally fine finish fire firm fish fit fix flat flight flow
flower fly focus folk foot football force forest forget formal fortune foundation frame freedom frequency frequent
fresh fruit fuel function funding funny furniture gain game gap garden gas gate gather gender generally generate
generation gift glad glass global goal gold golden graduate grand grant gross growth guarantee guard guess guest gun
habit hair handle hang happy hardly harm hat hate healthy heart heat heavy height highly hill hire hit holiday hole
honour horse host hot hotel huge husband ice identify identity ignore ill illegal illness imagine immediate
immediately impact implement implementation imply import impose impossible improve improvement incident income
increasingly independent indicate industry influence inform initial initiative injury inner innovation input inquiry
insist inspection instance instead insurance intend intention internal internet invest investment investigate invite
involve involved island issue item jacket joke journey judge jump junior kid kill king kitchen knee label labour lack
lady lake largely laugh launch lay layer leaf league lean learning lecture leg leisure length lesson lie lift limit
limited link lip listen literacy loan location lock logic lose loss lost loud lovely lower luck lunch machine
magazine mail mainly majority male manage manner map marriage married mass match material maximum meal meaning
measure measurement media meeting memory mental mention menu mere message metal method middle military milk mind
minimum minor minority mission mistake mix mobile modern moment monitor mood moon moreover motor mountain mouth movement
movie multiple music mutual narrow nation native natural naturally navy nearly necessary neck negative negotiate
neighbour neither nervous newspaper nice nobody noise normal normally nose notable nothing notice novel nuclear nurse
obtain obvious obviously occasion occupation occur ocean odd offence oil okay operate opinion opportunity oppose
option orange ordinary organise organize origin original otherwise output overall owner pace pack package pain paint
pair panel parliament partly partner partnership passenger patient pattern payment peace pension perform performance
perhaps permanent permission permit physical pick picture piece pilot pink pitch plant plastic plate platform player
pleasant pleased plenty pocket poem poet poor popular population port portion positive possess possibility potential
pound poverty powerful practice praise predict prefer preference pregnant premium preparation presence presentation
preserve pressure prevent previously pride priest prime prince principle prior priority prison prisoner prize
procedure proceed production profession professional profit progress promise promote promotion proof proper property
proportion proposal propose prospect protect protection protest proud prove proved purchase pure purpose pursue
qualify quantity quarter queen quick quickly quiet rain raise random range rapid rapidly rarely ratio reach react
reaction reader reality realise realize receipt recently recognise recognize recommend recommendation recover red
reflect reform refuse regard regional regulation reject relation relationship relative relatively relax relevant
relief religion religious rely remove rent repair repeat replace reply represent republic reputation rescue reserve
resident resign resolution resolve responsibility responsible restaurant restrict restriction retain retire retirement
reveal revenue rich ride ring rise risk river rock role roof root rose rough route row royal rubber safe safety salary
sale salt sample satisfy save saving scale scene schedule scheme scientific scientist screen sea season secondary
secret secure security seek seem select sell seminar sentence separate serious seriously settle severe sex shadow shake
shape share sharp shift ship shirt shock shoe shoot shop shopping shot shoulder shout sick sight signal significant
silence silver similar simply sing sister sit situation skill skin sky sleep slightly slow slowly smile smoke snow
software soil soldier solid solution solve song soul sound speaker species specific speech speed spend spirit split
sport spread spring square stable stadium stair stake star statistic steal steel stick stock stone store storm
strange strategy stream strength stress stretch strike structure struggle stuff style success successful suddenly
suffer sufficient sugar suggest suggestion suit suitable summer sun supporter suppose surface surprise surround survey
survive suspect sweet swim symbol tail target task taste teach tear technique teeth telephone television temperature
temporary tend tension terrible territory text theatre theme thin threat throughout throw ticket tie tight till tiny
tired tomorrow tone tonight tool tooth topic touch tour tourist tourism towel tower track tradition traditional
traffic train transport treat treatment treaty tree trend trial trip trouble truck trust truth twice typical ultimately
unable uncle unemployment unfortunately unique unless unlike unlikely upper upload uploaded usually vacation valley
variable variety vehicle version victim victory video violence visible vision visitor voice volume volunteer wage wait
wake walk wall warm warn warning wash waste wave weak wealth weapon wear weather wedding weekend weight welcome
welfare wild willing wind wine wing winner winter wish witness wonder wonderful wood wooden worry worth yard yellow
yesterday
`;
var ENGLISH = new Set(WORDS.split(/\s+/).filter((w) => w.length > 1));

// src/index.ts
var VERSION = "1.1.0";
var SINGLE = {
  // Lower row letters
  a: "\u092C",
  b: "\u0926",
  c: "\u0905",
  d: "\u092E",
  e: "\u092D",
  f: "\u093E",
  g: "\u0928",
  h: "\u091C",
  i: "\u0937\u094D",
  j: "\u0935",
  k: "\u092A",
  l: "\u093F",
  n: "\u0932",
  o: "\u092F",
  p: "\u0909",
  q: "\u0924\u094D\u0930",
  r: "\u091A",
  s: "\u0915",
  t: "\u0924",
  u: "\u0917",
  v: "\u0916",
  w: "\u0927",
  x: "\u0939",
  y: "\u0925",
  z: "\u0936",
  // Shifted letters: mostly half forms
  A: "\u092C\u094D",
  B: "\u0926\u094D\u092F",
  C: "\u090B",
  D: "\u092E\u094D",
  E: "\u092D\u094D",
  F: "\u0901",
  G: "\u0928\u094D",
  H: "\u091C\u094D",
  I: "\u0915\u094D\u0937\u094D",
  J: "\u0935\u094D",
  K: "\u092A\u094D",
  L: "\u0940",
  M: "\u0903",
  N: "\u0932\u094D",
  O: "\u0907",
  P: "\u090F",
  Q: "\u0924\u094D\u0924",
  R: "\u091A\u094D",
  S: "\u0915\u094D",
  T: "\u0924\u094D",
  U: "\u0917\u094D",
  V: "\u0916\u094D",
  W: "\u0927\u094D",
  X: "\u0939\u094D",
  Y: "\u0925\u094D",
  Z: "\u0936\u094D",
  // Number row: plain digits are letters, shifted digits are Devanagari numerals
  "1": "\u091C\u094D\u091E",
  "2": "\u0926\u094D\u0926",
  "3": "\u0918",
  "4": "\u0926\u094D\u0927",
  "5": "\u091B",
  "6": "\u091F",
  "7": "\u0920",
  "8": "\u0921",
  "9": "\u0922",
  "0": "\u0923\u094D",
  "!": "\u0967",
  "@": "\u0968",
  "#": "\u0969",
  "$": "\u096A",
  "%": "\u096B",
  "^": "\u096C",
  "&": "\u096D",
  "*": "\u096E",
  "(": "\u096F",
  ")": "\u0966",
  "-": "(",
  _: ")",
  "=": ".",
  "+": "\u0902",
  // Punctuation keys
  "/": "\u0930",
  ";": "\u0938",
  ":": "\u0938\u094D",
  "'": "\u0941",
  '"': "\u0942",
  "[": "\u0943",
  "\\": "\u094D",
  "]": "\u0947",
  "}": "\u0948",
  "|": "\u094D\u0930",
  ".": "\u0964",
  "?": "\u0930\u0941",
  "<": "?",
  ">": "\u0936\u094D\u0930",
  // Extended (Alt) glyphs
  "\xBF": "\u0930\u0942",
  "\xAB": "\u094D\u0930",
  "`": "\u091E",
  "~": "\u091E\u094D",
  "\xAA": "\u0919",
  "\xE7": "\u0950",
  "\xF7": "/",
  // Latin-1 / Windows-1252 glyph slots (1.1.0). Cross-checked against the open-source Preeti tables in
  // nepali-bhasa/ttf-to-unicode, Shuvayatra/preeti and casualsnek/npttf2utf (all three agree unless noted).
  "\xCB": "\u0919\u094D\u0917",
  "\xCD": "\u0919\u094D\u0915",
  "\xCE": "\u0919\u094D\u0916",
  "\u2039": "\u0919\u094D\u0918",
  "\xE5": "\u0926\u094D\u0935",
  "\xDF": "\u0926\u094D\u092E",
  "\xA2": "\u0926\u094D\u0918",
  "\u203A": "\u0926\u094D\u0930",
  "\u201E": "\u0927\u094D\u0930",
  "\xA7": "\u091F\u094D\u091F",
  "\xDD": "\u091F\u094D\u0920",
  "\xB6": "\u0920\u094D\u0920",
  "\u2022": "\u0921\u094D\u0921",
  "\xCC": "\u0928\u094D\u0928",
  "\xC5": "\u0939\u0943",
  "\xD8": "\u094D\u092F",
  "\xA1": "\u091C\u094D\u091E\u094D",
  "\xA3": "\u0918\u094D",
  "\xA4": "\u091D\u094D",
  "\u2030": "\u091D\u094D",
  "\xB4": "\u091D",
  "\u02C6": "\u092B\u094D",
  "\xA5": "\u0930\u094D\u200D",
  // eyelash ra र्‍ (npttf2utf reads it as ्र; the other two tables as र्‍)
  "\xB0": "\u0921\u094D\u0922",
  // the three tables say ङ्ढ, a cluster Nepali never uses; cimplesid/unicode-preeti-js reads ड्ढ (बुड्ढो)
  "\u2018": "\u0945",
  "\u02DC": "\u093D",
  // Punctuation that Preeti draws from high slots
  "\xD6": "=",
  "\xD9": ";",
  "\xDA": "\u2019",
  "\xDB": "!",
  "\xDC": "%",
  "\xB1": "+",
  "\xD7": "\xD7",
  "\u2026": "\u2018",
  "\xE6": "\u201C",
  "\xC6": "\u201D"
};
var CP1252_C1 = [[132, "\u201E"], [133, "\u2026"], [136, "\u02C6"], [137, "\u2030"], [139, "\u2039"], [145, "\u2018"], [149, "\u2022"], [152, "\u02DC"], [155, "\u203A"]];
for (const [cp, ch] of CP1252_C1) SINGLE[String.fromCharCode(cp)] = SINGLE[ch];
var MULTI = {
  "k|m": "\u092B\u094D\u0930",
  "cf}": "\u0914",
  "cf]": "\u0913",
  cf: "\u0906",
  "O{": "\u0908",
  "P]": "\u0910",
  pm: "\u090A",
  km: "\u092B",
  em: "\u091D",
  qm: "\u0915\u094D\u0930",
  Qm: "\u0915\u094D\u0924",
  // (less common) ligature glyphs; Unicode → Preeti writes s| and St instead
  "8\xDE": "\u0921\u093C",
  "9\xDE": "\u0922\u093C"
  // (less common) Þ is the nukta glyph; only read after ड/ढ (cimplesid/unicode-preeti-js)
};
var MULTI_MAX = 3;
var REPH = String.fromCharCode(57344);
var CONS = "[\\u0915-\\u0939\\u0958-\\u095F]\\u093C?";
var CLUSTER = `(?:${CONS}\\u094D)*${CONS}(?:\\u094D\\u0930)?`;
var SIGNS = "[\\u093E-\\u094C\\u0901\\u0902]";
var P2U_I = new RegExp(`\\u093F(${CLUSTER})`, "g");
var P2U_REPH = new RegExp(`(${CLUSTER}${SIGNS}*)${REPH}`, "g");
var U2P_REPH = new RegExp(`\\u0930\\u094D(${CLUSTER}${SIGNS}*)`, "g");
var U2P_I = new RegExp(`(${CLUSTER})\\u093F`, "g");
var REPH_ALL = new RegExp(REPH, "g");
var VOWEL_FIX = [
  [/अा/g, "\u0906"],
  [/आे/g, "\u0913"],
  [/आै/g, "\u0914"],
  [/एे/g, "\u0910"],
  [/ाे|ेा/g, "\u094B"],
  [/ाै|ैा/g, "\u094C"]
];
function preetiToUnicode(input, opts) {
  if (opts?.keepEnglish) return convertMixed(input);
  return convertAll(input);
}
function convertAll(input) {
  let out = "";
  let i = 0;
  while (i < input.length) {
    let hit = false;
    for (let len = MULTI_MAX; len >= 2; len--) {
      const seq = input.substr(i, len);
      if (seq.length === len && MULTI[seq] !== void 0) {
        out += MULTI[seq];
        i += len;
        hit = true;
        break;
      }
    }
    if (hit) continue;
    const ch = input.charAt(i);
    out += ch === "{" ? REPH : SINGLE[ch] ?? ch;
    i += 1;
  }
  out = out.replace(/्ा/g, "");
  out = out.replace(P2U_I, "$1\u093F");
  out = out.replace(P2U_REPH, "\u0930\u094D$1").replace(REPH_ALL, "\u0930\u094D");
  for (const [re, to] of VOWEL_FIX) out = out.replace(re, to);
  return out;
}
var CONSONANTS = {
  \u0915: ["s", "S"],
  \u0916: ["v", "V"],
  \u0917: ["u", "U"],
  \u0918: ["3", null],
  \u0919: ["\xAA", null],
  \u091A: ["r", "R"],
  \u091B: ["5", null],
  \u091C: ["h", "H"],
  \u091D: ["em", null],
  \u091E: ["`", "~"],
  \u091F: ["6", null],
  \u0920: ["7", null],
  \u0921: ["8", null],
  \u0922: ["9", null],
  \u0923: ["0f", "0"],
  \u0924: ["t", "T"],
  \u0925: ["y", "Y"],
  \u0926: ["b", null],
  \u0927: ["w", "W"],
  \u0928: ["g", "G"],
  \u092A: ["k", "K"],
  \u092B: ["km", null],
  \u092C: ["a", "A"],
  \u092D: ["e", "E"],
  \u092E: ["d", "D"],
  \u092F: ["o", null],
  \u0930: ["/", null],
  \u0932: ["n", "N"],
  \u0935: ["j", "J"],
  \u0936: ["z", "Z"],
  \u0937: ["if", "i"],
  \u0938: [";", ":"],
  \u0939: ["x", "X"]
};
var ROUND_RA = /* @__PURE__ */ new Set(["\u091F", "\u0920", "\u0921", "\u0922"]);
var CONJUNCTS = [
  ["\u0915\u094D\u0937\u094D", "I"],
  ["\u092B\u094D\u0930", "k|m"],
  ["\u0915\u094D\u0937", "If"],
  ["\u091C\u094D\u091E", "1"],
  ["\u0924\u094D\u0930", "q"],
  ["\u0924\u094D\u0924", "Q"],
  ["\u0926\u094D\u092F", "B"],
  ["\u0926\u094D\u0926", "2"],
  ["\u0926\u094D\u0927", "4"],
  ["\u0936\u094D\u0930", ">"],
  ["\u0930\u0941", "?"],
  ["\u0930\u0942", "\xBF"]
];
var OTHERS = {
  \u0905: "c",
  \u0906: "cf",
  \u0907: "O",
  \u0908: "O{",
  \u0909: "p",
  \u090A: "pm",
  \u090B: "C",
  \u090F: "P",
  \u0910: "P]",
  \u0913: "cf]",
  \u0914: "cf}",
  "\u093E": "f",
  "\u093F": "l",
  "\u0940": "L",
  "\u0941": "'",
  "\u0942": '"',
  "\u0943": "[",
  "\u0947": "]",
  "\u0948": "}",
  "\u094B": "f]",
  "\u094C": "f}",
  "\u0902": "+",
  "\u0901": "F",
  "\u0903": "M",
  "\u094D": "\\",
  "\u0964": ".",
  "\u0950": "\xE7",
  "\u0966": ")",
  "\u0967": "!",
  "\u0968": "@",
  "\u0969": "#",
  "\u096A": "$",
  "\u096B": "%",
  "\u096C": "^",
  "\u096D": "&",
  "\u096E": "*",
  "\u096F": "(",
  // ASCII digits and the punctuation that Preeti draws from other keys (plain "1" would draw ज्ञ).
  "0": ")",
  "1": "!",
  "2": "@",
  "3": "#",
  "4": "$",
  "5": "%",
  "6": "^",
  "7": "&",
  "8": "*",
  "9": "(",
  "(": "-",
  ")": "_",
  ".": "=",
  "?": "<",
  "/": "\xF7",
  [REPH]: "{"
};
var isCons = (c) => c !== void 0 && CONSONANTS[c] !== void 0;
function unicodeToPreeti(input) {
  let s = input.replace(U2P_REPH, (m, cl, off, str) => str[off - 1] === "\u094D" ? m : `${cl}${REPH}`);
  s = s.replace(U2P_I, "\u093F$1");
  let out = "";
  let i = 0;
  while (i < s.length) {
    let hit = false;
    for (const [u, p] of CONJUNCTS) {
      if (s.startsWith(u, i) && (u !== "\u0915\u094D\u0937\u094D" || isCons(s[i + 4]))) {
        out += p;
        i += u.length;
        hit = true;
        break;
      }
    }
    if (hit) continue;
    const c = s.charAt(i);
    const glyph = CONSONANTS[c];
    if (glyph) {
      const [full, half] = glyph;
      if (s[i + 1] === "\u094D" && s[i + 2] === "\u0930") {
        out += full + (ROUND_RA.has(c) ? "\xAB" : "|");
        i += 3;
      } else if (s[i + 1] === "\u094D" && isCons(s[i + 2])) {
        out += half ?? `${full}\\`;
        i += 2;
      } else {
        out += full;
        i += 1;
      }
      continue;
    }
    out += OTHERS[c] ?? c;
    i += 1;
  }
  return out;
}
function looksLikePreeti(text) {
  const s = (text ?? "").trim();
  if (!s || /[ऀ-ॿ]/.test(s)) return false;
  const words = s.split(/\s+/).filter((w) => /[a-zA-Z]/.test(w));
  if (words.length === 0) return false;
  const tells = words.filter((w) => /f\]|f}|\]k|g\]|cf|l[a-z;:/]|[a-z]\{|[a-z]'|[a-z]"|^[;:/>][a-z]|kf|sf|df|gf/.test(w)).length;
  const englishish = words.filter((w) => /^[A-Za-z]+[.,!?]?$/.test(w) && /[aeiou]{1}[a-z]*[aeiou]?/i.test(w) && !/f\]|cf|sf|kf|df|gf/.test(w)).length;
  const anomalies = words.filter((w) => /[^kepqQ'"\]}F|\s]m/.test(w) || /[<(][A-Za-z]/.test(w)).length;
  if (anomalies / words.length >= 0.25) return false;
  return tells / words.length >= 0.4 && tells > englishish;
}
var PREETI_INNER = /[\/;:'"()\[\]{}|\\`~<>?_=+«¿ª¡-ÿ„…ˆ‰‹‘•˜›\u0080-\u009f]/;
var LEAD_PUNCT = /^[("'“‘\[]+/;
var TRAIL_PUNCT = /[.,;:!?)"'”’-]+$/;
var CONTRACTION = /^(s|t|d|m|ll|re|ve)$/;
function isEnglishWord(w) {
  if (!/^([a-z]+|[A-Z][a-z]+|[A-Z]+)$/.test(w)) return false;
  const l = w.toLowerCase();
  if (ENGLISH.has(l)) return true;
  const stems = [/(.{3,})s$/, /(.{3,})es$/, /(.{3,})ed$/, /(.{3,})d$/, /(.{3,})ing$/, /(.{3,})ly$/, /(.{3,})er$/, /(.{3,})ers$/];
  for (const re of stems) {
    const m = re.exec(l);
    if (m && (ENGLISH.has(m[1]) || ENGLISH.has(`${m[1]}e`))) return true;
  }
  const y = /(.{2,})(ies|ied)$/.exec(l);
  return !!y && ENGLISH.has(`${y[1]}y`);
}
var isAcronym = (w) => /^[A-Z][A-Z0-9&]*[A-Z0-9]$/.test(w) && /[A-Z].*[A-Z]|[A-Z]\d/.test(w);
function classify(tok) {
  if (/[ऀ-ॿ]/.test(tok)) return { text: tok, kind: "keep" };
  if (/^(https?:\/\/|www\.)\S+$/i.test(tok) || /^[\w.+-]+@[\w-]+(\.[\w-]+)+[.,;:]?$/.test(tok)) return { text: tok, kind: "en" };
  const core = tok.replace(LEAD_PUNCT, "").replace(TRAIL_PUNCT, "");
  if (/^\d{2,}([.,:\/-]\d+)*$/.test(core) || /^\d+([.,:\/-]\d+)+$/.test(core)) return { text: tok, kind: "en" };
  if (/^\d$/.test(core) || core === "") {
    return { text: tok, lean: /^[!@#$%^&*()]+$/.test(tok) && tok.length > 1 ? "preeti" : void 0 };
  }
  if (/^[!@#$%^&*()=.,\-_]+$/.test(tok) && (/[@#$%^&*]/.test(tok) || /^[!()]{2,}[.,]?$/.test(tok) && !/^\(!+\)$/.test(tok))) return { text: tok, lean: "preeti" };
  if (/^\d+(st|nd|rd|th|am|pm|km|kg|mm|cm|ml|mb|gb|kb|g|k|m|s|x)$/i.test(core) || /^[A-Z]+\d+[A-Z]*$/.test(core) || /^[A-Z]+-\d+$/.test(core)) return { text: tok, kind: "en" };
  if (/^[A-Za-z]+$/.test(core) || /^[A-Za-z]+['’][a-z]{1,2}$/.test(core) || /^[A-Za-z]+\/[A-Za-z]+$/.test(core)) {
    const parts = core.split(/['’\/]/);
    const word = parts[0];
    const apostrophe = /['’]/.test(core);
    if (isAcronym(core)) return { text: tok, kind: "en" };
    const enPart = (p) => isEnglishWord(p) || isAcronym(p) || /^[A-Z]{1,3}[a-z]+$/.test(p) && /[aeiouy]/i.test(p);
    if (!apostrophe && parts.length > 1 && parts.every(enPart)) return { text: tok, kind: "en" };
    if (isEnglishWord(word) && parts.slice(1).every((p) => apostrophe ? CONTRACTION.test(p) : isEnglishWord(p))) {
      return word.length >= 4 || /^[A-Z]/.test(core) || parts.length > 1 ? { text: tok, kind: "en" } : { text: tok, lean: "en" };
    }
  }
  const bare = tok.replace(/[.,]+$/, "");
  const m = /^[("“‘]*([A-Za-z]+)[)"”’!?:;']?$/.exec(bare);
  const inner = m && /[aeiouy]/i.test(m[1]) ? m[1] : bare;
  if (PREETI_INNER.test(inner)) return { text: tok, kind: "preeti" };
  if (/[a-z][0-9]|[0-9][a-z]/.test(core)) return { text: tok, kind: "preeti" };
  if (/^[A-Za-z]+$/.test(core)) {
    if (core.length >= 2 && !/[aeiouy]/.test(core.slice(1)) && !/^[AEIOUY][a-z]/.test(core)) return { text: tok, kind: "preeti" };
    if (/[^aeioufrl]f$/.test(core)) return { text: tok, kind: "preeti" };
    if (/^l[b-df-hj-km-np-tv-xzB-DF-HJ-KM-NP-TV-XZ]/.test(core)) return { text: tok, kind: "preeti" };
    if (/q(?!u)/.test(core) && !/^[A-Z][a-z]*aq$/.test(core)) return { text: tok, kind: "preeti" };
    if (/[a-z][A-Z]/.test(core) && !/^([A-Z]?[a-z]*[aeiouy][a-z]*)([A-Z][a-z]*[aeiouy][a-z]*)+$/.test(core)) return { text: tok, kind: "preeti" };
    if (/[^aeiouAEIOU\W]f[^aeioufltrsy\W]/.test(core)) return { text: tok, lean: "preeti" };
    return { text: tok, lean: /^[A-Z][a-z]+$/.test(core) ? "en" : void 0 };
  }
  return { text: tok, lean: "preeti" };
}
function splitHyphen(tok) {
  const m = /^([A-Za-z]+-)(.+)$/.exec(tok);
  if (!m) return null;
  const head = m[1].slice(0, -1);
  if (!(isEnglishWord(head) || isAcronym(head))) return null;
  const tail = classify(m[2]);
  return tail.kind === "preeti" ? [{ text: m[1], kind: "en" }, tail] : null;
}
function convertMixed(text) {
  const input = text ?? "";
  return input.split(/(\r?\n)/).map((line) => /^\r?\n$/.test(line) ? line : convertLine(line)).join("");
}
function convertLine(line) {
  const parts = line.split(/(\s+)/);
  const toks = [];
  for (const p of parts) {
    if (p === "") continue;
    if (/^\s+$/.test(p)) {
      toks.push({ text: p, space: true });
      continue;
    }
    const split = splitHyphen(p);
    if (split) toks.push(...split);
    else toks.push(classify(p));
  }
  const words = toks.filter((t) => !t.space);
  const strong = (t) => t.kind === "en" ? "en" : t.kind === "preeti" || t.kind === "keep" ? "preeti" : void 0;
  const lineDefault = words.some((t) => t.kind === "preeti") || looksLikePreeti(line) ? "preeti" : "en";
  for (let i = 0; i < words.length; i++) {
    const t = words[i];
    if (t.kind) continue;
    let left;
    let right;
    for (let j = i - 1; j >= 0 && !left; j--) left = strong(words[j]);
    for (let j = i + 1; j < words.length && !right; j++) right = strong(words[j]);
    let pick;
    if (left && right) pick = left === right ? left : t.lean ?? "preeti";
    else pick = left ?? right ?? (t.lean === "preeti" ? "preeti" : lineDefault);
    t.kind = pick;
  }
  let out = "";
  let run = "";
  let pendingSpace = "";
  const flush = () => {
    if (run) out += convertAll(run);
    run = "";
  };
  for (const t of toks) {
    if (t.space) {
      if (run) pendingSpace += t.text;
      else out += t.text;
      continue;
    }
    if (t.kind === "preeti") {
      run += pendingSpace + t.text;
      pendingSpace = "";
      continue;
    }
    flush();
    out += pendingSpace + t.text;
    pendingSpace = "";
  }
  flush();
  return out + pendingSpace;
}
function describe() {
  return {
    name: "@lacspace/preeti",
    version: VERSION,
    summary: "Preeti (legacy ASCII Devanagari font) \u21C4 Unicode, both directions, with short-i and reph reordering, half letters, ra-kaar, conjunct keys and Preeti numerals; convertMixed() for lines mixing English and Preeti; plus looksLikePreeti() to detect pasted legacy text. Pure JS, zero dependencies.",
    commands: [
      { name: "preetiToUnicode", input: { type: "object", properties: { text: { type: "string" } }, required: ["text"] }, output: "string" },
      { name: "unicodeToPreeti", input: { type: "object", properties: { text: { type: "string" } }, required: ["text"] }, output: "string" },
      { name: "convertMixed", input: { type: "object", properties: { text: { type: "string" } }, required: ["text"] }, output: "string" },
      { name: "looksLikePreeti", input: { type: "object", properties: { text: { type: "string" } }, required: ["text"] }, output: "boolean" }
    ]
  };
}


window.PreetiLib={convertMixed:convertMixed,describe:describe,looksLikePreeti:looksLikePreeti,preetiToUnicode:preetiToUnicode,unicodeToPreeti:unicodeToPreeti};
})();
