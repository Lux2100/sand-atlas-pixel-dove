import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { D as todayISO, E as snapVisitTime, S as formatTime, c as useClinicStore, u as uid, w as nowTime } from "./router-_a-57kHo.mjs";
import { t as Button } from "./button-C0I3zfCw.mjs";
import { t as Input } from "./input-D3MQl9vA.mjs";
import { t as Textarea } from "./textarea-DrMx_Gum.mjs";
import { n as DialogContent, t as Dialog } from "./dialog-DbnL0gwX.mjs";
import { t as Label } from "./label-3oz5v3ue.mjs";
import { t as PatientFormDialog } from "./patient-form-dialog-CO7p7iiU.mjs";
import { t as Badge } from "./badge-DeAixo-a.mjs";
import { n as TreatmentPicker, t as TimeSelect } from "./visit-form-dialog-BB3HmfFm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reservations-CSjxloph.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReservationFormDialog({ open, onOpenChange, initial }) {
	const patients = useClinicStore((s) => s.patients);
	const upsertReservation = useClinicStore((s) => s.upsertReservation);
	const [date, setDate] = (0, import_react.useState)(todayISO());
	const [time, setTime] = (0, import_react.useState)(nowTime());
	const [name, setName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [patientId, setPatientId] = (0, import_react.useState)();
	const [treatments, setTreatments] = (0, import_react.useState)([]);
	const [note, setNote] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setDate(initial?.date ?? todayISO());
		setTime(initial?.time ? snapVisitTime(initial.time) : nowTime());
		setName(initial?.name ?? "");
		setPhone(initial?.phone ?? "");
		setPatientId(initial?.patientId);
		setTreatments(initial?.treatments ?? []);
		setNote(initial?.note ?? "");
	}, [open, initial?.id]);
	const matches = (0, import_react.useMemo)(() => {
		const n = name.trim().toLowerCase();
		const ph = phone.replace(/\D/g, "");
		if (!n && ph.length < 3) return [];
		return patients.filter((p) => {
			if (patientId && p.id === patientId) return false;
			if (n && p.name.toLowerCase().includes(n)) return true;
			if (ph.length >= 3 && (p.phone ?? "").replace(/\D/g, "").includes(ph)) return true;
			return false;
		}).slice(0, 6);
	}, [
		name,
		phone,
		patients,
		patientId
	]);
	const selected = patients.find((p) => p.id === patientId);
	const submit = () => {
		const trimmed = name.trim();
		if (!trimmed || !date) return;
		upsertReservation({
			id: initial?.id ?? uid("r"),
			date,
			time,
			name: trimmed,
			phone: phone.trim() || void 0,
			patientId,
			treatments: treatments.length ? treatments : void 0,
			note: note.trim(),
			cancelled: initial?.cancelled
		});
		onOpenChange(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			title: initial ? "예약 수정" : "예약 추가",
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
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "이름" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: name,
								onChange: (e) => {
									setName(e.target.value);
									setPatientId(void 0);
								},
								placeholder: "예약 손님"
							}),
							selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-sage",
								children: [
									"연결됨 · ",
									selected.name,
									" ",
									selected.chartNo
								]
							}) : matches.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "overflow-hidden rounded-md border border-border",
								children: matches.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-surface-2",
									onClick: () => {
										setName(p.name);
										setPhone(p.phone ?? phone);
										setPatientId(p.id);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted",
										children: p.chartNo
									})]
								}) }, p.id))
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "전화" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "tel",
							value: phone,
							onChange: (e) => setPhone(e.target.value),
							placeholder: "010-"
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
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "메모" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: note,
							onChange: (e) => setNote(e.target.value),
							placeholder: "예약 메모"
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
							disabled: !name.trim(),
							children: "저장"
						})]
					})
				]
			})
		})
	});
}
function BookingRow({ booking, onToggleCancel }) {
	const upsertReservation = useClinicStore((s) => s.upsertReservation);
	const upsertPatient = useClinicStore((s) => s.upsertPatient);
	const [chartOpen, setChartOpen] = (0, import_react.useState)(false);
	const [editOpen, setEditOpen] = (0, import_react.useState)(false);
	const missingChart = !booking.patientId;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface px-3 py-3 sm:px-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "w-12 shrink-0 tabular-nums text-sm text-sage",
				children: formatTime(booking.time) ?? "—"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							booking.patientId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/patients/$id",
								params: { id: booking.patientId },
								className: "truncate font-medium hover:text-sage",
								children: [booking.name, booking.chartNo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 text-xs font-normal text-muted",
									children: booking.chartNo
								}) : null]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate font-medium",
								children: booking.name
							}),
							missingChart ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "신환 · 차트 없음" }) : null,
							booking.cancelled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								className: "bg-danger/10 text-danger",
								children: "예약 취소"
							}) : null
						]
					}),
					booking.treatments?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 truncate text-xs text-muted",
						children: booking.treatments.join(" · ")
					}) : booking.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 truncate text-xs text-muted",
						children: booking.note
					}) : null,
					booking.treatments?.length && booking.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 truncate text-xs text-muted",
						children: booking.note
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ml-auto flex flex-wrap justify-end gap-1.5",
				children: [
					missingChart && !booking.cancelled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "soft",
						onClick: () => setChartOpen(true),
						children: "차트 생성"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => setEditOpen(true),
						children: "수정"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						className: booking.cancelled ? "text-sage" : "text-danger hover:text-danger",
						onClick: () => onToggleCancel(booking),
						children: booking.cancelled ? "취소 해제" : "예약 취소"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PatientFormDialog, {
				open: chartOpen,
				onOpenChange: setChartOpen,
				initial: {
					name: booking.name,
					phone: booking.phone
				},
				onSave: (p) => {
					const created = upsertPatient(p);
					if (booking.source === "manual") upsertReservation({
						id: booking.id,
						date: booking.date,
						time: booking.time,
						name: created.name,
						phone: created.phone ?? booking.phone,
						patientId: created.id,
						treatments: booking.treatments,
						note: booking.note,
						cancelled: booking.cancelled
					});
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReservationFormDialog, {
				open: editOpen,
				onOpenChange: setEditOpen,
				initial: {
					id: booking.source === "manual" ? booking.id : void 0,
					date: booking.date,
					time: booking.time,
					name: booking.name,
					phone: booking.phone,
					patientId: booking.patientId,
					treatments: booking.treatments,
					note: booking.source === "nextVisit" && booking.note === "다음 내원" ? "" : booking.note,
					cancelled: booking.cancelled
				}
			})
		]
	});
}
function timeKey(t) {
	return t && t.length >= 4 ? t.slice(0, 5) : "99:99";
}
function sortBookings(rows) {
	return [...rows].sort((a, b) => {
		const c = timeKey(a.time).localeCompare(timeKey(b.time));
		if (c !== 0) return c;
		if (a.cancelled !== b.cancelled) return a.cancelled ? 1 : -1;
		return a.name.localeCompare(b.name, "ko");
	});
}
function visitsOnDate(visits, date) {
	return visits.filter((v) => v.date === date && v.source !== "cancel").sort((a, b) => timeKey(a.time).localeCompare(timeKey(b.time)));
}
function activeBookings(bookings) {
	return bookings.filter((b) => !b.cancelled);
}
/** Hide pending bookings once that patient has a real (non-cancel) visit. Keep cancelled visible. */
function pendingBookings(bookings, visits, date) {
	const arrived = new Set(visits.filter((v) => v.date === date && v.source !== "cancel").map((v) => v.patientId));
	return sortBookings(bookings.filter((b) => {
		if (b.cancelled) return true;
		if (b.patientId && arrived.has(b.patientId)) return false;
		return true;
	}));
}
function bookingsForDate(date, patients, visits, reservations) {
	const byId = new Map(patients.map((p) => [p.id, p]));
	const out = [];
	const reservedPatients = /* @__PURE__ */ new Set();
	for (const r of reservations.filter((x) => x.date === date)) {
		const p = r.patientId ? byId.get(r.patientId) : void 0;
		if (r.patientId) reservedPatients.add(r.patientId);
		out.push({
			key: `r-${r.id}`,
			id: r.id,
			date: r.date,
			time: r.time,
			name: p?.name ?? r.name,
			phone: r.phone ?? p?.phone,
			patientId: r.patientId,
			chartNo: p?.chartNo,
			treatments: r.treatments ?? [],
			note: r.note,
			source: "manual",
			cancelled: r.cancelled
		});
	}
	const cancelledNext = new Set(visits.filter((v) => v.date === date && v.source === "cancel").map((v) => v.patientId));
	for (const v of visits) {
		if (v.nextVisit !== date || v.source === "cancel") continue;
		if (reservedPatients.has(v.patientId)) continue;
		const p = byId.get(v.patientId);
		if (!p) continue;
		reservedPatients.add(v.patientId);
		out.push({
			key: `nv-${v.id}`,
			id: v.id,
			date,
			time: void 0,
			name: p.name,
			phone: p.phone,
			patientId: p.id,
			chartNo: p.chartNo,
			treatments: v.treatments,
			note: "다음 내원",
			source: "nextVisit",
			cancelled: cancelledNext.has(v.patientId)
		});
	}
	return sortBookings(out);
}
//#endregion
export { pendingBookings as a, bookingsForDate as i, ReservationFormDialog as n, visitsOnDate as o, activeBookings as r, BookingRow as t };
