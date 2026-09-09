import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { _ as sortHouseFirst, c as useClinicStore, d as CATEGORY_LABEL, f as CATEGORY_ORDER, g as matchesTreatment, p as TREATMENTS } from "./router-_a-57kHo.mjs";
import { i as protocolOf, t as formatProtocol } from "./protocol-DNnbdeor.mjs";
import { t as Button } from "./button-C0I3zfCw.mjs";
import { t as Input } from "./input-D3MQl9vA.mjs";
import { t as Badge } from "./badge-DeAixo-a.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/treatments-CzgNDbdo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var BOTOX_REGION_LABEL = {
	KR: "국내",
	CN: "중국",
	GLOBAL: "글로벌"
};
var BOTOX_BRANDS = [
	{
		id: "botox",
		name: "보톡스",
		region: "GLOBAL",
		maker: "Allergan",
		type: "오나보툴리눔톡신A",
		onset: "3–5일",
		duration: "3–4개월",
		bestFor: "미간 · 이마 · 눈가 · 사각턱 기준점",
		traits: [
			"오리지널",
			"예측 가능",
			"고가"
		],
		diff: "용량·확산의 기준. 가격이 높다. 사각턱은 국산도 충분.",
		aliases: [
			"Botox",
			"알러간",
			"Allergan"
		]
	},
	{
		id: "xeomin",
		name: "제오민",
		region: "GLOBAL",
		maker: "Merz",
		type: "인코보툴리눔톡신A (순수)",
		onset: "3–7일",
		duration: "3–4개월",
		bestFor: "내성 고려 · 잔주름",
		traits: [
			"복합단백 없음",
			"내성",
			"순수"
		],
		diff: "복합단백을 제거. 반복 시술·내성 병력에 먼저 권한다.",
		aliases: ["Xeomin"]
	},
	{
		id: "nabota",
		name: "나보타",
		region: "KR",
		maker: "대웅",
		type: "프라보툴리눔톡신A",
		onset: "2–4일",
		duration: "3–4개월",
		bestFor: "주름 · 사각턱 (빠른 발현)",
		traits: [
			"빠른 발현",
			"FDA",
			"국내"
		],
		diff: "발현이 빠르다. 미간·사각턱에 많이 쓴다.",
		aliases: ["Nabota", "Jeuveau"]
	},
	{
		id: "botulax",
		name: "보툴렉스",
		region: "KR",
		maker: "휴젤",
		type: "클로스트리디움 톡신A",
		onset: "3–5일",
		duration: "3–4개월",
		bestFor: "사각턱 · 승모근 · 주름",
		traits: [
			"대용량",
			"승모근",
			"국내 널리"
		],
		diff: "사각턱·승모근 대용량에 익숙. 원내 윤곽 세트와 잘 맞는다.",
		aliases: ["Botulax"]
	},
	{
		id: "hutox",
		name: "휴톡스",
		region: "KR",
		maker: "휴온스",
		type: "톡신A",
		onset: "3–5일",
		duration: "3–4개월",
		bestFor: "주름 · 사각턱",
		traits: ["국내", "가성비"],
		diff: "보툴렉스와 자리가 겹친다. 용량 습관을 통일할 것.",
		aliases: ["Hutox"]
	},
	{
		id: "innotox",
		name: "내보톡",
		region: "KR",
		maker: "메디톡스",
		type: "액상 톡신A",
		onset: "2–4일",
		duration: "3–4개월",
		bestFor: "잔주름 · 스킨보톡스 · 물광보톡",
		traits: [
			"액상",
			"희석 오차 적음",
			"표층"
		],
		diff: "액상이라 희석 실수가 적다. 물광보톡스·잔주름에 유리.",
		aliases: ["Innotox", "내보톡스"]
	},
	{
		id: "coretox",
		name: "코어톡스",
		region: "KR",
		maker: "메디톡스",
		type: "순수 톡신A",
		onset: "3–5일",
		duration: "3–4개월",
		bestFor: "내성 고려 · 반복 시술",
		traits: ["복합단백 제거", "내성"],
		diff: "제오민과 같은 자리의 국내 옵션.",
		aliases: ["Coretox"]
	},
	{
		id: "meditoxin",
		name: "메디톡신",
		region: "KR",
		maker: "메디톡스",
		type: "톡신A",
		onset: "3–5일",
		duration: "3–4개월",
		bestFor: "주름 · 사각턱",
		traits: ["국내 대표", "익숙한 용량"],
		diff: "오래 쓴 국산. 뉴로녹스와 계열.",
		aliases: ["Meditoxin", "뉴로녹스"]
	},
	{
		id: "letybo",
		name: "렛이보",
		region: "KR",
		maker: "종근당",
		type: "톡신A",
		onset: "3–5일",
		duration: "3–4개월",
		bestFor: "주름 · 사각턱",
		traits: ["국내", "주름"],
		diff: "유럽 허가 라인. 나보타와 비슷한 자리.",
		aliases: [
			"Letybo",
			"렛보",
			"보투올"
		]
	},
	{
		id: "hengli",
		name: "헝리",
		region: "CN",
		maker: "Lanzhou (衡力)",
		type: "톡신A",
		onset: "3–7일",
		duration: "3–4개월",
		bestFor: "주름 · 사각턱 · 승모근 (중국 의원)",
		traits: [
			"중국 대표",
			"대용량",
			"가성비"
		],
		diff: "중국 의원 기본 톡신. 용량 단위가 다를 수 있어 환산 기록을 남긴다.",
		aliases: [
			"Hengli",
			"란저우",
			"Lanzhou",
			"衡力"
		]
	}
];
var FILLER_REGION_LABEL = {
	KR: "국내",
	CN: "중국",
	GLOBAL: "글로벌"
};
var FILLERS = [
	{
		id: "ellavie",
		name: "엘라비에",
		region: "KR",
		maker: "휴젤",
		material: "HA",
		duration: "9–12개월",
		bestFor: "팔자 · 볼륨 · 윤곽 (원내 대표)",
		traits: [
			"자연스러운 유지",
			"원내 주력",
			"과교정 적음"
		],
		diff: "티 나지 않는 볼륨. 중안면·팔자에 먼저 쓴다.",
		aliases: ["엘라비에 필러", "Ellavie"]
	},
	{
		id: "neuramis",
		name: "뉴라미스",
		region: "KR",
		maker: "메디톡스",
		material: "HA",
		duration: "6–12개월",
		bestFor: "잔주름 · 입술 · 라이트 볼륨",
		traits: [
			"부드러움",
			"입술",
			"가성비"
		],
		diff: "얕은 층·입술에 잘 맞는다. 윤곽 지지는 이브아르·엘라비에.",
		aliases: ["Neuramis"]
	},
	{
		id: "yvoire",
		name: "이브아르",
		region: "KR",
		maker: "LG화학",
		material: "HA",
		duration: "9–12개월",
		bestFor: "턱 · 코 · 윤곽 지지",
		traits: [
			"탄탄한 지지",
			"윤곽",
			"국내"
		],
		diff: "입자감이 탄탄해 라인·턱에 유리. 입술은 뉴라미스.",
		aliases: ["Yvoire"]
	},
	{
		id: "restylane",
		name: "레스틸렌",
		region: "GLOBAL",
		maker: "Galderma",
		material: "HA (NASHA)",
		duration: "9–12개월",
		bestFor: "팔자 · 눈밑 · 입술 · 스킨부스터",
		traits: [
			"지지력",
			"움직임 균형",
			"바이탈 물광"
		],
		diff: "리프트는 지지, 바이탈(물광)은 진피 보습. 레스틸렌 물광과 라인을 나눈다.",
		aliases: ["Restylane", "레스틸렌 필러"]
	},
	{
		id: "juvederm",
		name: "쥬비덤",
		region: "GLOBAL",
		maker: "Allergan",
		material: "HA (Vycross)",
		duration: "12–18개월",
		bestFor: "볼 · 입술 · 부드러운 리프팅",
		traits: [
			"부드러움",
			"장기 유지",
			"볼륨"
		],
		diff: "볼벨라·볼리프트가 중안면 대표. 유지가 길다.",
		aliases: ["Juvederm", "주비덤"]
	},
	{
		id: "belotero",
		name: "벨로테로",
		region: "GLOBAL",
		maker: "Merz",
		material: "HA (CPM)",
		duration: "6–12개월",
		bestFor: "눈밑 · 입가 · 얇은 피부",
		traits: [
			"티 안 남",
			"표층",
			"눈밑"
		],
		diff: "얇은 피부에 티어가 적다. 깊은 볼륨은 쥬비덤·엘라비에.",
		aliases: ["Belotero"]
	},
	{
		id: "runbaiyan",
		name: "룬바이옌",
		region: "CN",
		maker: "Bloomage (润百颜)",
		material: "HA",
		duration: "6–9개월",
		bestFor: "물광 · 잔주름 · 결",
		traits: [
			"물광",
			"중국 인기",
			"결"
		],
		diff: "중국 의원 물광 라인 대표. 볼륨보다 광채.",
		aliases: [
			"润百颜",
			"Runbaiyan",
			"윤백안"
		]
	},
	{
		id: "haiti",
		name: "하이티",
		region: "CN",
		maker: "Imeik (嗨体)",
		material: "HA",
		duration: "6–9개월",
		bestFor: "눈밑 · 목주름 · 잔주름",
		traits: [
			"눈밑 특화",
			"목",
			"표층"
		],
		diff: "嗨体는 눈밑·목에 많이 쓴다. 깊은 팔자는 비추천.",
		aliases: [
			"嗨体",
			"Haiti",
			"하이바디"
		]
	},
	{
		id: "runbaitensi",
		name: "루바이텐스",
		region: "CN",
		maker: "Imeik (濡白天使)",
		material: "HA + 리프팅",
		duration: "9–12개월",
		bestFor: "볼륨 · 리프팅형 중안면",
		traits: [
			"리프트",
			"볼륨",
			"중국"
		],
		diff: "중국 리프팅 필러. 엘라비에보다 들어 올리는 느낌이 강하다.",
		aliases: ["濡白天使", "Reborn Tens"]
	},
	{
		id: "shuangmei",
		name: "솽메이",
		region: "CN",
		maker: "쌍미 (双美)",
		material: "콜라겐",
		duration: "6–9개월",
		bestFor: "잔주름 · 입술 · 콜라겐 보충",
		traits: [
			"콜라겐",
			"잔주름",
			"입술"
		],
		diff: "HA가 아니라 콜라겐. 즉각 볼륨보다 결.",
		aliases: [
			"双美",
			"Shuangmei",
			"쌍메이"
		]
	},
	{
		id: "ifulai",
		name: "아이푸라이",
		region: "CN",
		maker: "Imeik (爱芙莱)",
		material: "HA",
		duration: "6–12개월",
		bestFor: "입술 · 잔볼륨",
		traits: [
			"라이트",
			"입술",
			"가성비"
		],
		diff: "중국 라이트 HA. 국내 뉴라미스와 비슷한 자리.",
		aliases: [
			"爱芙莱",
			"Ifulai",
			"아이푸레이"
		]
	}
];
function TreatmentsPage() {
	const houseIds = useClinicStore((s) => s.houseIds);
	const toggleHouse = useClinicStore((s) => s.toggleHouse);
	const [q, setQ] = (0, import_react.useState)("");
	const [filter, setFilter] = (0, import_react.useState)("house");
	const list = (0, import_react.useMemo)(() => {
		let rows = sortHouseFirst(TREATMENTS, houseIds);
		if (!(q.trim().length > 0)) {
			if (filter === "house") rows = rows.filter((t) => houseIds.includes(t.id));
			else if (filter !== "all" && filter !== "fillers" && filter !== "botox") rows = rows.filter((t) => t.category === filter);
		} else if (filter !== "all" && filter !== "house" && filter !== "fillers" && filter !== "botox") rows = rows.filter((t) => t.category === filter);
		return rows.filter((t) => matchesTreatment(t, q));
	}, [
		filter,
		q,
		houseIds
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "시술 가이드"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl tracking-tight",
					children: "원내 메뉴"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-xl text-sm text-muted",
					children: "주력을 선택하면 AI 상담이 그 시술을 먼저 권합니다."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: q,
				onChange: (e) => setQ(e.target.value),
				placeholder: "시술명, 별칭, 고민"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1",
				children: [
					"house",
					"all",
					...CATEGORY_ORDER,
					"fillers",
					"botox"
				].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: filter === f ? "default" : "outline",
					onClick: () => setFilter(f),
					children: f === "house" ? "주력" : f === "all" ? "전체" : f === "fillers" ? "필러비교" : f === "botox" ? "보톡스비교" : CATEGORY_LABEL[f]
				}, f))
			}),
			filter === "fillers" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandList, {
				query: q,
				items: FILLERS.map((f) => ({
					id: f.id,
					name: f.name,
					region: FILLER_REGION_LABEL[f.region],
					maker: f.maker,
					line: `${f.material} · 지속 ${f.duration}`,
					bestFor: f.bestFor,
					traits: f.traits,
					diff: f.diff,
					blob: [
						f.name,
						f.maker,
						f.bestFor,
						f.diff,
						...f.traits
					].join(" ")
				}))
			}) : filter === "botox" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandList, {
				query: q,
				items: BOTOX_BRANDS.map((b) => ({
					id: b.id,
					name: b.name,
					region: BOTOX_REGION_LABEL[b.region],
					maker: b.maker,
					line: `${b.type} · 발현 ${b.onset} · 지속 ${b.duration}`,
					bestFor: b.bestFor,
					traits: b.traits,
					diff: b.diff,
					blob: [
						b.name,
						b.maker,
						b.bestFor,
						b.diff,
						...b.traits
					].join(" ")
				}))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-3",
				children: list.map((t) => {
					const house = houseIds.includes(t.id);
					const proto = protocolOf(t.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "rounded-xl border border-border bg-surface p-5 shadow-card",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "text-base font-medium",
											children: t.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: CATEGORY_LABEL[t.category] }),
										house ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											tone: "sage",
											children: "주력"
										}) : null
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-ink/80",
									children: t.summary
								}),
								proto ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-sage",
									children: formatProtocol(proto)
								}) : null,
								proto?.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted",
									children: proto.note
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs text-muted",
									children: t.concerns.join(" · ")
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: house ? "default" : "outline",
								onClick: () => toggleHouse(t.id),
								children: house ? "주력 해제" : "주력"
							})]
						})
					}, t.id);
				})
			})
		]
	});
}
function BrandList({ query, items }) {
	const s = query.trim();
	const rows = s ? items.filter((i) => i.blob.includes(s)) : items;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "grid gap-3",
		children: rows.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "rounded-xl border border-border bg-surface p-5 shadow-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-medium",
							children: f.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: f.region }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted",
							children: f.maker
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm",
					children: f.line
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-sage",
					children: ["잘 맞는 부위 · ", f.bestFor]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 flex flex-wrap gap-1.5",
					children: f.traits.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: "sage",
						children: t
					}, t))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted",
					children: f.diff
				})
			]
		}, f.id))
	});
}
//#endregion
export { TreatmentsPage as component };
