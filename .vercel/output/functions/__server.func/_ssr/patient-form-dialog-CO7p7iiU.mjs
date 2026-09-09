import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { y as ageFromBirth } from "./router-_a-57kHo.mjs";
import { t as Button } from "./button-C0I3zfCw.mjs";
import { t as Input } from "./input-D3MQl9vA.mjs";
import { t as Textarea } from "./textarea-DrMx_Gum.mjs";
import { n as DialogContent, t as Dialog } from "./dialog-DbnL0gwX.mjs";
import { t as Label } from "./label-3oz5v3ue.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/patient-form-dialog-CO7p7iiU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function emptyAge(birth, age) {
	if (age != null && Number.isFinite(age)) return String(age);
	const suggested = ageFromBirth(birth);
	return suggested != null ? String(suggested) : "";
}
function PatientFormDialog({ open, onOpenChange, initial, onSave }) {
	const [chartNo, setChartNo] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [birth, setBirth] = (0, import_react.useState)("");
	const [age, setAge] = (0, import_react.useState)("");
	const [gender, setGender] = (0, import_react.useState)("");
	const [memo, setMemo] = (0, import_react.useState)("");
	const editing = Boolean(initial?.id);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setChartNo(initial?.chartNo ?? "");
		setName(initial?.name ?? "");
		setPhone(initial?.phone ?? "");
		setBirth(initial?.birth ?? "");
		setAge(emptyAge(initial?.birth, initial?.age));
		setGender(initial?.gender ?? "");
		setMemo(initial?.memo ?? "");
	}, [open, initial?.id]);
	const submit = () => {
		const trimmed = name.trim();
		if (!trimmed) return;
		const ageNum = age.trim() === "" ? void 0 : Number(age);
		onSave({
			id: initial?.id,
			createdAt: initial?.createdAt,
			chartNo: chartNo.trim(),
			name: trimmed,
			phone: phone.trim() || void 0,
			birth: birth || void 0,
			age: ageNum != null && Number.isFinite(ageNum) ? ageNum : void 0,
			gender: gender || void 0,
			memo: memo.trim() || void 0
		});
		onOpenChange(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			title: editing ? "차트 수정" : "새 차트",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-4 grid gap-3",
				onSubmit: (e) => {
					e.preventDefault();
					submit();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "차트번호",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: chartNo,
							onChange: (e) => setChartNo(e.target.value),
							placeholder: "직접 입력"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "이름",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: name,
							onChange: (e) => setName(e.target.value),
							placeholder: "이름",
							autoFocus: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "전화",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "tel",
							value: phone,
							onChange: (e) => setPhone(e.target.value),
							placeholder: "010-"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "생년월일",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: birth,
							onChange: (e) => {
								const next = e.target.value;
								setBirth(next);
								const suggested = ageFromBirth(next);
								if (suggested != null) setAge(String(suggested));
								else if (!next) setAge("");
							}
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "나이",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							inputMode: "numeric",
							min: 0,
							max: 120,
							value: age,
							onChange: (e) => setAge(e.target.value),
							placeholder: "자동 계산, 수정 가능"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "성별" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "sm",
								variant: gender === "F" ? "default" : "outline",
								onClick: () => setGender("F"),
								children: "여"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "sm",
								variant: gender === "M" ? "default" : "outline",
								onClick: () => setGender("M"),
								children: "남"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "메모",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: memo,
							onChange: (e) => setMemo(e.target.value),
							placeholder: "알러지, 주의사항"
						})
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
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
//#endregion
export { PatientFormDialog as t };
