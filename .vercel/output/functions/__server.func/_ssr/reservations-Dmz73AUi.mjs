import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { D as todayISO, b as dayOffset, c as useClinicStore, x as formatDate } from "./router-_a-57kHo.mjs";
import { t as Button } from "./button-C0I3zfCw.mjs";
import { a as pendingBookings, i as bookingsForDate, n as ReservationFormDialog, t as BookingRow } from "./reservations-CSjxloph.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reservations-Dmz73AUi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReservationsPage() {
	const patients = useClinicStore((s) => s.patients);
	const visits = useClinicStore((s) => s.visits);
	const reservations = useClinicStore((s) => s.reservations);
	const toggleBookingCancel = useClinicStore((s) => s.toggleBookingCancel);
	const [open, setOpen] = (0, import_react.useState)(false);
	const today = todayISO();
	const tomorrow = dayOffset(1);
	const todayList = (0, import_react.useMemo)(() => pendingBookings(bookingsForDate(today, patients, visits, reservations), visits, today), [
		today,
		patients,
		visits,
		reservations
	]);
	const tomorrowList = (0, import_react.useMemo)(() => bookingsForDate(tomorrow, patients, visits, reservations), [
		tomorrow,
		patients,
		visits,
		reservations
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "예약관리"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl tracking-tight",
					children: "오늘 · 내일"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => setOpen(true),
					children: "예약 추가"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: `오늘 ${formatDate(today)}`,
				items: todayList,
				onToggle: toggleBookingCancel
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: `내일 ${formatDate(tomorrow)}`,
				items: tomorrowList,
				onToggle: toggleBookingCancel
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReservationFormDialog, {
				open,
				onOpenChange: setOpen
			})
		]
	});
}
function Section({ title, items, onToggle }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "grid gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-sm font-medium",
			children: title
		}), items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted",
			children: "예약이 없습니다."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "grid gap-2",
			children: items.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookingRow, {
				booking: b,
				onToggleCancel: onToggle
			}, b.key))
		})]
	});
}
//#endregion
export { ReservationsPage as component };
