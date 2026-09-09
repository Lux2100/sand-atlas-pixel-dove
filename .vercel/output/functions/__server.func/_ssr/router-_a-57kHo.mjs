import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as createRootRoute, b as useRouter, d as useRouterState, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as Layers, c as ClipboardList, i as ScanFace, l as CalendarDays, n as TriangleAlert, o as Images, r as Sparkles, s as House } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
import { n as parseISO, r as format, t as ko } from "../_libs/date-fns.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-_a-57kHo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function toISODate(d) {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function todayISO() {
	return toISODate(/* @__PURE__ */ new Date());
}
function dayOffset(n) {
	const d = /* @__PURE__ */ new Date();
	d.setDate(d.getDate() + n);
	return toISODate(d);
}
function formatDate(iso, pattern = "M월 d일 (EEE)") {
	try {
		return format(parseISO(iso), pattern, { locale: ko });
	} catch {
		return iso;
	}
}
function formatWon(n) {
	return `${new Intl.NumberFormat("ko-KR").format(Math.round(n))}원`;
}
var VISIT_MINUTES = [
	"00",
	"15",
	"30"
];
function snapVisitTime(t) {
	const now = /* @__PURE__ */ new Date();
	const raw = (t ?? "").trim();
	let h = raw.length >= 2 ? Number(raw.slice(0, 2)) : now.getHours();
	let m = raw.length >= 4 ? Number(raw.slice(3, 5)) : now.getMinutes();
	if (!Number.isFinite(h)) h = now.getHours();
	if (!Number.isFinite(m)) m = now.getMinutes();
	h = Math.min(23, Math.max(0, Math.round(h)));
	let snapped;
	if (m < 8) snapped = "00";
	else if (m < 23) snapped = "15";
	else if (m < 38) snapped = "30";
	else {
		snapped = "00";
		h = (h + 1) % 24;
	}
	return `${String(h).padStart(2, "0")}:${snapped}`;
}
function nowTime() {
	const d = /* @__PURE__ */ new Date();
	return snapVisitTime(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`);
}
function formatTime(t) {
	if (!t) return void 0;
	return t.slice(0, 5);
}
function ageFromBirth(birth) {
	if (!birth) return void 0;
	const b = parseISO(birth);
	if (Number.isNaN(b.getTime())) return void 0;
	const now = /* @__PURE__ */ new Date();
	let age = now.getFullYear() - b.getFullYear();
	const m = now.getMonth() - b.getMonth();
	if (m < 0 || m === 0 && now.getDate() < b.getDate()) age -= 1;
	return age;
}
/** Parse 26.09.01 / 2026-09-01 / 26-09-01 / 2026.9.1 into ISO. */
function parseSearchDate(q) {
	const m = q.trim().match(/^(\d{2,4})[.\-\/년\s]+(\d{1,2})[.\-\/월\s]+(\d{1,2})일?$/);
	if (!m) return void 0;
	let y = Number(m[1]);
	if (y < 100) y += 2e3;
	const mo = String(Number(m[2])).padStart(2, "0");
	const d = String(Number(m[3])).padStart(2, "0");
	if (Number(mo) < 1 || Number(mo) > 12 || Number(d) < 1 || Number(d) > 31) return void 0;
	return `${y}-${mo}-${d}`;
}
var CATEGORY_LABEL = {
	injectable: "주사·필러",
	laser: "레이저",
	lifting: "리프팅",
	skin: "피부",
	surgery: "시술·수술"
};
var CATEGORY_ORDER = [
	"injectable",
	"laser",
	"lifting",
	"skin",
	"surgery"
];
function T(id, name, category, summary, concerns, extra) {
	return {
		id,
		name,
		category,
		summary,
		concerns,
		...extra
	};
}
var TREATMENTS = [
	T("ellavie", "엘라비에 필러", "injectable", "원내 대표 HA 필러. 볼륨·윤곽·팔자에 자연스러운 유지력.", [
		"볼륨",
		"팔자",
		"윤곽",
		"입술",
		"이마"
	], {
		house: true,
		aliases: [
			"엘라비에",
			"Ellavie",
			"ellavie"
		]
	}),
	T("restylane", "레스틸렌 필러", "injectable", "Galderma Restylane. NASHA 입자로 지지력과 움직임 균형.", [
		"볼륨",
		"팔자",
		"입술",
		"눈밑"
	], { aliases: ["레스틸렌", "Restylane"] }),
	T("juvederm", "쥬비덤", "injectable", "Allergan Juvederm Vycross. 부드러운 볼륨과 리프팅.", [
		"볼륨",
		"팔자",
		"입술",
		"볼"
	], { aliases: ["Juvederm", "주비덤"] }),
	T("neuramis", "뉴라미스", "injectable", "국내 Medytox HA 필러. 잔주름·입술·잔볼륨.", [
		"잔주름",
		"입술",
		"볼륨"
	], { aliases: ["Neuramis"] }),
	T("yvoire", "이브아르", "injectable", "LG 이브아르 HA. 윤곽·볼륨에 탄탄한 지지.", [
		"윤곽",
		"볼륨",
		"턱",
		"코"
	], { aliases: ["Yvoire", "이브아르 필러"] }),
	T("botulinum", "보툴리눔 톡신", "injectable", "주름·사각턱·승모근 등 근육 이완 일반명.", [
		"주름",
		"사각턱",
		"승모근",
		"잔주름"
	], { aliases: [
		"톡신",
		"보툴리눔",
		"botulinum"
	] }),
	T("contour-inj", "윤곽주사", "injectable", "지방분해·윤곽 라인 주사. 이중턱·볼살·턱선.", [
		"윤곽",
		"이중턱",
		"턱선",
		"볼살"
	], {
		house: true,
		aliases: ["페이스라인주사", "팻디스솔빙"]
	}),
	T("filorga", "필로르가", "injectable", "NCTF 폴리레바이탈라이징. 물광·결·광채.", [
		"보습",
		"광채",
		"결",
		"안티에이징"
	], {
		house: true,
		aliases: [
			"Filorga",
			"NCTF",
			"필로가"
		]
	}),
	T("juvelook", "쥬베룩", "injectable", "PDLLA+HA 스킨부스터. 모공·흉터·탄력 리모델링.", [
		"모공",
		"흉터",
		"탄력",
		"결"
	], {
		house: true,
		aliases: ["Juvelook", "쥬브룩"]
	}),
	T("rejuran", "리쥬란", "injectable", "PN 연어주사. 재생·장벽·흉터·민감 피부.", [
		"재생",
		"장벽",
		"흉터",
		"민감"
	], {
		house: true,
		aliases: [
			"Rejuran",
			"리주란",
			"연어주사"
		]
	}),
	T("pdrn", "PDRN", "injectable", "폴리데옥시리보뉴클레오티드 재생주사. 회복·진정.", [
		"재생",
		"진정",
		"홍조",
		"회복"
	], {
		house: true,
		aliases: [
			"피디알엔",
			"폴리뉴클레오티드",
			"PN"
		]
	}),
	T("ultracol", "울트라콜", "injectable", "PDO 콜라겐 부스터. 탄력·리프팅 유도.", [
		"탄력",
		"리프팅",
		"볼륨"
	], { aliases: ["Ultracol", "울트라콜주사"] }),
	T("sculptra", "스컬트라", "injectable", "PLLA 콜라겐 stimulator. 볼륨·탄력 장기 유지.", [
		"볼륨",
		"탄력",
		"함몰"
	], { aliases: ["Sculptra", "스컬프타"] }),
	T("cellrederm", "셀르디엠", "injectable", "세포 재생 부스터. 얇은 피부·눈가 회복.", [
		"재생",
		"눈가",
		"얇은피부"
	], { aliases: ["Cellrederm", "셀레드엠"] }),
	T("skin-glow", "물광", "injectable", "HA 물광주. 즉각 보습·광채.", [
		"보습",
		"광채",
		"건조"
	], { aliases: ["물광주", "워터글로우"] }),
	T("exosome", "엑소좀", "injectable", "엑소좀 재생. 염증 후·시술 후 회복, 결 개선.", [
		"재생",
		"진정",
		"결",
		"안티에이징"
	], { aliases: ["Exosome", "엑소좀주사"] }),
	T("rejuran-glow", "리쥬란물광", "injectable", "리쥬란 HB/물광 타입. 재생+보습 한 번에.", [
		"보습",
		"재생",
		"광채"
	], { aliases: ["리쥬란 HB", "Rejuran HB"] }),
	T("glow-botox", "물광보톡스", "injectable", "진피 내 미세 톡신. 모공·잔주름·피지·광채.", [
		"모공",
		"잔주름",
		"피지",
		"광채"
	], { aliases: [
		"스킨보톡스",
		"더마톡신",
		"물광보톡"
	] }),
	T("pigment-inj", "색소주사", "injectable", "국소 미백·색소 병변 주사.", [
		"색소",
		"기미",
		"잡티"
	], { aliases: ["미백주사(국소)"] }),
	T("inflam-inj", "염증주사", "injectable", "여드름·낭종 염증 진정 주사.", [
		"여드름",
		"염증",
		"낭종"
	], { aliases: ["여드름주사", "스테로이드주사"] }),
	T("baby-inj", "아기주사", "injectable", "동안·결 개선 연광 칵테일.", [
		"동안",
		"광채",
		"결"
	], { aliases: ["베이비주사", "소녀주사"] }),
	T("panda-inj", "팬더주사", "injectable", "눈밑 다크서클·얇은 피부 특화 주사.", [
		"다크서클",
		"눈밑",
		"팬더"
	], { aliases: ["팬더아이", "눈밑주사"] }),
	T("mermaid-inj", "인어주사", "injectable", "광채·톤업 특화 칵테일 주사.", [
		"광채",
		"미백",
		"톤업"
	], { aliases: ["머메이드주사"] }),
	T("skinbooster", "스킨부스터", "injectable", "진피 보습·재생 부스터 통칭.", [
		"보습",
		"결",
		"광채"
	], { aliases: ["Skinbooster"] }),
	T("scar-inj", "흉터주사", "injectable", "함몰·비대 흉터 내 약물 주사.", [
		"흉터",
		"함몰",
		"여드름흉터"
	], { aliases: ["켈로이드주사"] }),
	T("glutathione", "글루타치온", "injectable", "전신 미백·항산화 주사.", [
		"미백",
		"톤업",
		"피로"
	], { aliases: ["글루타치온주사", "Glutathione"] }),
	T("vitc-inj", "비타민C주사", "injectable", "항산화·피로회복·톤 케어.", [
		"피로",
		"항산화",
		"광채"
	], { aliases: ["비타민주사", "비타민C"] }),
	T("tranexamic", "트라넥삼산", "injectable", "기미·홍조 경로 억제 주사/메조.", [
		"기미",
		"색소",
		"홍조"
	], { aliases: ["트라넥사믹", "TXA"] }),
	T("growth-inj", "성장인자주사", "injectable", "EGF/FGF 등 성장인자 재생.", [
		"재생",
		"흉터",
		"탄력"
	], { aliases: ["EGF", "성장인자"] }),
	T("collagen-inj", "콜라겐주사", "injectable", "콜라겐 보충·유도 주사.", [
		"탄력",
		"잔주름",
		"볼륨"
	], { aliases: ["콜라겐부스터"] }),
	T("cinderella-inj", "신데렐라주사", "injectable", "글루타치온 기반 미백·피로 주사.", [
		"미백",
		"피로",
		"톤업"
	], { aliases: ["신데렐라", "백옥주사"] }),
	T("chanel-inj", "샤넬주사", "injectable", "PN+HA+비타민 광채 칵테일. 결·윤기·보습을 한 번에.", [
		"광채",
		"보습",
		"결",
		"동안"
	], { aliases: [
		"샤넬",
		"Chanel injection",
		"샤넬 인젝션"
	] }),
	T("restylane-sb", "레스틸렌 물광", "injectable", "Restylane Skinbooster. 진피 내 HA로 지속 보습·광채.", [
		"보습",
		"광채",
		"잔주름",
		"결"
	], { aliases: [
		"Restylane Skinbooster",
		"레스틸렌 스킨부스터",
		"레스틸렌물광"
	] }),
	T("haiti", "하이티", "injectable", "Imeik 嗨体. 눈밑 다크서클·목주름·잔주름용 표층 HA. 볼륨보다 결·주름 라인.", [
		"눈밑",
		"목주름",
		"잔주름",
		"다크서클"
	], { aliases: [
		"嗨体",
		"Haiti",
		"하이바디",
		"하이티주사",
		"하이티 필러"
	] }),
	T("botox", "보톡스", "injectable", "Allergan Botox. 주름·사각턱 기준 톡신.", [
		"주름",
		"사각턱",
		"승모근"
	], { aliases: ["Botox", "알러간"] }),
	T("nabota", "나보타", "injectable", "대웅 나보타. 빠른 발현, 사각턱·주름.", ["주름", "사각턱"], { aliases: ["Nabota", "Jeuveau"] }),
	T("hutox", "휴톡스", "injectable", "휴온스 휴톡스.", ["주름", "사각턱"], { aliases: ["Hutox"] }),
	T("botulax", "보툴렉스", "injectable", "휴젤 보툴렉스. 사각턱·주름 널리 사용.", [
		"주름",
		"사각턱",
		"승모근"
	], { aliases: ["Botulax"] }),
	T("innotox", "내보톡", "injectable", "메디톡스 내보톡스(액상).", ["주름", "잔주름"], { aliases: ["Innotox", "내보톡스"] }),
	T("coretox", "코어톡스", "injectable", "메디톡스 코어톡스. 내성 고려 시.", ["주름", "사각턱"], { aliases: ["Coretox"] }),
	T("meditoxin", "메디톡신", "injectable", "메디톡스 메디톡신.", ["주름", "사각턱"], { aliases: ["Meditoxin", "뉴로녹스"] }),
	T("xeomin", "제오민", "injectable", "Merz Xeomin. 순수 톡신, 내성 부담 적음.", ["주름", "잔주름"], { aliases: ["Xeomin", "제오민톡신"] }),
	T("hengli", "헝리", "injectable", "중국 헝리(Lanzhou) 톡신.", ["주름", "사각턱"], { aliases: ["Hengli", "란저우"] }),
	T("lituo", "리투오", "laser", "원내 토닝·색소 레이저. 기미·잡티·톤 균일.", [
		"기미",
		"잡티",
		"톤",
		"색소"
	], {
		house: true,
		aliases: ["Lituo", "리투오레이저"]
	}),
	T("curejet", "큐어제트", "laser", "니들프리 제트 인젝터. 부스터를 균일 주입.", [
		"모공",
		"재생",
		"부스터",
		"흉터"
	], {
		house: true,
		aliases: [
			"CureJet",
			"큐어젯",
			"제트인젝터"
		]
	}),
	T("qlaser", "큐레이저", "laser", "Q-switched 토닝. 기미·잡티·문신·톤업.", [
		"기미",
		"잡티",
		"톤",
		"문신"
	], {
		house: true,
		aliases: [
			"Q레이저",
			"Q-switch",
			"큐스위치"
		]
	}),
	T("m22", "M22", "laser", "Lumenis M22 IPL. 홍조·색소·광노화.", [
		"홍조",
		"색소",
		"광노화",
		"혈관"
	], {
		house: true,
		aliases: ["IPL", "엠22"]
	}),
	T("fraxel", "프락셀", "laser", "분획 레이저. 모공·흉터·결·탄력.", [
		"모공",
		"흉터",
		"결",
		"탄력"
	], {
		house: true,
		aliases: ["Fraxel", "프락셔널"]
	}),
	T("erbium", "어븀야그", "laser", "Er:YAG 박피. 흉터·주름·각질.", [
		"흉터",
		"주름",
		"박피"
	], { aliases: [
		"Er:YAG",
		"어븀",
		"어븀야그레이저"
	] }),
	T("fotona", "포토나", "laser", "Fotona 멀티모드. 리프팅·홍조·타이트닝.", [
		"리프팅",
		"홍조",
		"탄력"
	], { aliases: ["Fotona", "포토나레이저"] }),
	T("vbeam", "브이빔", "laser", "Vbeam 혈관 레이저. 홍조·혈관·붉은 흉터.", [
		"홍조",
		"혈관",
		"붉은흉터"
	], { aliases: ["Vbeam", "브이빔퍼펙타"] }),
	T("potenza", "포텐자", "laser", "RF 마이크로니들. 모공·흉터·탄력.", [
		"모공",
		"흉터",
		"탄력"
	], { aliases: ["Potenza", "포텐자리프팅"] }),
	T("clarity", "클라리티", "laser", "Clarity 알렉산드라이트/야그. 제모·색소.", [
		"제모",
		"색소",
		"잡티"
	], { aliases: ["Clarity", "클라리티Ⅱ"] }),
	T("co2", "CO2", "laser", "CO2 프락셔널/절제. 깊은 흉터·종양·주름.", [
		"흉터",
		"점",
		"주름"
	], { aliases: ["CO2레이저", "탄산가스"] }),
	T("pico", "피코레이저", "laser", "피코초 레이저. 기미·톤·문신·모공.", [
		"기미",
		"톤",
		"문신",
		"모공"
	], { aliases: [
		"Pico",
		"피코토닝",
		"피코웨이",
		"피코슈어"
	] }),
	T("vro", "브이로", "lifting", "원내 HIFU. 근막·진피 리프팅, 이중턱.", [
		"리프팅",
		"처짐",
		"이중턱",
		"탄력"
	], {
		house: true,
		aliases: [
			"VRO",
			"V-RO",
			"브이알오"
		]
	}),
	T("ulthera", "울쎄라", "lifting", "Ultherapy 초음파. SMAS 리프팅 골드스탠다드.", [
		"리프팅",
		"처짐",
		"탄력",
		"턱선"
	], {
		house: true,
		aliases: [
			"Ulthera",
			"Ultherapy",
			"울세라"
		]
	}),
	T("thermage", "써마지", "lifting", "Thermage FLX 모노폴라 RF. 타이트닝·윤곽.", [
		"탄력",
		"타이트닝",
		"윤곽",
		"모공"
	], {
		house: true,
		aliases: [
			"Thermage",
			"써마지FLX",
			"써마지 FLX"
		]
	}),
	T("volnewmer", "볼뉴머", "lifting", "Volnewmer 모노폴라 RF. 볼륨 유지형 타이트닝.", [
		"탄력",
		"볼륨",
		"타이트닝"
	], { aliases: ["Volnewmer", "볼뉴머RF"] }),
	T("density", "덴서티", "lifting", "덴서티 RF. 진피 밀도·탄력.", [
		"탄력",
		"밀도",
		"처짐"
	], { aliases: ["Density", "덴시티"] }),
	T("onda", "온다", "lifting", "Onda Coolwaves. 지방·타이트닝.", [
		"이중턱",
		"지방",
		"타이트닝"
	], { aliases: ["Onda", "온다쿨웨이브"] }),
	T("shurink", "슈링크", "lifting", "슈링크 HIFU. 라인·처짐 일상 리프팅.", [
		"리프팅",
		"처짐",
		"턱선"
	], { aliases: ["Shurink", "슈링크유니버스"] }),
	T("dermapen", "더마펜", "skin", "자동 마이크로니들. 약물 침투·흉터·모공.", [
		"모공",
		"흉터",
		"침투"
	], { aliases: ["Dermapen", "더마스탬프"] }),
	T("mts", "MTS", "skin", "마이크로니들/더마롤러. 더마펜과 별도 수기·롤러 방식.", [
		"모공",
		"침투",
		"흉터",
		"결"
	], { aliases: [
		"마이크로니들",
		"더마롤러",
		"Microneedling"
	] }),
	T("tca-cross", "TCA크로스", "skin", "함몰 흉터에 TCA 점적. 핀홀과 병행.", [
		"흉터",
		"아이스픽",
		"함몰"
	], { aliases: ["TCA CROSS", "TCA"] }),
	T("facial-care", "피부관리", "skin", "클렌징·수분·진정·각질 기본 페이셜.", [
		"보습",
		"진정",
		"결",
		"관리"
	], { aliases: [
		"페이셜",
		"기본관리",
		"페이셜케어"
	] }),
	T("acne-care", "여드름관리", "skin", "압출·진정·재생·홈케어 코칭을 포함한 여드름 케어.", [
		"여드름",
		"피지",
		"염증",
		"모공"
	], { aliases: ["여드름케어", "아크네케어"] }),
	T("cosmelan", "코스멜란", "skin", "코스멜란 집중 미백 필. 기미·색소 집중.", [
		"기미",
		"색소",
		"미백"
	], { aliases: ["Cosmelan", "코스멜란필"] }),
	T("chemical-peel", "케미컬 필", "skin", "AHA/BHA/TCA 필. 각질·색소·결.", [
		"각질",
		"색소",
		"결",
		"여드름"
	], { aliases: [
		"케미컬필",
		"화학박피",
		"필링"
	] }),
	T("aquapeel", "아쿠아필", "skin", "아쿠아필 수분 박피. 모공·피지·즉각 광채.", [
		"모공",
		"피지",
		"광채"
	], { aliases: ["Aqua Peel", "아쿠아필링"] }),
	T("hydrafacial", "하이드라페이셜", "skin", "Hydrafacial 흡입+용액. 클렌징·보습·광채.", [
		"모공",
		"보습",
		"광채"
	], { aliases: ["Hydrafacial", "하이드라"] }),
	T("ldm", "LDM", "skin", "LDM 초음파. 장벽·진정·시술 후 회복.", [
		"진정",
		"장벽",
		"부종",
		"홍조"
	], { aliases: ["LDM초음파", "엘디엠"] }),
	T("vitamin-care", "비타민 관리", "skin", "비타민 이온/특수 관리. 톤·피로·광채.", [
		"광채",
		"톤",
		"피로"
	], { aliases: ["비타민주수", "비타민케어"] }),
	T("violet", "브이올렛", "skin", "V-iolet 여드름 광열. 피지선 억제.", [
		"여드름",
		"피지",
		"모공"
	], { aliases: [
		"V-iolet",
		"Violet",
		"브이올렛아크네"
	] }),
	T("subcision", "서브시전", "surgery", "섬유대 절단으로 함몰 흉터를 띄우는 시술.", [
		"흉터",
		"함몰",
		"여드름흉터"
	], { aliases: ["Subcision", "서브시젼"] }),
	T("pinhole", "핀홀법", "surgery", "핀홀 박피로 깊은 흉터·공함몰 개선.", [
		"흉터",
		"아이스픽",
		"모공"
	], { aliases: ["핀홀", "Pinhole"] })
];
var HOUSE_TREATMENTS = TREATMENTS.filter((t) => t.house);
var FOLD_RE = /[\s\-_/·•]+/g;
function fold(s) {
	return s.trim().toLowerCase().replace(FOLD_RE, "");
}
function getTreatment(id) {
	if (!id) return void 0;
	const key = id.trim();
	return TREATMENTS.find((t) => t.id === key) ?? TREATMENTS.find((t) => fold(t.id) === fold(key));
}
function getTreatmentByName(name) {
	const n = fold(name);
	if (!n) return void 0;
	const exact = TREATMENTS.find((t) => {
		if (fold(t.id) === n || fold(t.name) === n) return true;
		return t.aliases?.some((a) => fold(a) === n) ?? false;
	});
	if (exact) return exact;
	return TREATMENTS.find((t) => {
		if (fold(t.name).includes(n) || n.includes(fold(t.name))) return true;
		return t.aliases?.some((a) => fold(a).includes(n) || n.includes(fold(a))) ?? false;
	});
}
function matchesTreatment(t, q) {
	const n = fold(q);
	if (!n) return true;
	if (fold(t.id).includes(n) || fold(t.name).includes(n)) return true;
	if (t.aliases?.some((a) => fold(a).includes(n))) return true;
	if (t.concerns.some((c) => fold(c).includes(n))) return true;
	if (fold(t.summary).includes(n)) return true;
	if (fold(CATEGORY_LABEL[t.category]).includes(n)) return true;
	return false;
}
function sortHouseFirst(items, houseIds) {
	const house = new Set(houseIds ?? HOUSE_TREATMENTS.map((t) => t.id));
	const isHouse = (item) => {
		if (typeof item === "string") {
			const t = getTreatment(item) ?? getTreatmentByName(item);
			return t ? house.has(t.id) : false;
		}
		return house.has(item.id) || !!item.house;
	};
	return [...items].sort((a, b) => {
		const ha = isHouse(a) ? 0 : 1;
		const hb = isHouse(b) ? 0 : 1;
		if (ha !== hb) return ha - hb;
		const na = typeof a === "string" ? a : a.name;
		const nb = typeof b === "string" ? b : b.name;
		return na.localeCompare(nb, "ko");
	});
}
var DB_NAME = "aura-clinic-media";
var STORE = "images";
function openDb() {
	if (typeof indexedDB === "undefined") return Promise.resolve(null);
	return new Promise((resolve) => {
		try {
			const req = indexedDB.open(DB_NAME, 1);
			req.onupgradeneeded = () => {
				const db = req.result;
				if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
			};
			req.onsuccess = () => resolve(req.result);
			req.onerror = () => resolve(null);
		} catch {
			resolve(null);
		}
	});
}
async function mediaPut(key, dataUrl) {
	const db = await openDb();
	if (!db) return;
	await new Promise((resolve) => {
		try {
			const tx = db.transaction(STORE, "readwrite");
			tx.objectStore(STORE).put(dataUrl, key);
			tx.oncomplete = () => resolve();
			tx.onerror = () => resolve();
		} catch {
			resolve();
		}
	});
}
async function mediaGetAll() {
	const db = await openDb();
	if (!db) return {};
	return new Promise((resolve) => {
		const out = {};
		try {
			const req = db.transaction(STORE, "readonly").objectStore(STORE).openCursor();
			req.onsuccess = () => {
				const cursor = req.result;
				if (cursor) {
					if (typeof cursor.value === "string") out[String(cursor.key)] = cursor.value;
					cursor.continue();
				} else resolve(out);
			};
			req.onerror = () => resolve(out);
		} catch {
			resolve(out);
		}
	});
}
function slimUrl(id, url) {
	if (!url) return "";
	if (url.startsWith("data:")) return `idb:${id}`;
	if (url.startsWith("blob:")) return "";
	return url;
}
function restoreUrl(id, url, blobs) {
	if (url === "/gallery/sujin-before.jpg") url = "/gallery/sujin-before.svg";
	if (url?.startsWith("idb:")) return blobs[url.slice(4)] ?? blobs[id] ?? "";
	if (!url || url.startsWith("blob:")) return blobs[id] ?? "";
	if (url.startsWith("data:")) return blobs[id] ?? url;
	return url;
}
/** Move data-URL photos out of localStorage so the v6 key stays under quota. */
async function inflatePersisted(raw) {
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return raw;
	}
	const state = parsed.state;
	if (!state) return raw;
	const blobs = await mediaGetAll();
	if (Array.isArray(state.photos)) state.photos = state.photos.map((ph) => ({
		...ph,
		url: restoreUrl(ph.id, ph.url, blobs)
	}));
	if (Array.isArray(state.consults)) state.consults = state.consults.map((c) => ({
		...c,
		photoUrls: (c.photoUrls ?? []).map((url, i) => restoreUrl(`${c.id}:${i}`, url, blobs))
	}));
	return JSON.stringify(parsed);
}
async function mediaHas(key) {
	const blobs = await mediaGetAll();
	return Boolean(blobs[key]);
}
async function deflatePersisted(raw) {
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return raw;
	}
	const state = parsed.state;
	if (!state) return raw;
	if (Array.isArray(state.photos)) {
		const next = [];
		for (const ph of state.photos) if (ph.url?.startsWith("data:")) {
			await mediaPut(ph.id, ph.url);
			const ok = await mediaHas(ph.id);
			next.push({
				...ph,
				url: ok ? slimUrl(ph.id, ph.url) : ph.url
			});
		} else next.push({
			...ph,
			url: slimUrl(ph.id, ph.url)
		});
		state.photos = next;
	}
	if (Array.isArray(state.consults)) for (const c of state.consults) {
		const urls = c.photoUrls ?? [];
		const next = [];
		for (let i = 0; i < urls.length; i++) {
			const url = urls[i];
			const key = `${c.id}:${i}`;
			if (url?.startsWith("data:")) {
				await mediaPut(key, url);
				const ok = await mediaHas(key);
				next.push(ok ? slimUrl(key, url) : url);
			} else next.push(slimUrl(key, url));
		}
		c.photoUrls = next;
	}
	return JSON.stringify(parsed);
}
var clinicPersistStorage = {
	getItem: async (name) => {
		if (typeof localStorage === "undefined") return null;
		const raw = localStorage.getItem(name);
		if (!raw) return null;
		return inflatePersisted(raw);
	},
	setItem: async (name, value) => {
		if (typeof localStorage === "undefined") return;
		const slim = await deflatePersisted(value);
		try {
			localStorage.setItem(name, slim);
		} catch {}
	},
	removeItem: async (name) => {
		if (typeof localStorage === "undefined") return;
		localStorage.removeItem(name);
	}
};
function makeSeed() {
	const today = todayISO();
	const tomorrow = dayOffset(1);
	const weekAgo = dayOffset(-7);
	const twoWeeksAgo = dayOffset(-14);
	const monthAgo = dayOffset(-28);
	const sixWeeksAgo = dayOffset(-42);
	return {
		patients: [
			{
				id: "p-sujin",
				chartNo: "C-2024-0188",
				name: "배수진",
				phone: "010-5621-8840",
				birth: "1992-04-18",
				age: 34,
				gender: "F",
				memo: "★ 기미·모공. 원내 토닝 잘 받음. 차단 철저.",
				createdAt: "2024-03-12T09:10:00.000Z"
			},
			{
				id: "p-daeun",
				chartNo: "C-2025-0041",
				name: "윤다은",
				phone: "010-4412-3391",
				birth: "1998-11-02",
				age: 27,
				gender: "F",
				memo: "여드름 자국. 브이올렛 코스 중.",
				createdAt: "2025-01-20T11:00:00.000Z"
			},
			{
				id: "p-yujin",
				chartNo: "C-2025-0088",
				name: "최유진",
				phone: "010-3188-2290",
				birth: "1990-07-09",
				age: 36,
				gender: "F",
				memo: "웨딩 12월. 울쎄라+필러 계획.",
				createdAt: "2025-04-03T02:20:00.000Z"
			},
			{
				id: "p-junho",
				chartNo: "C-2024-0312",
				name: "이준호",
				phone: "010-7764-1022",
				birth: "1988-01-25",
				age: 38,
				gender: "M",
				memo: "사각턱·이중턱. 윤곽 3회차.",
				createdAt: "2024-08-16T07:40:00.000Z"
			},
			{
				id: "p-seoyeon",
				chartNo: "C-2025-0110",
				name: "한서연",
				phone: "010-8901-5566",
				birth: "1995-09-30",
				age: 30,
				gender: "F",
				memo: "홍조. 브이빔 유지. → 오늘 재내원.",
				createdAt: "2025-05-14T04:15:00.000Z"
			},
			{
				id: "p-minji",
				chartNo: "C-2025-0155",
				name: "김민지",
				phone: "010-2250-7788",
				birth: "2001-02-14",
				age: 25,
				gender: "F",
				memo: "물광·샤넬 관심. 내일 리터치.",
				createdAt: "2025-07-01T08:00:00.000Z"
			}
		],
		visits: [
			{
				id: "v-sujin-1",
				patientId: "p-sujin",
				date: sixWeeksAgo,
				time: "11:00",
				treatments: ["리쥬란", "피부관리"],
				memo: "장벽 재생 1회. 구진 안내.",
				paidAmount: 28e4,
				rechargeAmount: 1e6,
				redeemAmount: 28e4,
				nextVisit: monthAgo
			},
			{
				id: "v-sujin-2",
				patientId: "p-sujin",
				date: monthAgo,
				time: "14:15",
				treatments: ["프락셀", "엑소좀"],
				memo: "모공 프락셀. 다운타임 4일.",
				paidAmount: 45e4,
				redeemAmount: 2e5,
				nextVisit: twoWeeksAgo
			},
			{
				id: "v-sujin-3",
				patientId: "p-sujin",
				date: twoWeeksAgo,
				time: "10:30",
				treatments: ["큐레이저"],
				memo: "토닝 저출력. 기미 안정.",
				paidAmount: 12e4,
				nextVisit: today
			},
			{
				id: "v-sujin-today",
				patientId: "p-sujin",
				date: today,
				time: "10:20",
				treatments: ["큐레이저", "리투오"],
				memo: "★ 원내 토닝+리투오. 선크림 재교육.",
				paidAmount: 22e4,
				nextVisit: dayOffset(14)
			},
			{
				id: "v-daeun-1",
				patientId: "p-daeun",
				date: monthAgo,
				time: "16:00",
				treatments: ["여드름관리", "염증주사"],
				memo: "낭종 1점.",
				paidAmount: 8e4
			},
			{
				id: "v-daeun-2",
				patientId: "p-daeun",
				date: weekAgo,
				time: "15:15",
				treatments: ["브이올렛", "아쿠아필"],
				memo: "피지 감소 중.",
				paidAmount: 18e4,
				nextVisit: dayOffset(7)
			},
			{
				id: "v-yujin-1",
				patientId: "p-yujin",
				date: sixWeeksAgo,
				time: "13:00",
				treatments: ["울쎄라"],
				memo: "얼굴 600샷. 붓기 2일.",
				paidAmount: 18e5,
				rechargeAmount: 5e5
			},
			{
				id: "v-yujin-2",
				patientId: "p-yujin",
				date: twoWeeksAgo,
				time: "11:30",
				treatments: ["엘라비에 필러"],
				memo: "팔자 1cc, 볼 0.5cc.",
				paidAmount: 45e4,
				nextVisit: dayOffset(30)
			},
			{
				id: "v-junho-1",
				patientId: "p-junho",
				date: monthAgo,
				time: "18:00",
				treatments: ["보톡스"],
				memo: "사각턱 양측.",
				paidAmount: 12e4
			},
			{
				id: "v-junho-2",
				patientId: "p-junho",
				date: twoWeeksAgo,
				time: "13:30",
				treatments: ["윤곽주사"],
				memo: "이중턱 1회차.",
				paidAmount: 9e4,
				nextVisit: today
			},
			{
				id: "v-junho-today",
				patientId: "p-junho",
				date: today,
				time: "13:45",
				treatments: ["윤곽주사"],
				memo: "이중턱 2회차. 라인 개선.",
				paidAmount: 9e4,
				nextVisit: dayOffset(14)
			},
			{
				id: "v-seoyeon-1",
				patientId: "p-seoyeon",
				date: weekAgo,
				time: "09:30",
				treatments: ["브이빔", "LDM"],
				memo: "홍조 3회차. 자반 소량.",
				paidAmount: 25e4,
				nextVisit: today
			},
			{
				id: "v-minji-1",
				patientId: "p-minji",
				date: twoWeeksAgo,
				time: "17:00",
				treatments: ["샤넬주사", "피부관리"],
				memo: "광채 칵테일 1회. 만족.",
				paidAmount: 18e4,
				nextVisit: tomorrow
			},
			{
				id: "v-sujin-sep1",
				patientId: "p-sujin",
				date: "2026-09-01",
				time: "11:00",
				treatments: ["큐레이저", "MTS"],
				memo: "토닝 후 얕은 MTS.",
				paidAmount: 18e4
			},
			{
				id: "v-daeun-sep1",
				patientId: "p-daeun",
				date: "2026-09-01",
				time: "14:15",
				treatments: ["여드름관리", "피부관리"],
				memo: "압출 후 진정 관리.",
				paidAmount: 9e4
			},
			{
				id: "v-seoyeon-sep1",
				patientId: "p-seoyeon",
				date: "2026-09-01",
				time: "16:30",
				treatments: ["레스틸렌 물광"],
				memo: "볼 스킨부스터.",
				paidAmount: 25e4
			}
		],
		photos: [
			{
				id: "ph-sujin-b",
				patientId: "p-sujin",
				visitId: "v-sujin-2",
				kind: "before",
				url: "/gallery/sujin-before.svg",
				takenAt: monthAgo,
				note: "프락셀 전 정면"
			},
			{
				id: "ph-sujin-a",
				patientId: "p-sujin",
				visitId: "v-sujin-today",
				kind: "after",
				url: "/gallery/sujin-after.svg",
				takenAt: today,
				note: "토닝 후 6주"
			},
			{
				id: "ph-sujin-ob",
				patientId: "p-sujin",
				visitId: "v-sujin-1",
				kind: "other",
				url: "/gallery/sujin-oblique.svg",
				takenAt: sixWeeksAgo,
				note: "사위"
			},
			{
				id: "ph-yujin-b",
				patientId: "p-yujin",
				visitId: "v-yujin-1",
				kind: "before",
				url: "/gallery/yujin-before.svg",
				takenAt: sixWeeksAgo,
				note: "울쎄라 전"
			},
			{
				id: "ph-yujin-a",
				patientId: "p-yujin",
				visitId: "v-yujin-2",
				kind: "after",
				url: "/gallery/yujin-after.svg",
				takenAt: twoWeeksAgo,
				note: "리프팅+필러 후"
			},
			{
				id: "ph-daeun-b",
				patientId: "p-daeun",
				visitId: "v-daeun-1",
				kind: "before",
				url: "/gallery/daeun-before.svg",
				takenAt: monthAgo
			},
			{
				id: "ph-daeun-a",
				patientId: "p-daeun",
				visitId: "v-daeun-2",
				kind: "after",
				url: "/gallery/daeun-after.svg",
				takenAt: weekAgo
			}
		],
		showcases: [
			{
				id: "sc-sujin-pore",
				patientId: "p-sujin",
				title: "모공·기미 6주",
				treatments: [
					"프락셀",
					"큐레이저",
					"리투오"
				],
				beforePhotoId: "ph-sujin-b",
				afterPhotoId: "ph-sujin-a",
				note: "원내 레이저 위주. 차단 잘 지킨 케이스."
			},
			{
				id: "sc-yujin-lift",
				patientId: "p-yujin",
				title: "웨딩 리프팅",
				treatments: ["울쎄라", "엘라비에 필러"],
				beforePhotoId: "ph-yujin-b",
				afterPhotoId: "ph-yujin-a",
				note: "턱선·팔자. 본식 3개월 전 설계."
			},
			{
				id: "sc-daeun-acne",
				patientId: "p-daeun",
				title: "여드름 진정",
				treatments: ["여드름관리", "브이올렛"],
				beforePhotoId: "ph-daeun-b",
				afterPhotoId: "ph-daeun-a"
			}
		],
		reservations: [
			{
				id: "r-soyoung",
				date: today,
				time: "16:00",
				name: "박소영",
				phone: "010-6672-1010",
				treatments: ["상담"],
				note: "신규 상담. 차트 없음."
			},
			{
				id: "r-seoyeon",
				date: today,
				time: "11:15",
				name: "한서연",
				phone: "010-8901-5566",
				patientId: "p-seoyeon",
				treatments: ["브이빔"],
				note: "재내원. nextVisit 오늘."
			},
			{
				id: "r-minji",
				date: tomorrow,
				time: "14:00",
				name: "김민지",
				phone: "010-2250-7788",
				patientId: "p-minji",
				treatments: ["샤넬주사", "레스틸렌 물광"],
				note: "2회차 광채."
			}
		],
		consults: [{
			id: "c-sujin-1",
			patientId: "p-sujin",
			date: monthAgo,
			note: "모공·기미 주호소. 원내 레이저 우선.",
			photoUrls: ["/gallery/sujin-before.jpg"],
			analysis: {
				findings: [
					{
						area: "양볼",
						concern: "기미",
						detail: "표피형 기미, 광대 중심."
					},
					{
						area: "코·볼",
						concern: "모공",
						detail: "피지광, 모공 확장."
					},
					{
						area: "눈밑",
						concern: "다크서클",
						detail: "얇은 피부+그림자."
					}
				],
				recommendations: [
					{
						name: "큐레이저",
						reason: "원내 토닝으로 기미부터.",
						protocol: "1–2주 간격 5–10회 · 1064nm 저출력"
					},
					{
						name: "프락셀",
						reason: "모공·결.",
						protocol: "4–6주 3회 · 15–25mJ"
					},
					{
						name: "리쥬란",
						reason: "장벽·재생 병행.",
						protocol: "2–4주 3회"
					}
				],
				plan: [
					{
						order: 1,
						timing: "당일",
						title: "토닝 시작",
						treatments: ["큐레이저"],
						note: "테스트 스팟 후 풀페이스."
					},
					{
						order: 2,
						timing: "2주 후",
						title: "프락셀",
						treatments: ["프락셀", "엑소좀"],
						note: "다운타임 고지."
					},
					{
						order: 3,
						timing: "6주 후",
						title: "유지 토닝",
						treatments: ["리투오", "큐레이저"],
						note: "원내  Dual."
					}
				]
			}
		}],
		houseIds: HOUSE_TREATMENTS.map((t) => t.id)
	};
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid(prefix = "") {
	const id = Math.random().toString(36).slice(2, 8);
	return prefix ? `${prefix}${id}` : id;
}
var PERSIST_KEY = "aura-clinic-v6";
function paidOf(v) {
	return v.source === "cancel" ? 0 : v.paidAmount ?? 0;
}
function todaySales(visits, date = todayISO()) {
	return visits.filter((v) => v.date === date).reduce((sum, v) => sum + paidOf(v), 0);
}
function monthSales(visits, isoOrPrefix) {
	const prefix = (isoOrPrefix ?? todayISO()).slice(0, 7);
	return visits.filter((v) => v.date.startsWith(prefix)).reduce((sum, v) => sum + paidOf(v), 0);
}
function cardBalance(visits, patientId) {
	return visits.filter((v) => v.patientId === patientId && v.source !== "cancel").reduce((sum, v) => sum + (v.rechargeAmount ?? 0) - (v.redeemAmount ?? 0), 0);
}
var seed = makeSeed();
var useClinicStore = create()(persist((set, get) => ({
	...seed,
	upsertPatient: (input) => {
		const id = input.id ?? uid("p-");
		const existing = get().patients.find((p) => p.id === id);
		const birth = input.birth ?? existing?.birth;
		const age = input.age ?? existing?.age ?? ageFromBirth(birth);
		const next = {
			id,
			chartNo: input.chartNo !== void 0 ? input.chartNo.trim() : existing?.chartNo ?? "",
			name: input.name ?? existing?.name ?? "",
			phone: input.phone ?? existing?.phone,
			birth,
			age,
			gender: input.gender ?? existing?.gender,
			memo: input.memo ?? existing?.memo,
			createdAt: existing?.createdAt ?? input.createdAt ?? (/* @__PURE__ */ new Date()).toISOString()
		};
		set({ patients: existing ? get().patients.map((p) => p.id === id ? next : p) : [...get().patients, next] });
		return next;
	},
	removePatient: (id) => {
		set({
			patients: get().patients.filter((p) => p.id !== id),
			visits: get().visits.filter((v) => v.patientId !== id),
			photos: get().photos.filter((p) => p.patientId !== id),
			showcases: get().showcases.filter((s) => s.patientId !== id),
			consults: get().consults.filter((c) => c.patientId !== id),
			reservations: get().reservations.filter((r) => r.patientId !== id)
		});
	},
	upsertVisit: (input) => {
		const id = input.id ?? uid("v-");
		const existing = get().visits.find((v) => v.id === id);
		const time = input.time !== void 0 ? input.time ? snapVisitTime(input.time) : input.time : existing?.time;
		const next = {
			id,
			patientId: input.patientId,
			date: input.date,
			time,
			treatments: input.treatments,
			memo: input.memo ?? existing?.memo,
			nextVisit: input.nextVisit ?? existing?.nextVisit,
			paidAmount: input.paidAmount ?? existing?.paidAmount,
			rechargeAmount: input.rechargeAmount ?? existing?.rechargeAmount,
			redeemAmount: input.redeemAmount ?? existing?.redeemAmount,
			source: input.source ?? existing?.source,
			status: input.status ?? existing?.status
		};
		set({ visits: existing ? get().visits.map((v) => v.id === id ? next : v) : [...get().visits, next] });
		return next;
	},
	removeVisit: (id) => {
		set({
			visits: get().visits.filter((v) => v.id !== id),
			photos: get().photos.map((p) => p.visitId === id ? {
				...p,
				visitId: void 0
			} : p)
		});
	},
	addPhoto: (input) => {
		const photo = {
			...input,
			id: input.id ?? uid("ph-")
		};
		set({ photos: [...get().photos, photo] });
		return photo;
	},
	updatePhoto: (id, patch) => {
		set({ photos: get().photos.map((p) => p.id === id ? {
			...p,
			...patch
		} : p) });
	},
	removePhoto: (id) => {
		set({
			photos: get().photos.filter((p) => p.id !== id),
			showcases: get().showcases.filter((s) => s.beforePhotoId !== id && s.afterPhotoId !== id)
		});
	},
	addShowcase: (input) => {
		const row = {
			...input,
			id: input.id ?? uid("sc-")
		};
		set({ showcases: [...get().showcases, row] });
		return row;
	},
	removeShowcase: (id) => {
		set({ showcases: get().showcases.filter((s) => s.id !== id) });
	},
	upsertReservation: (input) => {
		const id = input.id ?? uid("r-");
		const existing = get().reservations.find((r) => r.id === id);
		const time = input.time !== void 0 ? input.time ? snapVisitTime(input.time) : input.time : existing?.time;
		const next = {
			id,
			date: input.date,
			time,
			name: input.name,
			phone: input.phone ?? existing?.phone,
			patientId: input.patientId ?? existing?.patientId,
			treatments: input.treatments ?? existing?.treatments,
			note: input.note !== void 0 ? input.note.trim() || void 0 : existing?.note,
			cancelled: input.cancelled ?? existing?.cancelled
		};
		set({ reservations: existing ? get().reservations.map((r) => r.id === id ? next : r) : [...get().reservations, next] });
		return next;
	},
	removeReservation: (id) => {
		set({ reservations: get().reservations.filter((r) => r.id !== id) });
	},
	toggleBookingCancel: (booking) => {
		if (booking.source === "manual") {
			const r = get().reservations.find((x) => x.id === booking.id);
			if (!r) return;
			const cancelled = !r.cancelled;
			set({ reservations: get().reservations.map((x) => x.id === booking.id ? {
				...x,
				cancelled
			} : x) });
			if (cancelled && r.patientId) {
				const visit = {
					id: uid("v-"),
					patientId: r.patientId,
					date: r.date,
					time: r.time,
					treatments: r.treatments ?? [],
					memo: "예약 취소",
					source: "cancel"
				};
				set({ visits: [...get().visits, visit] });
			}
			return;
		}
		if (!booking.patientId) return;
		if (booking.cancelled) {
			set({ visits: get().visits.filter((v) => !(v.source === "cancel" && v.patientId === booking.patientId && v.date === booking.date && v.memo === "예약 취소")) });
			return;
		}
		const visit = {
			id: uid("v-"),
			patientId: booking.patientId,
			date: booking.date,
			time: booking.time,
			treatments: booking.treatments ?? [],
			memo: "예약 취소",
			source: "cancel"
		};
		set({ visits: [...get().visits, visit] });
	},
	addConsult: (input) => {
		const row = {
			...input,
			id: input.id ?? uid("c-")
		};
		set({ consults: [...get().consults, row] });
		return row;
	},
	removeConsult: (id) => {
		set({ consults: get().consults.filter((c) => c.id !== id) });
	},
	toggleHouse: (treatmentId) => {
		const cur = get().houseIds;
		set({ houseIds: cur.includes(treatmentId) ? cur.filter((id) => id !== treatmentId) : [...cur, treatmentId] });
	},
	isHouse: (treatmentId) => get().houseIds.includes(treatmentId),
	setVisitStatus: (id, status) => {
		set({ visits: get().visits.map((v) => v.id === id ? {
			...v,
			status
		} : v) });
	}
}), {
	name: PERSIST_KEY,
	skipHydration: true,
	storage: createJSONStorage(() => clinicPersistStorage),
	partialize: (s) => ({
		patients: s.patients,
		visits: s.visits,
		photos: s.photos,
		showcases: s.showcases,
		reservations: s.reservations,
		consults: s.consults,
		houseIds: s.houseIds
	}),
	merge: (persisted, current) => {
		const p = persisted ?? {};
		return {
			...current,
			patients: p.patients ?? current.patients,
			visits: p.visits ?? current.visits,
			photos: p.photos ?? current.photos,
			showcases: p.showcases ?? current.showcases,
			reservations: p.reservations ?? current.reservations,
			consults: p.consults ?? current.consults,
			houseIds: p.houseIds?.length ? p.houseIds : current.houseIds
		};
	}
}));
function StoreHydrator() {
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		const had = typeof localStorage !== "undefined" ? localStorage.getItem(PERSIST_KEY) : null;
		Promise.resolve(useClinicStore.persist.rehydrate()).then(() => {
			if (cancelled) return;
			if (!had) try {
				useClinicStore.setState((s) => ({ patients: s.patients.slice() }));
			} catch {}
		});
		return () => {
			cancelled = true;
		};
	}, []);
	return null;
}
var NAV = [
	{
		to: "/",
		label: "홈",
		icon: House
	},
	{
		to: "/charts",
		label: "차트",
		icon: ClipboardList
	},
	{
		to: "/reservations",
		label: "예약",
		icon: CalendarDays
	},
	{
		to: "/treatments",
		label: "시술",
		icon: Sparkles
	},
	{
		to: "/events",
		label: "세트",
		icon: Layers
	},
	{
		to: "/gallery",
		label: "전후 사진",
		icon: Images
	},
	{
		to: "/analyze",
		label: "AI상담",
		icon: ScanFace
	}
];
function isActive(pathname, to) {
	if (to === "/") return pathname === "/";
	if (to === "/charts") return pathname === "/charts" || pathname.startsWith("/patients");
	return pathname === to || pathname.startsWith(`${to}/`);
}
function AppShell({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh bg-bg text-ink",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "sticky top-0 flex h-dvh w-16 shrink-0 flex-col border-r border-border bg-surface md:w-52",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "flex flex-col items-center px-2 py-5 md:items-start md:px-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-2xl leading-none tracking-wide text-sage md:hidden",
						children: "A"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden font-display text-2xl leading-none tracking-wide text-sage md:block",
						children: "AURA"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 hidden text-[11px] text-muted md:block",
						children: "원내 차트"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex flex-1 flex-col gap-1 px-2 pb-4 md:px-3",
				children: NAV.map((item) => {
					const Icon = item.icon;
					const className = cn("flex h-11 items-center justify-center gap-2 rounded-md px-0 text-sm transition-colors md:justify-start md:px-3", isActive(pathname, item.to) ? "bg-sage-soft text-sage" : "text-muted hover:bg-surface-2 hover:text-ink");
					const inner = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 shrink-0" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden md:inline",
							children: item.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "sr-only md:hidden",
							children: item.label
						})
					] });
					if (item.to === "/analyze") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/analyze",
						search: {},
						className,
						children: inner
					}, item.to);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: item.to,
						className,
						children: inner
					}, item.to);
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto w-full max-w-5xl",
				children
			})
		})]
	});
}
var styles_default = "/assets/styles-D7wKUp7j.css";
var APP_NAME = "AURA 원내 차트";
var Route$8 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#3E5A4C"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=IBM+Plex+Sans+KR:wght@400;500;600&display=swap"
			}
		]
	}),
	component: Root
});
function Root() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "ko",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-bg text-ink",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreHydrator, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
						position: "top-right",
						richColors: false
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	});
}
var $$splitComponentImporter$7 = () => import("./routes-CmKwrqtF.mjs");
var Route$7 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./analyze-BbX1GrLR.mjs");
var Route$6 = createFileRoute("/analyze")({
	validateSearch: (search) => {
		const patientId = typeof search.patientId === "string" ? search.patientId : void 0;
		return patientId ? { patientId } : {};
	},
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./charts-DhP95x7P.mjs");
var Route$5 = createFileRoute("/charts")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./events-CPXCv4CV.mjs");
var Route$4 = createFileRoute("/events")({
	validateSearch: (s) => typeof s.set === "string" ? { set: s.set } : {},
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./gallery-Cm-aAlla.mjs");
var Route$3 = createFileRoute("/gallery")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./reservations-Dmz73AUi.mjs");
var Route$2 = createFileRoute("/reservations")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./treatments-CzgNDbdo.mjs");
var Route$1 = createFileRoute("/treatments")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./patients._id-CIrBJds-.mjs");
var Route = createFileRoute("/patients/$id")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var rootRouteChildren = {
	IndexRoute: Route$7.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$8
	}),
	AnalyzeRoute: Route$6.update({
		id: "/analyze",
		path: "/analyze",
		getParentRoute: () => Route$8
	}),
	ChartsRoute: Route$5.update({
		id: "/charts",
		path: "/charts",
		getParentRoute: () => Route$8
	}),
	EventsRoute: Route$4.update({
		id: "/events",
		path: "/events",
		getParentRoute: () => Route$8
	}),
	GalleryRoute: Route$3.update({
		id: "/gallery",
		path: "/gallery",
		getParentRoute: () => Route$8
	}),
	ReservationsRoute: Route$2.update({
		id: "/reservations",
		path: "/reservations",
		getParentRoute: () => Route$8
	}),
	TreatmentsRoute: Route$1.update({
		id: "/treatments",
		path: "/treatments",
		getParentRoute: () => Route$8
	}),
	PatientsIdRoute: Route.update({
		id: "/patients/$id",
		path: "/patients/$id",
		getParentRoute: () => Route$8
	})
};
var routeTree = Route$8._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { formatWon as C, todayISO as D, snapVisitTime as E, formatTime as S, parseSearchDate as T, sortHouseFirst as _, cardBalance as a, dayOffset as b, useClinicStore as c, CATEGORY_LABEL as d, CATEGORY_ORDER as f, matchesTreatment as g, getTreatmentByName as h, Route$6 as i, cn as l, getTreatment as m, Route as n, monthSales as o, TREATMENTS as p, Route$4 as r, todaySales as s, router_exports as t, uid as u, VISIT_MINUTES as v, nowTime as w, formatDate as x, ageFromBirth as y };
