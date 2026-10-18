import { getTreatment, getTreatmentByName } from "./procedures";
import type { TreatmentProtocol } from "./types";

export const PROTOCOLS: TreatmentProtocol[] = [
  { treatmentId: "ellavie", interval: "12–18개월", sessions: "1회", depth: "중간~심부", note: "원내 대표 필러. 과교정 없이 자연 볼륨." },
  { treatmentId: "restylane", interval: "9–12개월", sessions: "1회", note: "지지가 필요한 팔자·윤곽." },
  { treatmentId: "juvederm", interval: "12–18개월", sessions: "1회", note: "부드러운 볼륨, 입술·볼." },
  { treatmentId: "neuramis", interval: "6–12개월", sessions: "1회", note: "잔주름·입술 라이트 볼륨." },
  { treatmentId: "yvoire", interval: "9–12개월", sessions: "1회", note: "턱·코·윤곽 지지." },
  { treatmentId: "radiesse", interval: "12–18개월", sessions: "1회", energy: "CaHA 필러 주입", depth: "깊은 진피~피하", duration: "15–30분", recovery: "부기·멍 수일", note: "입술에는 쓰지 않는다. 표층 주입·혈관 합병증 주의." },
  { treatmentId: "contour-inj", interval: "1–2주", sessions: "3–5회", note: "이중턱·볼살. 관리·림프 병행." },
  { treatmentId: "filorga", interval: "1–2주", sessions: "3–5회 후 유지 월 1회", note: "NCTF 물광. 광채·결." },
  { treatmentId: "juvelook", interval: "3–4주", sessions: "3회 코스", note: "모공·흉터. 부종 고지. 원내 추천." },
  { treatmentId: "rejuran", interval: "2–4주", sessions: "3–4회", note: "재생·장벽. 시술 직후 구진 안내." },
  { treatmentId: "rejuran-i", interval: "2–3주", sessions: "3회", depth: "표층", note: "아이리쥬란. 눈가 소량. 얇은 피부. 깊은 볼륨은 필러." },
  { treatmentId: "pdrn", interval: "1–2주", sessions: "3–5회", note: "진정·회복. 레이저 후 병행." },
  { treatmentId: "ultracol", interval: "4주", sessions: "2–3회", note: "PDO 콜라겐. 마사지 금지 안내." },
  { treatmentId: "sculptra", interval: "4–6주", sessions: "2–3회", note: "PLLA. 하루 5회·5분·5일 마사지." },
  { treatmentId: "cellrederm", interval: "2–4주", sessions: "3회", note: "얇은 피부·눈가." },
  { treatmentId: "skin-glow", interval: "3–4주", sessions: "3회 후 유지", note: "HA 물광. 즉각 광채." },
  { treatmentId: "exosome", interval: "2–4주", sessions: "3회", note: "레이저/MTS 후 재생." },
  { treatmentId: "rejuran-glow", interval: "3–4주", sessions: "3회", note: "리쥬란+물광. 보습·재생." },
  { treatmentId: "glow-botox", interval: "3–4개월", sessions: "1회", energy: "약용량 균일", note: "모공·잔주름·피지. 표정 소실 주의." },
  { treatmentId: "pigment-inj", interval: "1–2주", sessions: "4–6회", note: "국소 색소. 레이저와 교차." },
  { treatmentId: "inflam-inj", interval: "필요 시", sessions: "1회", note: "낭종·급성 염증. 위축 주의." },
  { treatmentId: "baby-inj", interval: "2–4주", sessions: "3회", note: "동안 광채 칵테일." },
  { treatmentId: "panda-inj", interval: "3–4주", sessions: "3회", note: "눈밑 다크서클. 팬더 세트." },
  { treatmentId: "mermaid-inj", interval: "2–4주", sessions: "3회", note: "톤업·광채." },
  { treatmentId: "skinbooster", interval: "4주", sessions: "3회", note: "진피 보습 통칭." },
  { treatmentId: "scar-inj", interval: "4주", sessions: "3–5회", note: "함몰/비대 흉터. 서브시전 병행." },
  { treatmentId: "glutathione", interval: "1주", sessions: "10회 코스", note: "전신 미백·항산화." },
  { treatmentId: "vitc-inj", interval: "1주", sessions: "5–10회", note: "피로·항산화." },
  { treatmentId: "tranexamic", interval: "1–2주", sessions: "4–6회", note: "기미 메조/주사." },
  { treatmentId: "growth-inj", interval: "2–4주", sessions: "3회", note: "흉터·재생." },
  { treatmentId: "collagen-inj", interval: "4주", sessions: "3회", note: "탄력·잔주름." },
  { treatmentId: "cinderella-inj", interval: "1주", sessions: "5–10회", note: "미백·피로. 글루타치온 기반." },
  { treatmentId: "chanel-inj", interval: "2–4주", sessions: "3회 코스", note: "PN+HA+비타민 광채 칵테일. 결·윤기." },
  { treatmentId: "restylane-sb", interval: "4주", sessions: "3회 후 6개월 유지", note: "Restylane Skinbooster. 진피 내 HA." },
  { treatmentId: "haiti", interval: "6–9개월", sessions: "1–2회", depth: "표층", note: "嗨体. 눈밑·목주름 특화. 깊은 팔자·볼륨은 엘라비에." },
  { treatmentId: "botulinum", interval: "3–4개월", sessions: "1회", note: "주름 4개월, 사각턱 4–6개월." },
  { treatmentId: "botox", interval: "3–4개월", sessions: "1회", note: "알러간. 미간·이마·눈가·사각턱." },
  { treatmentId: "nabota", interval: "3–4개월", sessions: "1회", note: "빠른 발현." },
  { treatmentId: "hutox", interval: "3–4개월", sessions: "1회" },
  { treatmentId: "botulax", interval: "3–4개월", sessions: "1회", note: "사각턱·승모근에 자주." },
  { treatmentId: "innotox", interval: "3–4개월", sessions: "1회", note: "액상. 잔주름·스킨보톡스." },
  { treatmentId: "coretox", interval: "3–4개월", sessions: "1회", note: "내성 병력 시." },
  { treatmentId: "meditoxin", interval: "3–4개월", sessions: "1회" },
  { treatmentId: "xeomin", interval: "3–4개월", sessions: "1회", note: "순수 톡신." },
  { treatmentId: "hengli", interval: "3–4개월", sessions: "1회" },

  { treatmentId: "lituo", interval: "6–12개월", sessions: "3회 전후", energy: "hADM(ECM) 진피 주입", depth: "진피", duration: "15–30분", recovery: "엠보·부기 수일", note: "인체 유래 성분. 시술 전 설명·동의. 주입 직후 엠보 가능.", difference: "큐레이저는 Q-switched 레이저 토닝이고, 리투오는 ECM 주사다." },
  { treatmentId: "curejet", interval: "3–4주", sessions: "3회", energy: "4–6 bar", note: "리쥬란·쥬베룩 제트 주입. 통증 적음." },
  { treatmentId: "qlaser", interval: "1–2주", sessions: "5–10회", energy: "1064nm 1.2–1.8 J/cm²", duration: "15–30분", recovery: "붉음 수시간–수일", note: "원내 토닝. 기미 악화 고지.", difference: "리투오는 ECM 주사(주사·필러)이고, 큐레이저는 Q-switched 레이저다." },
  { treatmentId: "m22", interval: "3–4주", sessions: "3–5회", energy: "560/590nm 14–16 J/cm²", note: "IPL. 홍조·색소·광노화. 선크림 필수." },
  { treatmentId: "fraxel", interval: "4–6주", sessions: "3회", energy: "15–25 mJ", tip: "8–10mm", note: "모공·흉터. 다운타임 3–5일." },
  { treatmentId: "erbium", interval: "6–8주", sessions: "1–3회", note: "박피. 재생테이프·차단." },
  { treatmentId: "fotona", interval: "4주", sessions: "3회", note: "스무스아이·리프팅 모드." },
  { treatmentId: "vbeam", interval: "4주", sessions: "3–5회", energy: "7–9 J/cm²", note: "홍조·혈관. 퍼플 자반 안내." },
  { treatmentId: "potenza", interval: "4주", sessions: "3회", note: "니들 RF. 모공·흉터·탄력." },
  { treatmentId: "clarity", interval: "4주", sessions: "5회+", note: "제모·색소." },
  { treatmentId: "co2", interval: "6–8주", sessions: "1–3회", note: "깊은 흉터·점. 다운타임 길음." },
  { treatmentId: "pico", interval: "2–4주", sessions: "3–5회", energy: "0.7–1.2 J/cm²", note: "기미·톤·문신. 미백 코스 핵심." },

  { treatmentId: "vro", interval: "3–6개월", sessions: "1회", energy: "0.7–1.0 J", tip: "3.0/4.5mm", note: "원내 HIFU. 턱선·볼." },
  { treatmentId: "ulthera", interval: "12개월", sessions: "1회", energy: "0.8–1.2 J", tip: "1.5/3.0/4.5mm", note: "SMAS 리프팅. 샷 수 상담." },
  { treatmentId: "thermage", interval: "12개월", sessions: "1회", energy: "450–600샷", note: "FLX 4.0. 타이트닝·윤곽. 필러와 시차." },
  { treatmentId: "volnewmer", interval: "6–12개월", sessions: "1회", note: "모노폴라 RF. 볼륨 유지형." },
  { treatmentId: "density", interval: "4–6개월", sessions: "1회", energy: "400샷", note: "진피 밀도." },
  { treatmentId: "onda", interval: "4주", sessions: "3회", note: "이중턱 Coolwaves." },
  { treatmentId: "shurink", interval: "3–6개월", sessions: "1회", energy: "0.7–1.0 J", tip: "3.0/4.5mm", note: "일상 HIFU." },

  { treatmentId: "dermapen", interval: "3–4주", sessions: "3–5회", note: "자동 니들. 약물 침투. MTS와 구분." },
  { treatmentId: "mts", interval: "3–4주", sessions: "3–5회", note: "마이크로니들/더마롤러. 더마펜과 별도 시술." },
  { treatmentId: "tca-cross", interval: "4–6주", sessions: "3–5회", note: "아이스픽 흉터. 핀홀·서브시전 병행." },
  { treatmentId: "facial-care", interval: "1–2주", sessions: "정기 관리", note: "클렌징·수분·진정. 시술 사이 유지." },
  { treatmentId: "acne-care", interval: "1주", sessions: "4–8회", note: "압출·진정·재생. 브이올렛·염증주사 병행 가능." },
  { treatmentId: "cosmelan", interval: "1회 코스 후 유지", sessions: "1회 코스", note: "기미 집중. 홈케어 필수. 자외선 차단." },
  { treatmentId: "chemical-peel", interval: "2–4주", sessions: "3–5회", note: "각질·색소·결." },
  { treatmentId: "aquapeel", interval: "2주", sessions: "정기", note: "모공·피지·즉각 광채." },
  { treatmentId: "hydrafacial", interval: "4주", sessions: "정기", note: "흡입+용액 페이셜." },
  { treatmentId: "ldm", interval: "주 1–2회", sessions: "시술 후/진정", note: "장벽·부종·홍조. 레이저 후 추천." },
  { treatmentId: "vitamin-care", interval: "1주", sessions: "5–10회", note: "톤·광채 이온 관리." },
  { treatmentId: "violet", interval: "2–4주", sessions: "3회", note: "피지선 억제. 여드름 코스." },

  { treatmentId: "subcision", interval: "4–8주", sessions: "1–3회", note: "함몰 흉터 섬유대 절단. 필러/레이저 병행." },
  { treatmentId: "pinhole", interval: "6–8주", sessions: "2–4회", note: "깊은 공함몰 흉터." },
];

