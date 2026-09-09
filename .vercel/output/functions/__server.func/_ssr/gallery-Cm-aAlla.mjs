import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as ShowcaseStrip } from "./photo-gallery-Thf3kHKS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/gallery-Cm-aAlla.js
var import_jsx_runtime = require_jsx_runtime();
function GalleryPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: "전후 사진"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl tracking-tight",
				children: "사진 전후 기록"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "차트에서 고른 전후 사진이 여기에 모입니다."
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShowcaseStrip, {})]
	});
}
//#endregion
export { GalleryPage as component };
