import { h as getTreatmentByName, m as getTreatment } from "./router-_a-57kHo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/protocol-DNnbdeor.js
var PROTOCOLS = [
	{
		treatmentId: "ellavie",
		interval: "12–18개월",
		sessions: "1회",
		tip: "중간~심부",
		note: "원내 대표 필러. 과교정 없이 자연 볼륨."
	},
	{
		treatmentId: "restylane",
		interval: "9–12개월",
		sessions: "1회",
		note: "지지가 필요한 팔자·윤곽."
	},
	{
		treatmentId: "juvederm",
		interval: "12–18개월",
		sessions: "1회",
		note: "부드러운 볼륨, 입술·볼."
	},
	{
		treatmentId: "neuramis",
		interval: "6–12개월",
		sessions: "1회",
		note: "잔주름·입술 라이트 볼륨."
	},
	{
		treatmentId: "yvoire",
		interval: "9–12개월",
		sessions: "1회",
		note: "턱·코·윤곽 지지."
	},
	{
		treatmentId: "contour-inj",
		interval: "1–2주",
		sessions: "3–5회",
		note: "이중턱·볼살. 관리·림프 병행."
	},
	{
		treatmentId: "filorga",
		interval: "1–2주",
		sessions: "3–5회 후 유지 월 1",
		note: "NCTF 물광. 광채·결."
	},
	{
		treatmentId: "juvelook",
		interval: "3–4주",
		sessions: "3회 코스",
		note: "모공·흉터. 부종 고지. 원내 추천."
	},
	{
		treatmentId: "rejuran",
		interval: "2–4주",
		sessions: "3–4회",
		note: "재생·장벽. 시술 직후 구진 안내."
	},
	{
		treatmentId: "pdrn",
		interval: "1–2주",
		sessions: "3–5회",
		note: "진정·회복. 레이저 후 병행."
	},
	{
		treatmentId: "ultracol",
		interval: "4주",
		sessions: "2–3회",
		note: "PDO 콜라겐. 마사지 금지 안내."
	},
	{
		treatmentId: "sculptra",
		interval: "4–6주",
		sessions: "2–3회",
		note: "PLLA. 5-5-5 마사지."
	},
	{
		treatmentId: "cellrederm",
		interval: "2–4주",
		sessions: "3회",
		note: "얇은 피부·눈가."
	},
	{
		treatmentId: "skin-glow",
		interval: "3–4주",
		sessions: "3회 후 유지",
		note: "HA 물광. 즉각 광채."
	},
	{
		treatmentId: "exosome",
		interval: "2–4주",
		sessions: "3회",
		note: "레이저/MTS 후 재생."
	},
	{
		treatmentId: "rejuran-glow",
		interval: "3–4주",
		sessions: "3회",
		note: "리쥬란+물광. 보습·재생."
	},
	{
		treatmentId: "glow-botox",
		interval: "3–4개월",
		sessions: "1회",
		energy: "약용량 균일",
		note: "모공·잔주름·피지. 표정 소실 주의."
	},
	{
		treatmentId: "pigment-inj",
		interval: "1–2주",
		sessions: "4–6회",
		note: "국소 색소. 레이저와 교차."
	},
	{
		treatmentId: "inflam-inj",
		interval: "필요 시",
		sessions: "1회",
		note: "낭종·급성 염증. 위축 주의."
	},
	{
		treatmentId: "baby-inj",
		interval: "2–4주",
		sessions: "3회",
		note: "동안 광채 칵테일."
	},
	{
		treatmentId: "panda-inj",
		interval: "3–4주",
		sessions: "3회",
		note: "눈밑 다크서클. 팬더 세트."
	},
	{
		treatmentId: "mermaid-inj",
		interval: "2–4주",
		sessions: "3회",
		note: "톤업·광채."
	},
	{
		treatmentId: "skinbooster",
		interval: "4주",
		sessions: "3회",
		note: "진피 보습 통칭."
	},
	{
		treatmentId: "scar-inj",
		interval: "4주",
		sessions: "3–5회",
		note: "함몰/비대 흉터. 서브시전 병행."
	},
	{
		treatmentId: "glutathione",
		interval: "1주",
		sessions: "10회 코스",
		note: "전신 미백·항산화."
	},
	{
		treatmentId: "vitc-inj",
		interval: "1주",
		sessions: "5–10회",
		note: "피로·항산화."
	},
	{
		treatmentId: "tranexamic",
		interval: "1–2주",
		sessions: "4–6회",
		note: "기미 메조/주사."
	},
	{
		treatmentId: "growth-inj",
		interval: "2–4주",
		sessions: "3회",
		note: "흉터·재생."
	},
	{
		treatmentId: "collagen-inj",
		interval: "4주",
		sessions: "3회",
		note: "탄력·잔주름."
	},
	{
		treatmentId: "cinderella-inj",
		interval: "1주",
		sessions: "5–10회",
		note: "미백·피로. 글루타치온 기반."
	},
	{
		treatmentId: "chanel-inj",
		interval: "2–4주",
		sessions: "3회 코스",
		note: "PN+HA+비타민 광채 칵테일. 결·윤기."
	},
	{
		treatmentId: "restylane-sb",
		interval: "4주",
		sessions: "3회 후 6개월 유지",
		note: "Restylane Skinbooster. 진피 내 HA."
	},
	{
		treatmentId: "haiti",
		interval: "6–9개월",
		sessions: "1–2회",
		tip: "표층",
		note: "嗨体. 눈밑·목주름 특화. 깊은 팔자·볼륨은 엘라비에."
	},
	{
		treatmentId: "botulinum",
		interval: "3–4개월",
		sessions: "1회",
		note: "주름 4개월, 사각턱 4–6개월."
	},
	{
		treatmentId: "botox",
		interval: "3–4개월",
		sessions: "1회",
		note: "알러간. 미간·이마·눈가·사각턱."
	},
	{
		treatmentId: "nabota",
		interval: "3–4개월",
		sessions: "1회",
		note: "빠른 발현."
	},
	{
		treatmentId: "hutox",
		interval: "3–4개월",
		sessions: "1회"
	},
	{
		treatmentId: "botulax",
		interval: "3–4개월",
		sessions: "1회",
		note: "사각턱·승모근에 자주."
	},
	{
		treatmentId: "innotox",
		interval: "3–4개월",
		sessions: "1회",
		note: "액상. 잔주름·스킨보톡스."
	},
	{
		treatmentId: "coretox",
		interval: "3–4개월",
		sessions: "1회",
		note: "내성 병력 시."
	},
	{
		treatmentId: "meditoxin",
		interval: "3–4개월",
		sessions: "1회"
	},
	{
		treatmentId: "xeomin",
		interval: "3–4개월",
		sessions: "1회",
		note: "순수 톡신."
	},
	{
		treatmentId: "hengli",
		interval: "3–4개월",
		sessions: "1회"
	},
	{
		treatmentId: "lituo",
		interval: "2–4주",
		sessions: "5–10회",
		energy: "저출력 토닝",
		note: "원내 색소·기미. 휴가철 전 차단 강조."
	},
	{
		treatmentId: "curejet",
		interval: "3–4주",
		sessions: "3회",
		energy: "4–6 bar",
		note: "리쥬란·쥬베룩 제트 주입. 통증 적음."
	},
	{
		treatmentId: "qlaser",
		interval: "1–2주",
		sessions: "5–10회",
		energy: "1064nm 1.2–1.8 J/cm²",
		note: "원내 토닝. 기미 악화 고지."
	},
	{
		treatmentId: "m22",
		interval: "3–4주",
		sessions: "3–5회",
		energy: "560/590nm 14–16 J",
		tip: "IPL",
		note: "홍조·색소·광노화. 선크림 필수."
	},
	{
		treatmentId: "fraxel",
		interval: "4–6주",
		sessions: "3회",
		energy: "15–25 mJ",
		tip: "8–10mm",
		note: "모공·흉터. 다운타임 3–5일."
	},
	{
		treatmentId: "erbium",
		interval: "6–8주",
		sessions: "1–3회",
		note: "박피. 재생테이프·차단."
	},
	{
		treatmentId: "fotona",
		interval: "4주",
		sessions: "3회",
		note: "스무스아이·리프팅 모드."
	},
	{
		treatmentId: "vbeam",
		interval: "4주",
		sessions: "3–5회",
		energy: "7–9 J",
		note: "홍조·혈관. 퍼플 자반 안내."
	},
	{
		treatmentId: "potenza",
		interval: "4주",
		sessions: "3회",
		tip: "니들 RF",
		note: "모공·흉터·탄력."
	},
	{
		treatmentId: "clarity",
		interval: "4주",
		sessions: "5회+",
		note: "제모·색소."
	},
	{
		treatmentId: "co2",
		interval: "6–8주",
		sessions: "1–3회",
		note: "깊은 흉터·점. 다운타임 길음."
	},
	{
		treatmentId: "pico",
		interval: "2–4주",
		sessions: "3–5회",
		energy: "0.7–1.2 J",
		note: "기미·톤·문신. 미백 코스 핵심."
	},
	{
		treatmentId: "vro",
		interval: "3–6개월",
		sessions: "1회",
		energy: "0.7–1.0 J",
		tip: "3.0/4.5mm",
		note: "원내 HIFU. 턱선·볼."
	},
	{
		treatmentId: "ulthera",
		interval: "12개월",
		sessions: "1회",
		energy: "0.8–1.2 J",
		tip: "1.5/3.0/4.5mm",
		note: "SMAS 리프팅. 샷 수 상담."
	},
	{
		treatmentId: "thermage",
		interval: "12개월",
		sessions: "1회",
		energy: "450–600샷",
		tip: "FLX 4.0",
		note: "타이트닝·윤곽. 필러와 시차."
	},
	{
		treatmentId: "volnewmer",
		interval: "6–12개월",
		sessions: "1회",
		note: "모노폴라 RF. 볼륨 유지형."
	},
	{
		treatmentId: "density",
		interval: "4–6개월",
		sessions: "1회",
		energy: "400샷",
		note: "진피 밀도."
	},
	{
		treatmentId: "onda",
		interval: "4주",
		sessions: "3회",
		note: "이중턱 Coolwaves."
	},
	{
		treatmentId: "shurink",
		interval: "3–6개월",
		sessions: "1회",
		energy: "0.7–1.0 J",
		tip: "3.0/4.5mm",
		note: "일상 HIFU."
	},
	{
		treatmentId: "dermapen",
		interval: "3–4주",
		sessions: "3–5회",
		note: "자동 니들. 약물 침투. MTS와 구분."
	},
	{
		treatmentId: "mts",
		interval: "3–4주",
		sessions: "3–5회",
		note: "마이크로니들/더마롤러. 더마펜과 별도 시술."
	},
	{
		treatmentId: "tca-cross",
		interval: "4–6주",
		sessions: "3–5회",
		note: "아이스픽 흉터. 핀홀·서브시전 병행."
	},
	{
		treatmentId: "facial-care",
		interval: "1–2주",
		sessions: "정기 관리",
		note: "클렌징·수분·진정. 시술 사이 유지."
	},
	{
		treatmentId: "acne-care",
		interval: "1주",
		sessions: "4–8회",
		note: "압출·진정·재생. 브이올렛·염증주사 병행 가능."
	},
	{
		treatmentId: "cosmelan",
		interval: "코스 1회+유지",
		sessions: "1 코스",
		note: "기미 집중. 홈케어 필수. 자외선 차단."
	},
	{
		treatmentId: "chemical-peel",
		interval: "2–4주",
		sessions: "3–5회",
		note: "각질·색소·결."
	},
	{
		treatmentId: "aquapeel",
		interval: "2주",
		sessions: "정기",
		note: "모공·피지·즉각 광채."
	},
	{
		treatmentId: "hydrafacial",
		interval: "4주",
		sessions: "정기",
		note: "흡입+용액 페이셜."
	},
	{
		treatmentId: "ldm",
		interval: "주 1–2회",
		sessions: "시술 후/진정",
		note: "장벽·부종·홍조. 레이저 후 추천."
	},
	{
		treatmentId: "vitamin-care",
		interval: "1주",
		sessions: "5–10회",
		note: "톤·광채 이온 관리."
	},
	{
		treatmentId: "violet",
		interval: "2–4주",
		sessions: "3회",
		note: "피지선 억제. 여드름 코스."
	},
	{
		treatmentId: "subcision",
		interval: "4–8주",
		sessions: "1–3회",
		note: "함몰 흉터 섬유대 절단. 필러/레이저 병행."
	},
	{
		treatmentId: "pinhole",
		interval: "6–8주",
		sessions: "2–4회",
		note: "깊은 공함몰 흉터."
	}
];
var PROTOCOL_BY_ID = new Map(PROTOCOLS.map((p) => [p.treatmentId, p]));
function protocolOf(treatmentId) {
	return PROTOCOL_BY_ID.get(treatmentId);
}
function protocolByName(name) {
	const t = getTreatment(name) ?? getTreatmentByName(name);
	return t ? protocolOf(t.id) : void 0;
}
function formatProtocol(p) {
	const bits = [getTreatment(p.treatmentId)?.name ?? p.treatmentId];
	if (p.energy) bits.push(`에너지 ${p.energy}`);
	if (p.tip) bits.push(`팁 ${p.tip}`);
	bits.push(`간격 ${p.interval}`, `횟수 ${p.sessions}`);
	if (p.note) bits.push(p.note);
	return bits.join(" · ");
}
function protocolCatalogForAi(houseIds) {
	const house = new Set(houseIds);
	const houseLines = [];
	const otherLines = [];
	for (const p of PROTOCOLS) {
		const line = `${house.has(p.treatmentId) ? "★원내 " : ""}${formatProtocol(p)}`;
		if (house.has(p.treatmentId)) houseLines.push(line);
		else otherLines.push(line);
	}
	return [
		"[원내 우선 프로토콜]",
		...houseLines,
		"",
		"[기타 시술 프로토콜]",
		...otherLines
	].join("\n");
}
//#endregion
export { protocolOf as i, protocolByName as n, protocolCatalogForAi as r, formatProtocol as t };
