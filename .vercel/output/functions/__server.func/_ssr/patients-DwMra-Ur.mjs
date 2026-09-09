import { T as parseSearchDate } from "./router-_a-57kHo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/patients-DwMra-Ur.js
/** Natural compare for chart numbers like C-2024-0188 vs C-2024-3. */
function compareChartNo(a, b) {
	const pa = a.split(/(\d+)/);
	const pb = b.split(/(\d+)/);
	const len = Math.max(pa.length, pb.length);
	for (let i = 0; i < len; i++) {
		const xa = pa[i] ?? "";
		const xb = pb[i] ?? "";
		const aNum = /^\d+$/.test(xa);
		const bNum = /^\d+$/.test(xb);
		if (aNum && bNum) {
			const d = Number(xa) - Number(xb);
			if (d !== 0) return d;
			continue;
		}
		const c = xa.localeCompare(xb, "ko");
		if (c !== 0) return c;
	}
	return 0;
}
function lastVisit(visits, patientId) {
	return visits.filter((v) => v.patientId === patientId && v.source !== "cancel").sort((a, b) => b.date.localeCompare(a.date) || (b.time ?? "").localeCompare(a.time ?? ""))[0];
}
function decorate(p, visits, extra) {
	const last = lastVisit(visits, p.id);
	return {
		...p,
		lastTreatments: last?.treatments,
		...extra
	};
}
function patientMatches(p, q) {
	const n = q.trim().toLowerCase();
	if (!n) return true;
	if (p.name.toLowerCase().includes(n)) return true;
	if (p.chartNo.toLowerCase().includes(n)) return true;
	const digits = n.replace(/\D/g, "");
	if (digits.length >= 3 && p.phone?.replace(/\D/g, "").includes(digits)) return true;
	if (p.phone?.includes(q.trim())) return true;
	if (p.memo?.toLowerCase().includes(n)) return true;
	return false;
}
function searchByVisitDate(patients, visits, date) {
	const byPatient = /* @__PURE__ */ new Map();
	for (const v of visits) {
		if (v.date !== date || v.source === "cancel") continue;
		const arr = byPatient.get(v.patientId) ?? [];
		arr.push(v);
		byPatient.set(v.patientId, arr);
	}
	return patients.filter((p) => byPatient.has(p.id)).sort((a, b) => compareChartNo(a.chartNo, b.chartNo)).map((p) => {
		return decorate(p, visits, {
			visitDate: date,
			hitLabel: (byPatient.get(p.id) ?? []).sort((a, b) => (a.time ?? "99:99").localeCompare(b.time ?? "99:99")).map((v) => [v.time?.slice(0, 5), v.treatments.join(" · ")].filter(Boolean).join(" ")).join(" / ") || "내원"
		});
	});
}
/** Search by name / chart / phone / memo. Date-like queries (26.09.01) list that day's visits. */
function searchPatients(patients, visits, q) {
	const query = q.trim();
	if (!query) return [...patients].sort((a, b) => compareChartNo(a.chartNo, b.chartNo)).map((p) => decorate(p, visits));
	const date = parseSearchDate(query);
	if (date) return searchByVisitDate(patients, visits, date);
	return patients.filter((p) => patientMatches(p, query)).sort((a, b) => compareChartNo(a.chartNo, b.chartNo)).map((p) => decorate(p, visits));
}
//#endregion
export { searchPatients as t };
