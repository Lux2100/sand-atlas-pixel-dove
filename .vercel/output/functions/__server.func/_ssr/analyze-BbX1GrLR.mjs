import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { D as todayISO, c as useClinicStore, i as Route$6, p as TREATMENTS } from "./router-_a-57kHo.mjs";
import { t as searchPatients } from "./patients-DwMra-Ur.mjs";
import { t as compressImage } from "./photo-ChnCRbNQ.mjs";
import { n as protocolByName, r as protocolCatalogForAi } from "./protocol-DNnbdeor.mjs";
import { t as Button } from "./button-C0I3zfCw.mjs";
import { t as Input } from "./input-D3MQl9vA.mjs";
import { t as Textarea } from "./textarea-DrMx_Gum.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analyze-BbX1GrLR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var analyzeFace = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("710138151ae96c3136a76fa87c5bb44ad5a20c29910a2f8bc3d94cb975452d15"));
function AnalyzePage() {
	const navigate = useNavigate();
	const { patientId: initialPatientId } = Route$6.useSearch();
	const houseIds = useClinicStore((s) => s.houseIds);
	const patients = useClinicStore((s) => s.patients);
	const visits = useClinicStore((s) => s.visits);
	const addConsult = useClinicStore((s) => s.addConsult);
	const addPhoto = useClinicStore((s) => s.addPhoto);
	const houseNames = (0, import_react.useMemo)(() => TREATMENTS.filter((t) => houseIds.includes(t.id)).map((t) => t.name), [houseIds]);
	const fileRef = (0, import_react.useRef)(null);
	const [images, setImages] = (0, import_react.useState)([]);
	const [note, setNote] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [result, setResult] = (0, import_react.useState)(null);
	const [linkChart, setLinkChart] = (0, import_react.useState)(Boolean(initialPatientId));
	const [patientId, setPatientId] = (0, import_react.useState)(initialPatientId);
	const [pq, setPq] = (0, import_react.useState)("");
	const [savedId, setSavedId] = (0, import_react.useState)(null);
	const selected = patients.find((p) => p.id === patientId);
	const matches = (0, import_react.useMemo)(() => searchPatients(patients, visits, pq).slice(0, 6), [
		patients,
		visits,
		pq
	]);
	const catalog = (0, import_react.useMemo)(() => TREATMENTS.map((t) => {
		return `${houseIds.includes(t.id) ? "[주력] " : ""}${t.name} (${t.category}) — ${t.summary}`;
	}).join("\n"), [houseIds]);
	const saveToChart = (analysis, pid) => {
		const consult = addConsult({
			patientId: pid,
			date: todayISO(),
			note: note.trim() || void 0,
			analysis,
			photoUrls: images
		});
		for (const url of images) addPhoto({
			patientId: pid,
			kind: "other",
			url,
			takenAt: todayISO(),
			note: "AI상담"
		});
		setSavedId(consult.id);
		return consult.id;
	};
	const run = async () => {
		if (images.length === 0) return;
		setBusy(true);
		setError(null);
		setSavedId(null);
		try {
			const res = await analyzeFace({ data: {
				images,
				houseNames,
				catalog,
				protocols: protocolCatalogForAi(houseIds),
				note
			} });
			if (!res.ok) setError(res.error ?? "분석에 실패했습니다.");
			else {
				setResult(res.analysis);
				if (linkChart && patientId) saveToChart(res.analysis, patientId);
			}
		} catch (e) {
			setError(e instanceof Error ? e.message : "상담에 실패했습니다.");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted",
			children: "AI 상담"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl tracking-tight",
			children: "얼굴 사진으로 계획"
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 md:grid-cols-2 md:items-start",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-xl border border-border bg-surface p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: "차트 연결"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: !linkChart ? "default" : "outline",
									onClick: () => setLinkChart(false),
									children: "연결 안 함"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: linkChart ? "default" : "outline",
									onClick: () => setLinkChart(true),
									children: "차트에 연결"
								})]
							}),
							linkChart ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 grid gap-2",
								children: selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between rounded-md border border-border px-3 py-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: selected.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "ml-2 text-xs text-muted",
											children: selected.chartNo
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										onClick: () => setPatientId(void 0),
										children: "변경"
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: pq,
									onChange: (e) => setPq(e.target.value),
									placeholder: "연결할 손님 이름 또는 차트번호"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "overflow-hidden rounded-md border border-border",
									children: (pq.trim() ? matches : patients.slice(0, 6)).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-surface-2",
										onClick: () => setPatientId(p.id),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted",
											children: p.chartNo
										})]
									}) }, p.id))
								})] })
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-surface p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "우선 추천 · 원내 주력"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-sage",
							children: houseNames.join(" · ") || "시술 가이드에서 주력을 선택하세요."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: fileRef,
						type: "file",
						accept: "image/*",
						multiple: true,
						className: "hidden",
						onChange: async (e) => {
							const files = Array.from(e.target.files ?? []);
							e.target.value = "";
							const urls = [];
							for (const file of files.slice(0, 4)) urls.push(await compressImage(file));
							setImages((prev) => [...prev, ...urls].slice(0, 4));
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => fileRef.current?.click(),
							children: "사진 추가"
						}), images.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => setImages([]),
							children: "지우기"
						}) : null]
					}),
					images.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid grid-cols-2 gap-3",
						children: images.map((src, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "overflow-hidden rounded-lg border border-border",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src,
								alt: "",
								className: "aspect-square w-full object-cover"
							})
						}, i))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted",
						children: "정면 사진을 올리면 분석이 정확합니다."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: note,
						onChange: (e) => setNote(e.target.value),
						placeholder: "손님이 말한 고민, 최근 시술"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: busy || images.length === 0 || linkChart && !patientId,
						onClick: () => void run(),
						children: busy ? "분석 중…" : linkChart ? "분석하고 차트에 저장" : "시술 계획 보기"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-surface p-5 md:sticky md:top-6 md:min-h-[28rem]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "시술 계획"
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-danger",
						children: error
					}) : null,
					savedId && selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex items-center justify-between rounded-lg bg-sage-soft px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-sage",
							children: [selected.name, " 차트에 저장됨"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => navigate({
								to: "/patients/$id",
								params: { id: selected.id }
							}),
							children: "차트 보기"
						})]
					}) : null,
					busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-8 text-center text-sm text-muted",
						children: "사진을 보고 계획을 짜는 중입니다…"
					}) : result ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Result, { analysis: result }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-8 text-center text-sm text-muted",
						children: "왼쪽에서 사진을 올리고 시술 계획 보기를 누르면 여기에 답변이 나옵니다."
					})
				]
			})]
		})]
	});
}
function Result({ analysis }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 grid gap-5",
		children: [
			analysis.findings.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm font-medium",
					children: [
						f.area,
						" · ",
						f.concern
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: f.detail
				})]
			}, i)),
			analysis.recommendations.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-sage",
						children: r.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm",
						children: r.reason
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted",
						children: r.protocol || formatFallback(r.name)
					})
				]
			}, i)),
			analysis.plan.map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-3 rounded-lg border border-border px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-2xl text-sage",
					children: step.order
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-medium",
						children: [
							step.timing,
							" · ",
							step.title
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-sage",
						children: step.treatments.join(" · ")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: step.note
					})
				] })]
			}, step.order))
		]
	});
}
function formatFallback(name) {
	const p = protocolByName(name);
	if (!p) return "";
	return [
		p.energy,
		p.tip,
		`${p.interval} 간격`,
		p.sessions
	].filter(Boolean).join(" · ");
}
//#endregion
export { AnalyzePage as component };
