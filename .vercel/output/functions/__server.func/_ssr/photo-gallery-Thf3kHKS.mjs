import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as todayISO, c as useClinicStore, l as cn, u as uid, x as formatDate } from "./router-_a-57kHo.mjs";
import { t as compressImage } from "./photo-ChnCRbNQ.mjs";
import { t as Button } from "./button-C0I3zfCw.mjs";
import { t as Input } from "./input-D3MQl9vA.mjs";
import { n as DialogContent, t as Dialog } from "./dialog-DbnL0gwX.mjs";
import { t as Label } from "./label-3oz5v3ue.mjs";
import { t as Badge } from "./badge-DeAixo-a.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/photo-gallery-Thf3kHKS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KIND_LABEL = {
	before: "시술 전",
	after: "시술 후",
	other: "기타"
};
var KIND_ORDER = {
	before: 0,
	after: 1,
	other: 2
};
function SafeImg({ src, alt, className }) {
	const [failed, setFailed] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setFailed(false);
	}, [src]);
	if (!src || src.startsWith("blob:") || failed) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex items-center justify-center bg-surface-2 px-3 text-center text-xs text-muted", className),
		children: "사진을 불러올 수 없습니다"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src,
		alt,
		className,
		onError: () => setFailed(true)
	});
}
function dateKey(iso) {
	const k = (iso ?? "").slice(0, 10);
	return /^\d{4}-\d{2}-\d{2}$/.test(k) ? k : "";
}
function formatPhotoDate(iso) {
	const k = dateKey(iso);
	return k ? formatDate(k, "M월 d일") : "날짜 없음";
}
function groupPhotos(photos) {
	const map = /* @__PURE__ */ new Map();
	for (const p of photos) {
		const k = dateKey(p.takenAt);
		const arr = map.get(k);
		if (arr) arr.push(p);
		else map.set(k, [p]);
	}
	for (const arr of map.values()) arr.sort((a, b) => KIND_ORDER[a.kind] - KIND_ORDER[b.kind] || a.id.localeCompare(b.id));
	return [...map.entries()].sort((a, b) => (b[0] || "0000").localeCompare(a[0] || "0000"));
}
function PhotoGallery({ patientId, patientName }) {
	const photosAll = useClinicStore((s) => s.photos);
	const showcasesAll = useClinicStore((s) => s.showcases);
	const photos = (0, import_react.useMemo)(() => photosAll.filter((p) => p.patientId === patientId), [photosAll, patientId]);
	const showcases = (0, import_react.useMemo)(() => showcasesAll.filter((s) => s.patientId === patientId), [showcasesAll, patientId]);
	const addPhoto = useClinicStore((s) => s.addPhoto);
	const updatePhoto = useClinicStore((s) => s.updatePhoto);
	const removePhoto = useClinicStore((s) => s.removePhoto);
	const addShowcase = useClinicStore((s) => s.addShowcase);
	const removeShowcase = useClinicStore((s) => s.removeShowcase);
	const fileRef = (0, import_react.useRef)(null);
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [kind, setKind] = (0, import_react.useState)("before");
	const [takenAt, setTakenAt] = (0, import_react.useState)(todayISO());
	const [selected, setSelected] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [viewId, setViewId] = (0, import_react.useState)();
	const [compareOpen, setCompareOpen] = (0, import_react.useState)(false);
	const [pendingDelete, setPendingDelete] = (0, import_react.useState)();
	const uploadKind = filter === "all" ? kind : filter;
	const visible = (0, import_react.useMemo)(() => filter === "all" ? photos : photos.filter((p) => p.kind === filter), [photos, filter]);
	const grouped = (0, import_react.useMemo)(() => groupPhotos(visible), [visible]);
	const picked = (0, import_react.useMemo)(() => selected.map((id) => photos.find((p) => p.id === id)).filter((p) => Boolean(p)), [selected, photos]);
	const view = viewId ? photos.find((p) => p.id === viewId) ?? void 0 : void 0;
	const toggle = (id) => {
		setSelected((prev) => {
			if (prev.includes(id)) return prev.filter((x) => x !== id);
			if (prev.length >= 3) return [...prev.slice(1), id];
			return [...prev, id];
		});
	};
	const upload = async (files) => {
		setBusy(true);
		let failed = 0;
		const date = dateKey(takenAt) || todayISO();
		try {
			for (const file of files.slice(0, 8)) try {
				const url = await compressImage(file);
				addPhoto({
					patientId,
					kind: uploadKind,
					url,
					takenAt: date
				});
			} catch {
				failed += 1;
			}
			if (failed) toast.error("일부 사진을 읽지 못했습니다. JPG 또는 PNG로 올려 주세요.");
		} finally {
			setBusy(false);
		}
	};
	const pin = () => {
		if (picked.length < 2) return;
		const before = picked.find((p) => p.kind === "before") ?? picked[0];
		const after = picked.find((p) => p.kind === "after" && p.id !== before.id) ?? picked.find((p) => p.id !== before.id);
		if (!after) return;
		addShowcase({
			id: uid("s"),
			patientId,
			title: patientName ? `${patientName} 전후` : "전후",
			treatments: [],
			beforePhotoId: before.id,
			afterPhotoId: after.id
		});
		setSelected([]);
		setCompareOpen(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					["all", "전체"],
					["before", "시술 전"],
					["after", "시술 후"]
				].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: filter === id ? "default" : "outline",
					onClick: () => {
						setFilter(id);
						if (id !== "all") setKind(id);
					},
					children: label
				}, id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end gap-2",
				children: [
					filter === "all" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-1",
						children: ["before", "after"].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: kind === k ? "soft" : "ghost",
							onClick: () => setKind(k),
							children: KIND_LABEL[k]
						}, k))
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "photo-date",
							children: "촬영일"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "photo-date",
							type: "date",
							value: dateKey(takenAt) || todayISO(),
							onChange: (e) => setTakenAt(e.target.value),
							className: "h-10 w-40"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						disabled: busy,
						onClick: () => fileRef.current?.click(),
						children: busy ? "올리는 중…" : "사진 추가"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: fileRef,
						type: "file",
						accept: "image/*",
						multiple: true,
						className: "hidden",
						onChange: (e) => {
							const files = Array.from(e.target.files ?? []);
							e.target.value = "";
							if (files.length) upload(files);
						}
					}),
					picked.length >= 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: () => setCompareOpen(true),
							children: [picked.length, "장 비교 보기"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "soft",
							onClick: pin,
							children: "전후 고정"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => setSelected([]),
							children: "선택 해제"
						})
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "pb-1 text-xs text-muted",
						children: "최대 3장까지 선택해 크게 비교할 수 있습니다."
					})
				]
			}),
			visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted",
				children: filter === "before" ? "시술 전 사진이 없습니다." : filter === "after" ? "시술 후 사진이 없습니다." : "아직 사진이 없습니다."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-6",
				children: grouped.map(([day, rows]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "grid gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-medium text-ink",
						children: formatPhotoDate(day)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid grid-cols-2 gap-3 sm:grid-cols-3",
						children: rows.map((p) => {
							const on = selected.includes(p.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: `overflow-hidden rounded-lg border ${on ? "border-sage" : "border-border"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "block w-full",
									onClick: () => setViewId(p.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SafeImg, {
										src: p.url,
										alt: "",
										className: "aspect-square w-full object-cover"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-1 px-2 py-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											tone: p.kind === "other" ? "default" : "sage",
											children: KIND_LABEL[p.kind]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs tabular-nums text-muted",
											children: formatPhotoDate(p.takenAt)
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-end gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "text-xs text-sage",
											onClick: () => toggle(p.id),
											children: on ? "선택됨" : "선택"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "text-xs text-danger",
											onClick: () => setPendingDelete(p),
											children: "삭제"
										})]
									})]
								})]
							}, p.id);
						})
					})]
				}, day || "none"))
			}),
			showcases.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: "고정된 전후"
				}), showcases.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShowcaseCard, {
					showcase: s,
					photos,
					onRemove: () => removeShowcase(s.id)
				}, s.id))]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: Boolean(view),
				onOpenChange: (v) => !v && setViewId(void 0),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					title: view ? KIND_LABEL[view.kind] : "사진",
					className: "max-w-2xl",
					children: view ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SafeImg, {
								src: view.url,
								alt: "",
								className: "max-h-[70dvh] w-full rounded-lg object-contain"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "view-photo-date",
									children: "촬영일"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "view-photo-date",
									type: "date",
									value: dateKey(view.takenAt) || "",
									onChange: (e) => updatePhoto(view.id, { takenAt: e.target.value || view.takenAt }),
									className: "h-10 w-40"
								})]
							}),
							view.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: view.note
							}) : null
						]
					}) : null
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: compareOpen && picked.length >= 2,
				onOpenChange: (v) => {
					if (!v) setCompareOpen(false);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					title: `${picked.length}장 비교`,
					className: "w-full max-w-6xl",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `mt-4 grid gap-2 ${picked.length === 3 ? "grid-cols-3" : "grid-cols-2"}`,
						children: picked.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SafeImg, {
								src: p.url,
								alt: "",
								className: "max-h-[72dvh] w-full rounded-lg object-contain"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
								className: "mt-2 text-center text-xs text-muted",
								children: [
									KIND_LABEL[p.kind],
									" · ",
									formatPhotoDate(p.takenAt)
								]
							})]
						}, p.id))
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: Boolean(pendingDelete),
				onOpenChange: (v) => !v && setPendingDelete(void 0),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					title: "사진 삭제",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-muted",
							children: "이 사진을 삭제할까요? 삭제하면 되돌릴 수 없습니다."
						}),
						pendingDelete ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SafeImg, {
							src: pendingDelete.url,
							alt: "",
							className: "mt-4 max-h-40 w-full rounded-lg object-contain"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex justify-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								onClick: () => setPendingDelete(void 0),
								children: "닫기"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "danger",
								onClick: () => {
									if (!pendingDelete) return;
									const id = pendingDelete.id;
									removePhoto(id);
									setSelected((prev) => prev.filter((x) => x !== id));
									if (viewId === id) setViewId(void 0);
									setPendingDelete(void 0);
								},
								children: "삭제"
							})]
						})
					]
				})
			})
		]
	});
}
function ShowcaseStrip() {
	const showcases = useClinicStore((s) => s.showcases);
	const photos = useClinicStore((s) => s.photos);
	const patients = useClinicStore((s) => s.patients);
	if (showcases.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted",
		children: "차트에서 전후 사진을 고정하면 여기에 모입니다."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "grid gap-4 sm:grid-cols-2",
		children: showcases.map((s) => {
			const patient = patients.find((p) => p.id === s.patientId);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShowcaseCard, {
				showcase: s,
				photos,
				caption: patient ? `${patient.name} · ${patient.chartNo || "번호 없음"}` : s.title,
				href: s.patientId
			}) }, s.id);
		})
	});
}
function ShowcaseCard({ showcase, photos, caption, href, onRemove }) {
	const before = photos.find((p) => p.id === showcase.beforePhotoId);
	const after = photos.find((p) => p.id === showcase.afterPhotoId);
	const body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overflow-hidden rounded-xl border border-border bg-surface shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SafeImg, {
				src: before?.url,
				alt: "",
				className: "aspect-[4/5] w-full object-cover"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
				className: "px-2 py-1 text-center text-xs text-muted",
				children: "시술 전"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SafeImg, {
				src: after?.url,
				alt: "",
				className: "aspect-[4/5] w-full object-cover"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
				className: "px-2 py-1 text-center text-xs text-muted",
				children: "시술 후"
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-2 px-3 py-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-sm font-medium",
					children: caption ?? showcase.title
				}), showcase.treatments.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-xs text-sage",
					children: showcase.treatments.join(" · ")
				}) : null]
			}), onRemove ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "shrink-0 text-xs text-muted hover:text-danger",
				onClick: onRemove,
				children: "해제"
			}) : null]
		})]
	});
	if (href) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/patients/$id",
		params: { id: href },
		className: "block",
		children: body
	});
	return body;
}
//#endregion
export { ShowcaseStrip as n, PhotoGallery as t };