/** Fills only fields that were empty. Does not overwrite existing clinic values, prices, or device settings. */
const FILL_IF_EMPTY: Record<string, Partial<TreatmentProtocol>> = {
  ellavie: { energy: "HA 필러 주입", duration: "15–30분", recovery: "부기·멍 수일" },
  restylane: { energy: "HA 필러 주입", duration: "15–30분", recovery: "부기·멍 수일" },
  juvederm: { energy: "HA 필러 주입", duration: "15–30분", recovery: "부기·멍 수일" },
  neuramis: { energy: "HA 필러 주입", duration: "15–30분", recovery: "부기·멍 수일" },
  yvoire: { energy: "HA 필러 주입", duration: "15–30분", recovery: "부기·멍 수일" },
  botulinum: { energy: "보툴리눔 근육 주사", duration: "5–20분", recovery: "당일 생활. 효과는 수일–2주" },
  botox: { energy: "보툴리눔 근육 주사", duration: "5–20분", recovery: "당일 생활. 효과는 수일–2주" },
  nabota: { energy: "보툴리눔 근육 주사", duration: "5–20분", recovery: "당일 생활. 효과는 수일–2주" },
  hutox: { energy: "보툴리눔 근육 주사", duration: "5–20분", recovery: "당일 생활. 효과는 수일–2주", note: "휴온스 보툴리눔. 주름·사각턱." },
  botulax: { energy: "보툴리눔 근육 주사", duration: "5–20분", recovery: "당일 생활. 효과는 수일–2주" },
  innotox: { energy: "보툴리눔 근육 주사", duration: "5–20분", recovery: "당일 생활. 효과는 수일–2주" },
  coretox: { energy: "보툴리눔 근육 주사", duration: "5–20분", recovery: "당일 생활. 효과는 수일–2주" },
  meditoxin: { energy: "보툴리눔 근육 주사", duration: "5–20분", recovery: "당일 생활. 효과는 수일–2주", note: "메디톡스 보툴리눔. 주름·사각턱." },
  xeomin: { energy: "보툴리눔 근육 주사", duration: "5–20분", recovery: "당일 생활. 효과는 수일–2주" },
  hengli: { energy: "보툴리눔 근육 주사", duration: "5–20분", recovery: "당일 생활. 효과는 수일–2주", note: "란저우 보툴리눔. 주름·사각턱." },
  "contour-inj": { duration: "15–30분", recovery: "부기 수일" },
  filorga: { energy: "NCTF 주입", duration: "15–30분", recovery: "엠보 1–3일" },
  juvelook: { energy: "PDLLA+HA 주입", duration: "15–30분", recovery: "부기·엠보 수일" },
  rejuran: { energy: "PN 진피 주입", duration: "15–30분", recovery: "구진·엠보 1–3일" },
  "rejuran-i": { energy: "PN 눈가 소량 주입", duration: "10–20분", recovery: "엠보 1–3일" },
  pdrn: { energy: "PDRN 주입", duration: "15–30분", recovery: "엠보 1–3일" },
  ultracol: { energy: "PDO 미립자 주입", duration: "15–30분", recovery: "부기 수일" },
  sculptra: { energy: "PLLA 현탁 주입", duration: "20–40분", recovery: "부기 수일" },
  cellrederm: { duration: "15–30분", recovery: "엠보 1–3일" },
  "skin-glow": { energy: "HA 물광 주입", duration: "15–30분", recovery: "엠보 1–3일" },
  exosome: { duration: "15–30분", recovery: "주사 시 엠보 1–3일" },
  "rejuran-glow": { energy: "PN+HA 주입", duration: "15–30분", recovery: "엠보 1–3일" },
  "glow-botox": { duration: "15–30분", recovery: "엠보 1–3일" },
  "pigment-inj": { duration: "10–20분", recovery: "엠보·붉음 수일" },
  "inflam-inj": { duration: "5–15분", recovery: "병변 부위 경과 관찰" },
  "baby-inj": { duration: "15–30분", recovery: "엠보 1–3일" },
  "panda-inj": { duration: "10–20분", recovery: "엠보 1–3일" },
  "mermaid-inj": { duration: "15–30분", recovery: "엠보 1–3일" },
  skinbooster: { energy: "진피 보습 주입", duration: "15–30분", recovery: "엠보 1–3일" },
  "scar-inj": { duration: "10–20분", recovery: "병변 부위 수일" },
  glutathione: { energy: "정맥 주사", duration: "10–30분", recovery: "당일" },
  "vitc-inj": { duration: "10–30분", recovery: "당일" },
  tranexamic: { energy: "트라넥삼산 메조/주사", duration: "10–20분", recovery: "엠보 1–3일" },
  "growth-inj": { duration: "15–30분", recovery: "엠보 1–3일" },
  "collagen-inj": { duration: "15–30분", recovery: "엠보 1–3일" },
  "cinderella-inj": { energy: "정맥 주사", duration: "10–30분", recovery: "당일" },
  "chanel-inj": { duration: "15–30분", recovery: "엠보 1–3일" },
  "restylane-sb": { energy: "HA 진피 주입", duration: "15–30분", recovery: "엠보 1–3일" },
  haiti: { energy: "HA 표층 주입", duration: "15–30분", recovery: "엠보 1–3일" },
  curejet: { duration: "15–30분", recovery: "점상출혈·붉음 수일" },
  m22: { duration: "20–40분", recovery: "붉음 수시간" },
  fraxel: { duration: "20–40분", recovery: "붉음·딱지 3–5일" },
  erbium: { energy: "Er:YAG 박피", duration: "20–40분", recovery: "깊이 따라 수일–2주" },
  vbeam: { duration: "15–30분", recovery: "자반 수일 가능" },
  potenza: { energy: "RF 마이크로니들", duration: "30–60분", recovery: "붉음 1–3일" },
  clarity: { energy: "알렉산드라이트/Nd:YAG", recovery: "붉음 수시간–수일" },
  co2: { energy: "CO2 프락셔널", duration: "20–40분", recovery: "딱지·붉음 수일–2주" },
  pico: { duration: "15–30분", recovery: "붉음 수시간–수일" },
  vro: { duration: "20–40분", recovery: "당일. 뻐근함 수일" },
  ulthera: { duration: "30–90분", recovery: "당일. 뻐근함·얼얼함 수일" },
  thermage: { duration: "40–90분", recovery: "당일. 열감 수일" },
  volnewmer: { energy: "모노폴라 RF", duration: "20–40분", recovery: "당일" },
  density: { duration: "20–40분", recovery: "붉음 수시간" },
  onda: { energy: "마이크로웨이브", duration: "20–40분", recovery: "열감·부기 수일" },
  shurink: { duration: "20–40분", recovery: "당일. 뻐근함 수일" },
  dermapen: { energy: "마이크로니들", duration: "20–40분", recovery: "붉음 1–3일" },
  mts: { energy: "마이크로니들", duration: "20–40분", recovery: "붉음 1–3일" },
  "tca-cross": { energy: "TCA 점적", duration: "15–30분", recovery: "딱지 약 1주" },
  "facial-care": { duration: "40–60분", recovery: "당일" },
  "acne-care": { duration: "30–50분", recovery: "당일. 발적 가능" },
  cosmelan: { duration: "도포 후 8–12시간(제품 기준)", recovery: "각질·붉음 약 1주" },
  "chemical-peel": { duration: "15–30분", recovery: "각질 수일" },
  aquapeel: { duration: "30–45분", recovery: "당일" },
  hydrafacial: { duration: "30–45분", recovery: "당일" },
  ldm: { energy: "초음파", duration: "15–20분", recovery: "당일" },
  "vitamin-care": { duration: "20–40분", recovery: "당일" },
  violet: { recovery: "당일" },
  subcision: { duration: "20–40분", recovery: "멍·부기 수일–2주" },
  pinhole: { duration: "20–40분", recovery: "딱지 약 1주" },
};

