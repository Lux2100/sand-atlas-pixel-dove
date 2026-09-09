import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { D as todayISO, E as snapVisitTime, _ as sortHouseFirst, c as useClinicStore, d as CATEGORY_LABEL, f as CATEGORY_ORDER, g as matchesTreatment, l as cn, p as TREATMENTS, u as uid, v as VISIT_MINUTES, w as nowTime } from "./router-_a-57kHo.mjs";
import { t as Button } from "./button-C0I3zfCw.mjs";
import { t as Input } from "./input-D3MQl9vA.mjs";
import { n as DialogContent, t as Dialog } from "./dialog-DbnL0gwX.mjs";
import { t as Label } from "./label-3oz5v3ue.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/visit-form-dialog-BB3HmfFm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MEMO_MARKS = [
	"★",
	"☆",
	"✓",
	"✗",
	"→"
];
function escapeAmp(s) {
	return s.replace(/&(?!(amp|lt|gt|quot|nbsp|#\d+|#x[0-9a-fA-F]+);)/g, "&");
}
function sanitizeColor(value) {
	const v = value.trim().replace(/["']/g, "");
	if (!v || /expression|javascript|url\s*\(/i.test(v)) return void 0;
	if (/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(v)) return v;
	if (/^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}(?:\s*,\s*(0|0?\.\d+|1))?\s*\)$/i.test(v)) return v;
	if (/^[a-z]{1,20}$/i.test(v)) return v.toLowerCase();
}
/** Allow plain text, <br>, and <span style="color:..."> only. */
function sanitizeMemo(raw) {
	if (!raw) return "";
	let s = String(raw).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");
	s = s.replace(/<br\s*\/?>/gi, "{{BR}}");
	const spans = [];
	s = s.replace(/<span\b([^>]*)>([\s\S]*?)<\/span>/gi, (_full, attrs, inner) => {
		const styleMatch = String(attrs).match(/style\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
		const colorMatch = (styleMatch?.[1] ?? styleMatch?.[2] ?? "").match(/(?:^|;)\s*color\s*:\s*([^;]+)/i);
		const color = colorMatch ? sanitizeColor(colorMatch[1]) : void 0;
		const token = `{{SPAN${spans.length}}}`;
		const safeInner = inner.replace(/<[^>]+>/g, "");
		spans.push(color ? `<span style="color:${color}">${safeInner}</span>` : safeInner);
		return token;
	});
	s = s.replace(/<[^>]+>/g, "");
	s = escapeAmp(s);
	spans.forEach((html, i) => {
		s = s.replace(`{{SPAN${i}}}`, html);
	});
	s = s.replace(/\{\{BR\}\}/g, "<br/>");
	return s;
}
function memoToPlain(html) {
	if (!html) return "";
	return html.replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>/gi, "\n").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/</g, "<").replace(/>/g, ">").replace(/"/g, "\"").replace(/&/g, "&").replace(/\n{3,}/g, "\n\n").trim();
}
var RED = "#a61b1b";
var INK = "#1c1915";
function MemoEditor({ value, onChange, className }) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		const next = value ?? "";
		if (el.innerHTML !== next) el.innerHTML = next;
	}, [value]);
	const emit = () => {
		const el = ref.current;
		if (!el) return;
		onChange(sanitizeMemo(el.innerHTML));
	};
	const run = (cmd, arg) => {
		ref.current?.focus();
		document.execCommand(cmd, false, arg);
		emit();
	};
	const paintBody = () => {
		ref.current?.focus();
		document.execCommand("removeFormat");
		document.execCommand("foreColor", false, INK);
		emit();
	};
	const insertMark = (mark) => {
		ref.current?.focus();
		document.execCommand("insertText", false, mark);
		emit();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("overflow-hidden rounded-md border border-border bg-surface", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-1 border-b border-border bg-surface-2 px-2 py-1.5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "h-8 rounded-md px-2 text-xs text-ink hover:bg-surface",
					onMouseDown: (e) => e.preventDefault(),
					onClick: paintBody,
					children: "본문"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "h-8 rounded-md px-2 text-xs hover:bg-surface",
					style: { color: RED },
					onMouseDown: (e) => e.preventDefault(),
					onClick: () => run("foreColor", RED),
					children: "강조"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mx-1 h-4 w-px bg-border" }),
				MEMO_MARKS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "size-8 rounded-md text-sm text-ink hover:bg-surface",
					onMouseDown: (e) => e.preventDefault(),
					onClick: () => insertMark(m),
					children: m
				}, m))
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref,
			contentEditable: true,
			role: "textbox",
			"aria-label": "시술 메모",
			className: "memo-body min-h-24 px-3 py-2 text-sm leading-relaxed text-ink outline-none",
			onInput: emit,
			onBlur: () => {
				const el = ref.current;
				if (!el) return;
				const html = sanitizeMemo(el.innerHTML);
				if (el.innerHTML !== html) el.innerHTML = html;
				onChange(html);
			}
		})]
	});
}
var HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
function TimeSelect({ value, onChange, className }) {
	const snapped = snapVisitTime(value);
	const hour = snapped.slice(0, 2);
	const minute = snapped.slice(3, 5);
	const selectClass = "h-10 rounded-md border border-border bg-surface px-2 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-ring/40";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex items-center gap-1.5", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
				"aria-label": "시",
				className: selectClass,
				value: hour,
				onChange: (e) => onChange(snapVisitTime(`${e.target.value}:${minute}`)),
				children: HOURS.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: h,
					children: h
				}, h))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted",
				children: ":"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
				"aria-label": "분",
				className: selectClass,
				value: VISIT_MINUTES.includes(minute) ? minute : "00",
				onChange: (e) => onChange(snapVisitTime(`${hour}:${e.target.value}`)),
				children: VISIT_MINUTES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: m,
					children: m
				}, m))
			})
		]
	});
}
function fillFrom(visit) {
	const editing = Boolean(visit?.id);
	return {
		date: visit?.date ?? todayISO(),
		time: visit?.time ? snapVisitTime(visit.time) : editing ? "10:00" : nowTime(),
		nextVisit: visit?.nextVisit ?? "",
		treatments: visit?.treatments ?? [],
		memo: visit?.memo ?? "",
		paid: visit?.paidAmount != null ? String(visit.paidAmount) : "",
		recharge: visit?.rechargeAmount != null ? String(visit.rechargeAmount) : "",
		redeem: visit?.redeemAmount != null ? String(visit.redeemAmount) : ""
	};
}
function parseAmount(raw) {
	const n = Number(String(raw).replace(/,/g, "").trim());
	return raw.trim() !== "" && Number.isFinite(n) ? n : void 0;
}
function VisitFormDialog({ open, onOpenChange, patientId, initial, onSave }) {
	const [date, setDate] = (0, import_react.useState)(todayISO());
	const [time, setTime] = (0, import_react.useState)(nowTime());
	const [nextVisit, setNextVisit] = (0, import_react.useState)("");
	const [treatments, setTreatments] = (0, import_react.useState)([]);
	const [memo, setMemo] = (0, import_react.useState)("");
	const [paid, setPaid] = (0, import_react.useState)("");
	const [recharge, setRecharge] = (0, import_react.useState)("");
	const [redeem, setRedeem] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const next = fillFrom(initial);
		setDate(next.date);
		setTime(next.time);
		setNextVisit(next.nextVisit);
		setTreatments(next.treatments);
		setMemo(next.memo);
		setPaid(next.paid);
		setRecharge(next.recharge);
		setRedeem(next.redeem);
	}, [open, initial?.id]);
	const submit = () => {
		if (!date) return;
		onSave({
			id: initial?.id ?? uid("v"),
			patientId,
			date,
			time,
			treatments,
			memo: memo || void 0,
			nextVisit: nextVisit || void 0,
			paidAmount: parseAmount(paid),
			rechargeAmount: parseAmount(recharge),
			redeemAmount: parseAmount(redeem),
			source: initial?.source
		});
		onOpenChange(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			title: initial?.id ? "기록 수정" : "기록 추가",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-4 grid gap-3",
				onSubmit: (e) => {
					e.preventDefault();
					submit();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "날짜" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: date,
								onChange: (e) => setDate(e.target.value)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "시간" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimeSelect, {
								value: time,
								onChange: setTime
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "다음 내원" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: nextVisit,
							onChange: (e) => setNextVisit(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "시술" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TreatmentPicker, {
							value: treatments,
							onChange: setTreatments
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-3 gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AmountField, {
								label: "결제",
								value: paid,
								onChange: setPaid
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AmountField, {
								label: "충전",
								value: recharge,
								onChange: setRecharge
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AmountField, {
								label: "차감",
								value: redeem,
								onChange: setRedeem
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "메모" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemoEditor, {
							value: memo,
							onChange: setMemo
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex justify-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							onClick: () => onOpenChange(false),
							children: "닫기"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							children: "저장"
						})]
					})
				]
			})
		})
	});
}
function AmountField({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			type: "number",
			inputMode: "numeric",
			min: 0,
			value,
			onChange: (e) => onChange(e.target.value),
			placeholder: "0"
		})]
	});
}
function TreatmentPicker({ value, onChange }) {
	const houseIds = useClinicStore((s) => s.houseIds);
	const [filter, setFilter] = (0, import_react.useState)("house");
	const [q, setQ] = (0, import_react.useState)("");
	const list = (0, import_react.useMemo)(() => {
		let rows = sortHouseFirst(TREATMENTS, houseIds);
		if (filter === "house") rows = rows.filter((t) => houseIds.includes(t.id) || t.house);
		else if (filter !== "all") rows = rows.filter((t) => t.category === filter);
		return rows.filter((t) => matchesTreatment(t, q)).slice(0, 40);
	}, [
		filter,
		q,
		houseIds
	]);
	const toggle = (name) => {
		onChange(value.includes(name) ? value.filter((x) => x !== name) : [...value, name]);
	};
	const filters = [
		{
			id: "house",
			label: "주력"
		},
		{
			id: "all",
			label: "전체"
		},
		...CATEGORY_ORDER.map((id) => ({
			id,
			label: CATEGORY_LABEL[id]
		}))
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-2 rounded-md border border-border bg-surface p-2",
		children: [
			value.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-wrap gap-1",
				children: value.map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "rounded-full bg-sage-soft px-2 py-0.5 text-xs text-sage",
					onClick: () => toggle(name),
					children: [name, " ×"]
				}) }, name))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-subtle",
				children: "시술을 고르세요."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: q,
				onChange: (e) => setQ(e.target.value),
				placeholder: "시술 검색"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1",
				children: filters.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					size: "sm",
					variant: filter === f.id ? "default" : "outline",
					onClick: () => setFilter(f.id),
					children: f.label
				}, f.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid max-h-40 gap-1 overflow-y-auto",
				children: list.map((t) => {
					const on = value.includes(t.name);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: `flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm ${on ? "bg-sage-soft text-sage" : "hover:bg-surface-2"}`,
						onClick: () => toggle(t.name),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted",
							children: CATEGORY_LABEL[t.category]
						})]
					}) }, t.id);
				})
			})
		]
	});
}
//#endregion
export { memoToPlain as i, TreatmentPicker as n, VisitFormDialog as r, TimeSelect as t };
