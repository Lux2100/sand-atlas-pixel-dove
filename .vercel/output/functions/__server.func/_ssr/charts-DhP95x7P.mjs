import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as useClinicStore, x as formatDate } from "./router-_a-57kHo.mjs";
import { t as searchPatients } from "./patients-DwMra-Ur.mjs";
import { t as Button } from "./button-C0I3zfCw.mjs";
import { t as Input } from "./input-D3MQl9vA.mjs";
import { t as PatientFormDialog } from "./patient-form-dialog-CO7p7iiU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/charts-DhP95x7P.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ChartsPage() {
	const navigate = useNavigate();
	const patients = useClinicStore((s) => s.patients);
	const visits = useClinicStore((s) => s.visits);
	const upsertPatient = useClinicStore((s) => s.upsertPatient);
	const [q, setQ] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const list = (0, import_react.useMemo)(() => searchPatients(patients, visits, q), [
		patients,
		visits,
		q
	]);
	const dateHits = list.filter((p) => p.visitDate);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "차트"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl tracking-tight",
						children: "손님 검색"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted",
						children: "이름, 차트번호, 또는 날짜 (예: 26.09.01)"
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => setOpen(true),
					children: "새 차트"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: q,
				onChange: (e) => setQ(e.target.value),
				placeholder: "이름, 차트번호, 26.09.01"
			}),
			dateHits.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-sage",
				children: [
					formatDate(dateHits[0].visitDate, "yyyy.MM.dd"),
					" 내원 ",
					dateHits.length,
					"명"
				]
			}) : q.trim() && list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "그날 내원 기록이 없거나 검색어가 맞지 않습니다."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-2",
				children: list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted",
					children: "검색 결과가 없습니다."
				}) : list.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HitRow, { hit: p }, p.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PatientFormDialog, {
				open,
				onOpenChange: setOpen,
				onSave: (p) => {
					const created = upsertPatient(p);
					navigate({
						to: "/patients/$id",
						params: { id: created.id }
					});
				}
			})
		]
	});
}
function HitRow({ hit }) {
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		className: "flex w-full items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 text-left hover:border-sage/40",
		onClick: () => navigate({
			to: "/patients/$id",
			params: { id: hit.id }
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium",
				children: hit.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "ml-2 text-xs text-muted",
				children: hit.chartNo
			}),
			hit.phone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "ml-2 text-xs text-subtle",
				children: hit.phone
			}) : null
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-right",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block max-w-[220px] truncate text-xs text-sage",
				children: hit.hitLabel || (hit.lastTreatments ? hit.lastTreatments.join(" · ") : "기록 없음")
			})
		})]
	}) });
}
//#endregion
export { ChartsPage as component };
