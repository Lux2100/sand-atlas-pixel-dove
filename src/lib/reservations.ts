import type { Patient, Reservation, Visit } from "./types";

export type DayBooking = {
  key: string;
  id: string;
  date: string;
  time?: string;
  name: string;
  phone?: string;
  patientId?: string;
  chartNo?: string;
  gender?: "F" | "M";
  chartMemo?: string;
  treatments: string[];
  note?: string;
  source: "manual" | "nextVisit";
  cancelled?: boolean;
};

function timeKey(t?: string) {
  return t && t.length >= 4 ? t.slice(0, 5) : "99:99";
}

function sortBookings(rows: DayBooking[]) {
  return [...rows].sort((a, b) => {
    const c = timeKey(a.time).localeCompare(timeKey(b.time));
    if (c !== 0) return c;
    if (a.cancelled !== b.cancelled) return a.cancelled ? 1 : -1;
    return a.name.localeCompare(b.name, "ko");
  });
}

export function visitsOnDate(visits: Visit[], date: string): Visit[] {
  return visits
    .filter((v) => v.date === date && v.source !== "cancel")
    .sort((a, b) => timeKey(a.time).localeCompare(timeKey(b.time)));
}

export function activeBookings(bookings: DayBooking[]): DayBooking[] {
  return bookings.filter((b) => !b.cancelled);
}

/** Hide pending bookings once that patient has a real (non-cancel) visit. Keep cancelled visible. */
export function pendingBookings(bookings: DayBooking[], visits: Visit[], date: string): DayBooking[] {
  const arrived = new Set(
    visits.filter((v) => v.date === date && v.source !== "cancel").map((v) => v.patientId),
  );
  return sortBookings(
    bookings.filter((b) => {
      if (b.cancelled) return true;
      if (b.patientId && arrived.has(b.patientId)) return false;
      return true;
    }),
  );
}

export function bookingsForDate(
  date: string,
  patients: Patient[],
  visits: Visit[],
  reservations: Reservation[],
): DayBooking[] {
  const byId = new Map(patients.map((p) => [p.id, p]));
  const out: DayBooking[] = [];
  const reservedPatients = new Set<string>();

  for (const r of reservations.filter((x) => x.date === date)) {
    const p = r.patientId ? byId.get(r.patientId) : undefined;
    if (r.patientId) reservedPatients.add(r.patientId);
    out.push({
      key: `r-${r.id}`,
      id: r.id,
      date: r.date,
      time: r.time,
      name: p?.name ?? r.name,
      phone: r.phone ?? p?.phone,
      patientId: r.patientId,
      chartNo: p?.chartNo || r.chartNo,
      gender: p?.gender ?? r.gender,
      chartMemo: p?.memo,
      treatments: r.treatments ?? [],
      note: r.note,
      source: "manual",
      cancelled: r.cancelled,
    });
  }

  const cancelledNext = new Set(
    visits
      .filter((v) => v.date === date && v.source === "cancel")
      .map((v) => v.patientId),
  );

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
      time: undefined,
      name: p.name,
      phone: p.phone,
      patientId: p.id,
      chartNo: p.chartNo,
      gender: p.gender,
      chartMemo: p.memo,
      treatments: v.treatments,
      note: "다음 내원",
      source: "nextVisit",
      cancelled: cancelledNext.has(v.patientId),
    });
  }

  return sortBookings(out);
}
