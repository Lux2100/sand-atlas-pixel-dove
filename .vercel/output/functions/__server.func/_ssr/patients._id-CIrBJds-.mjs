import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { C as formatWon, S as formatTime, a as cardBalance, c as useClinicStore, n as Route, x as formatDate, y as ageFromBirth } from "./router-_a-57kHo.mjs";
import { t as Button } from "./button-C0I3zfCw.mjs";
import { n as DialogContent, t as Dialog } from "./dialog-DbnL0gwX.mjs";
import { t as PatientFormDialog } from "./patient-form-dialog-CO7p7iiU.mjs";
import { t as PhotoGallery } from "./photo-gallery-Thf3kHKS.mjs";
import { i as memoToPlain, r as VisitFormDialog } from "./visit-form-dialog-BB3HmfFm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/patients._id-CIrBJds-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PatientChart() {
	const { id } = Route.useParams();
	const navigate = useNavigate();
	const patients = useClinicStore((s) => s.patients);
	const visitsAll = useClinicStore((s) => s.visits);
	const consultsAll = useClinicStore((s) => s.consults);
	const upsertPatient = useClinicStore((s) => s.upsertPatient);
	const upsertVisit = useClinicStore((s) => s.upsertVisit);
	const removeVisit = useClinicStore((s) => s.removeVisit);
	const removeConsult = useClinicStore((s) => s.removeConsult);
	const removePatient = useClinicStore((s) => s.removePatient);
	const patient = patients.find((p) => p.id === id);
	const visits = (0, import_react.useMemo)(() => visitsAll.filter((v) => v.patientId === id).sort((a, b) => b.date.localeCompare(a.date)), [visitsAll, id]);
	const consults = (0, import_react.useMemo)(() => consultsAll.filter((c) => c.patientId === id).sort((a, b) => b.date.localeCompare(a.date)), [consultsAll, id]);
	const balance = cardBalance(visitsAll, id);
	const [tab, setTab] = (0, import_react.useState)("visits");
	const [edit, setEdit] = (0, import_react.useState)(false);
	const [visitForm, setVisitForm] = (0, import_react.useState)({ open: false });
	const [confirmDelete, setConfirmDelete] = (0, import_react.useState)(false);
	const [pendingVisit, setPendingVisit] = (0, import_react.useState)();
	if (!patient) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "차트를 찾을 수 없습니다."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "outline",
			onClick: () => navigate({ to: "/charts" }),
			children: "차트 목록"
		})]
	});
	const age = patient.age ?? ageFromBirth(patient.birth);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-xs text-muted",
						onClick: () => navigate({ to: "/charts" }),
						children: "← 차트 목록"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-4xl tracking-tight",
						children: patient.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted",
						children: [
							patient.chartNo || "번호 없음",
							age != null ? ` · ${age}세` : "",
							patient.gender ? ` · ${patient.gender === "F" ? "여" : "남"}` : "",
							patient.phone ? ` · ${patient.phone}` : ""
						]
					}),
					patient.memo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-xl text-sm text-ink/80",
						children: patient.memo
					}) : null
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-surface px-4 py-3 text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted",
							children: "회원카드 잔액"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-lg font-medium tabular-nums",
							children: formatWon(balance)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap justify-end gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => navigate({
									to: "/analyze",
									search: { patientId: patient.id }
								}),
								children: "AI상담"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => setEdit(true),
								children: "차트 수정"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								className: "text-danger hover:text-danger",
								onClick: () => setConfirmDelete(true),
								children: "차트 삭제"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: () => setVisitForm({ open: true }),
								children: "기록 추가"
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1 rounded-md bg-surface-2 p-1",
				children: [
					["visits", "기록"],
					["consults", `상담${consults.length ? ` ${consults.length}` : ""}`],
					["photos", "사진"],
					["ledger", "결제"]
				].map(([k, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `h-9 flex-1 rounded-sm text-sm ${tab === k ? "bg-surface text-ink shadow-sm" : "text-muted"}`,
					onClick: () => setTab(k),
					children: label
				}, k))
			}),
			tab === "visits" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "grid gap-3",
				children: visits.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "기록이 없습니다."
				}) : visits.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-xl border border-border bg-surface p-4 shadow-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm font-medium",
								children: [formatDate(v.date, "yyyy.MM.dd (EEE)"), v.time ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 tabular-nums text-sage",
									children: formatTime(v.time)
								}) : null]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-sage",
								children: v.source === "cancel" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-danger",
									children: "예약 취소"
								}) : v.treatments.join(" · ") || "시술 없음"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									onClick: () => setVisitForm({
										open: true,
										visit: v
									}),
									children: "수정"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									className: "text-danger hover:text-danger",
									onClick: () => setPendingVisit(v),
									children: "삭제"
								})]
							})]
						}),
						v.memo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "memo-body mt-3 text-sm leading-relaxed text-ink/90",
							dangerouslySetInnerHTML: { __html: v.memo }
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap gap-3 text-xs text-muted",
							children: [
								v.paidAmount ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["결제 ", formatWon(v.paidAmount)] }) : null,
								v.rechargeAmount ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["충전 ", formatWon(v.rechargeAmount)] }) : null,
								v.redeemAmount ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["차감 ", formatWon(v.redeemAmount)] }) : null,
								v.nextVisit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["다음 내원 ", formatDate(v.nextVisit, "M월 d일")] }) : null
							]
						})
					]
				}, v.id))
			}) : null,
			tab === "consults" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConsultList, {
				consults,
				onRemove: removeConsult
			}) : null,
			tab === "photos" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoGallery, {
				patientId: patient.id,
				patientName: patient.name
			}) : null,
			tab === "ledger" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ledger, { visits }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PatientFormDialog, {
				open: edit,
				onOpenChange: setEdit,
				initial: patient,
				onSave: upsertPatient
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VisitFormDialog, {
				open: visitForm.open,
				onOpenChange: (open) => {
					if (!open) setVisitForm({ open: false });
				},
				patientId: patient.id,
				initial: visitForm.visit,
				onSave: upsertVisit
			}, visitForm.visit?.id ?? "new"),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: confirmDelete,
				onOpenChange: setConfirmDelete,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					title: "차트 삭제",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm text-muted",
						children: [patient.name, " 차트를 삭제하면 기록·사진·상담이 함께 지워집니다."]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex justify-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => setConfirmDelete(false),
							children: "닫기"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "danger",
							onClick: () => {
								removePatient(patient.id);
								navigate({ to: "/charts" });
							},
							children: "삭제"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: Boolean(pendingVisit),
				onOpenChange: (v) => !v && setPendingVisit(void 0),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					title: "기록 삭제",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: pendingVisit ? `${formatDate(pendingVisit.date, "yyyy.MM.dd")}${pendingVisit.time ? ` ${formatTime(pendingVisit.time)}` : ""} 기록을 삭제할까요?` : "이 기록을 삭제할까요?"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex justify-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => setPendingVisit(void 0),
							children: "닫기"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "danger",
							onClick: () => {
								if (!pendingVisit) return;
								removeVisit(pendingVisit.id);
								setPendingVisit(void 0);
							},
							children: "삭제"
						})]
					})]
				})
			})
		]
	});
}
function ConsultList({ consults, onRemove }) {
	if (consults.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "저장된 AI 상담이 없습니다."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "grid gap-3",
		children: consults.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "rounded-xl border border-border bg-surface p-4 shadow-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-sage",
						children: "AI 상담"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: formatDate(c.date, "yyyy.MM.dd (EEE)")
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						onClick: () => onRemove(c.id),
						children: "삭제"
					})]
				}),
				c.analysis.recommendations.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-sage",
					children: c.analysis.recommendations.map((r) => r.name).join(" · ")
				}) : null,
				c.analysis.plan.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-3 grid gap-1.5 text-sm",
					children: c.analysis.plan.map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						step.order,
						". ",
						step.timing,
						" · ",
						step.title
					] }, step.order))
				}) : null
			]
		}, c.id))
	});
}
function Ledger({ visits }) {
	let running = 0;
	const rows = [...visits].sort((a, b) => a.date.localeCompare(b.date)).map((v) => {
		running += (v.rechargeAmount ?? 0) - (v.redeemAmount ?? 0);
		return {
			v,
			running
		};
	});
	const totalPaid = visits.reduce((s, v) => s + (v.paidAmount ?? 0), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overflow-x-auto rounded-xl border border-border bg-surface",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "px-3 py-2 text-xs text-muted",
			children: ["누적 결제 ", formatWon(totalPaid)]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full min-w-[640px] text-left text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "text-xs text-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 font-medium",
							children: "날짜"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 font-medium",
							children: "시술"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 font-medium",
							children: "결제"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-2 font-medium",
							children: "잔액"
						})
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: [...rows].reverse().map(({ v, running: bal }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-b border-border last:border-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2 tabular-nums",
						children: v.date
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2 text-muted",
						children: v.treatments.join(", ") || memoToPlain(v.memo ?? "")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2 tabular-nums",
						children: v.paidAmount ? formatWon(v.paidAmount) : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2 tabular-nums",
						children: formatWon(bal)
					})
				]
			}, v.id)) })]
		})]
	});
}
//#endregion
export { PatientChart as component };