const FILLABLE = ["energy", "tip", "depth", "duration", "recovery", "note", "difference", "effect"] as const;

function fillEmpty(base: TreatmentProtocol, fill?: Partial<TreatmentProtocol>): TreatmentProtocol {
  if (!fill) return base;
  const next: TreatmentProtocol = { ...base };
  for (const key of FILLABLE) {
    if (!next[key] && fill[key]) next[key] = fill[key];
  }
  return next;
}

const PROTOCOL_BY_ID = new Map(PROTOCOLS.map((p) => [p.treatmentId, p]));

export function protocolOf(treatmentId: string): TreatmentProtocol | undefined {
  const base = PROTOCOL_BY_ID.get(treatmentId);
  if (!base) return undefined;
  return fillEmpty(base, FILL_IF_EMPTY[treatmentId]);
}

export function protocolByName(name: string): TreatmentProtocol | undefined {
  const t = getTreatment(name) ?? getTreatmentByName(name);
  return t ? protocolOf(t.id) : undefined;
}

export function formatProtocol(p: TreatmentProtocol): string {
  const t = getTreatment(p.treatmentId);
  const name = t?.name ?? p.treatmentId;
  const bits = [name];
  if (p.energy) bits.push(`에너지 ${p.energy}`);
  if (p.tip) bits.push(`팁 ${p.tip}`);
  if (p.depth) bits.push(`깊이 ${p.depth}`);
  if (p.duration) bits.push(`시간 ${p.duration}`);
  if (p.recovery) bits.push(`회복 ${p.recovery}`);
  bits.push(`간격 ${p.interval}`, `횟수 ${p.sessions}`);
  if (p.note) bits.push(p.note);
  if (p.difference) bits.push(`차이 ${p.difference}`);
  return bits.join(" · ");
}

export function protocolCatalogForAi(houseIds: string[]): string {
  const house = new Set(houseIds);
  const houseLines: string[] = [];
  const otherLines: string[] = [];
  for (const p of PROTOCOLS) {
    const line = `${house.has(p.treatmentId) ? "★원내 " : ""}${formatProtocol(p)}`;
    if (house.has(p.treatmentId)) houseLines.push(line);
    else otherLines.push(line);
  }
  return ["[원내 우선 프로토콜]", ...houseLines, "", "[기타 시술 프로토콜]", ...otherLines].join("\n");
}
