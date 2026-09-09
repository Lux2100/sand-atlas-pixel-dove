import { parseSearchDate } from "./format";
import type { Patient, Visit } from "./types";

export type PatientHit = Patient & {
  visitDate?: string;
  hitLabel?: string;
  lastTreatments?: string[];
};

/** Natural compare for chart numbers like C-2024-0188 vs C-2024-3. */
export function compareChartNo(a: string, b: string): number {
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

function lastVisit(visits: Visit[], patientId: string): Visit | undefined {
  return visits
    .filter((v) => v.patientId === patientId && v.source !== "cancel")
    .sort((a, b) => b.date.localeCompare(a.date) || (b.time ?? "").localeCompare(a.time ?? ""))[0];
}

function decorate(p: Patient, visits: Visit[], extra?: Partial<PatientHit>): PatientHit {
  const last = lastVisit(visits, p.id);
  return {
    ...p,
    lastTreatments: last?.treatments,
    ...extra,
  };
}

function patientMatches(p: Patient, q: string): boolean {
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

export function searchByVisitDate(patients: Patient[], visits: Visit[], date: string): PatientHit[] {
  const byPatient = new Map<string, Visit[]>();
  for (const v of visits) {
    if (v.date !== date || v.source === "cancel") continue;
    const arr = byPatient.get(v.patientId) ?? [];
    arr.push(v);
    byPatient.set(v.patientId, arr);
  }
  return patients
    .filter((p) => byPatient.has(p.id))
    .sort((a, b) => compareChartNo(a.chartNo, b.chartNo))
    .map((p) => {
      const vs = (byPatient.get(p.id) ?? []).sort((a, b) => (a.time ?? "99:99").localeCompare(b.time ?? "99:99"));
      const label = vs
        .map((v) => [v.time?.slice(0, 5), v.treatments.join(" · ")].filter(Boolean).join(" "))
        .join(" / ");
      return decorate(p, visits, { visitDate: date, hitLabel: label || "내원" });
    });
}

/** Search by name / chart / phone / memo. Date-like queries (26.09.01) list that day's visits. */
export function searchPatients(patients: Patient[], visits: Visit[], q: string): PatientHit[] {
  const query = q.trim();
  if (!query) {
    return [...patients].sort((a, b) => compareChartNo(a.chartNo, b.chartNo)).map((p) => decorate(p, visits));
  }
  const date = parseSearchDate(query);
  if (date) return searchByVisitDate(patients, visits, date);
  return patients
    .filter((p) => patientMatches(p, query))
    .sort((a, b) => compareChartNo(a.chartNo, b.chartNo))
    .map((p) => decorate(p, visits));
}
