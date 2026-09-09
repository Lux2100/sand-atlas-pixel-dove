import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { C as formatWon, D as todayISO, S as formatTime, b as dayOffset, c as useClinicStore, l as cn, o as monthSales, s as todaySales, x as formatDate } from "./router-_a-57kHo.mjs";
import { t as searchPatients } from "./patients-DwMra-Ur.mjs";
import { t as Button } from "./button-C0I3zfCw.mjs";
import { t as Input } from "./input-D3MQl9vA.mjs";
import { t as PatientFormDialog } from "./patient-form-dialog-CO7p7iiU.mjs";
import { r as homeRecommendedSets } from "./events-CdIL4AGG.mjs";
import { i as memoToPlain } from "./visit-form-dialog-BB3HmfFm.mjs";
import { a as pendingBookings, i as bookingsForDate, o as visitsOnDate, r as activeBookings, t as BookingRow } from "./reservations-CSjxloph.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CmKwrqtF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var VISIT_STATUSES = [
	{
		id: "consult",
		label: "상담중",
		on: "bg-consult text-consult-fg",
		off: "border-consult/50 text-consult"
	},
	{
		id: "prep",
		label: "준비중",
		on: "bg-prep text-prep-fg",
		off: "border-prep/50 text-prep"
	},
	{
		id: "done",
		label: "시술 완료",
		on: "bg-done text-done-fg",
		off: "border-ink/25 text-ink"
	}
];
function Home() {
	const navigate = useNavigate();
	const patients = useClinicStore((s) => s.patients);
	const visits = useClinicStore((s) => s.visits);
	const reservations = useClinicStore((s) => s.reservations);
	const toggleBookingCancel = useClinicStore((s) => s.toggleBookingCancel);
	const upsertPatient = useClinicStore((s) => s.upsertPatient);
	const setVisitStatus = useClinicStore((s) => s.setVisitStatus);
	const [q, setQ] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const today = todayISO();
	const tomorrow = dayOffset(1);
	const todayRev = todaySales(visits, today);
	const monthRev = monthSales(visits, today);
	const todayBooks = (0, import_react.useMemo)(() => pendingBookings(bookingsForDate(today, patients, visits, reservations), visits, today), [
		today,
		patients,
		visits,
		reservations
	]);
	const tomorrowBooks = (0, import_react.useMemo)(() => bookingsForDate(tomorrow, patients, visits, reservations), [
		tomorrow,
		patients,
		visits,
		reservations
	]);
	const todayVisits = (0, import_react.useMemo)(() => [...visitsOnDate(visits, today)].sort((a, b) => (a.time ?? "99:99").localeCompare(b.time ?? "99:99")), [visits, today]);
	const hits = q.trim() ? searchPatients(patients, visits, q) : [];
	const todayBookCount = activeBookings(todayBooks).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 sm:flex sm:flex-wrap sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-wide text-muted",
					children: "오늘"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl tracking-tight",
					children: formatDate(today, "M월 d일 eeee")
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2 sm:flex",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "오늘 매출",
						value: formatWon(todayRev)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "이번달 매출",
						value: formatWon(monthRev)
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2 sm:flex-row sm:items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "이름, 차트번호, 날짜(26.09.01)",
							className: "sm:flex-1"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								className: "flex-1 sm:flex-none",
								onClick: () => navigate({
									to: "/analyze",
									search: {}
								}),
								children: "AI상담"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "flex-1 sm:flex-none",
								onClick: () => setOpen(true),
								children: "새 차트"
							})]
						})]
					}),
					q.trim() ? hits.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "검색 결과가 없습니다." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid gap-2",
						children: hits.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PatientRow, {
							id: p.id,
							name: p.name,
							chartNo: p.chartNo,
							extra: p.hitLabel
						}, p.id))
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-3 gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "총 등록손님",
								value: `${patients.length}명`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "오늘 내원",
								value: `${todayVisits.length}명`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "내일 예약",
								value: `${activeBookings(tomorrowBooks).length}명`
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeaderRow, {
					title: "오늘 예약",
					count: todayBookCount,
					action: "예약관리",
					onAction: () => navigate({ to: "/reservations" })
				}), todayBooks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "오늘 잡힌 예약이 없습니다." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookingSplitList, {
					bookings: todayBooks,
					onToggleCancel: toggleBookingCancel
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeaderRow, { title: "오늘 내원" }), todayVisits.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "오늘 기록된 내원이 없습니다." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid gap-2",
					children: todayVisits.map((v) => {
						const p = patients.find((x) => x.id === v.patientId);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TodayVisitRow, {
							visit: v,
							name: p?.name ?? "삭제된 차트",
							chartNo: p?.chartNo,
							onOpen: () => p && navigate({
								to: "/patients/$id",
								params: { id: p.id }
							}),
							onStatus: (status) => setVisitStatus(v.id, status)
						}, v.id);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeaderRow, {
					title: "지금 추천 세트",
					action: "전체",
					onAction: () => navigate({ to: "/events" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid gap-2 sm:grid-cols-2",
					children: homeRecommendedSets().map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex h-full w-full flex-col rounded-lg border border-border bg-surface px-4 py-3 text-left hover:border-sage/40",
						onClick: () => navigate({
							to: "/events",
							search: { set: s.id }
						}),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: s.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted",
								children: s.period ?? s.sessions
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-sage",
								children: s.treatments.join(" · ")
							})
						]
					}) }, s.id))
				})]
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
function BookingSplitList({ bookings, onToggleCancel }) {
	const am = bookings.filter((b) => Number((b.time ?? "00:00").slice(0, 2)) < 12);
	const pm = bookings.filter((b) => Number((b.time ?? "00:00").slice(0, 2)) >= 12);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
		className: "grid gap-2",
		children: [
			am.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookingRow, {
				booking: b,
				onToggleCancel
			}, b.key)),
			am.length > 0 && pm.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "list-none py-2",
				"aria-hidden": true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px bg-border" })
			}) : null,
			pm.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookingRow, {
				booking: b,
				onToggleCancel
			}, b.key))
		]
	});
}
function TodayVisitRow({ visit, name, chartNo, onOpen, onStatus }) {
	const status = visit.status ?? "prep";
	const memo = memoToPlain(visit.memo);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "grid gap-2 rounded-lg border border-border bg-surface px-3 py-3 sm:px-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "min-w-0 text-left hover:text-sage",
			onClick: onOpen,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex flex-wrap items-baseline gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums text-sm text-sage",
							children: formatTime(visit.time) ?? "시간미정"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: name
						}),
						chartNo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted",
							children: chartNo
						}) : null
					]
				}),
				memo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 line-clamp-2 text-sm text-ink/80",
					children: memo
				}) : null,
				visit.treatments.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 truncate text-xs text-muted",
					children: visit.treatments.join(" · ")
				}) : null
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap justify-end gap-1",
			children: VISIT_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: cn("h-8 shrink-0 rounded-md border px-2.5 text-xs font-medium whitespace-nowrap", status === s.id ? s.on : `bg-surface ${s.off}`),
				onClick: () => onStatus(s.id),
				children: s.label
			}, s.id))
		})]
	});
}
function PatientRow({ id, name, chartNo, extra }) {
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		className: "flex w-full items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 text-left hover:border-sage/40",
		onClick: () => navigate({
			to: "/patients/$id",
			params: { id }
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium",
			children: name
		}), chartNo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "ml-2 text-xs text-muted",
			children: chartNo
		}) : null] }), extra ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs text-sage",
			children: extra
		}) : null]
	}) });
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-surface px-2.5 py-3 sm:px-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-medium tabular-nums",
			children: value
		})]
	});
}
function HeaderRow({ title, count, action, onAction }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
			className: "text-sm font-medium",
			children: [title, count != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "ml-1.5 tabular-nums text-sage",
				children: count
			}) : null]
		}), action ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "text-xs text-sage",
			onClick: onAction,
			children: action
		}) : null]
	});
}
function Empty({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted",
		children
	});
}
//#endregion
export { Home as component };
