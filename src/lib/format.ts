import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";

export function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayISO() {
  return toISODate(new Date());
}

export function dayOffset(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toISODate(d);
}

export function formatDate(iso: string, pattern = "M월 d일 (EEE)") {
  try {
    return format(parseISO(iso), pattern, { locale: ko });
  } catch {
    return iso;
  }
}

export function formatWon(n: number) {
  return `${new Intl.NumberFormat("ko-KR").format(Math.round(n))}원`;
}

export const VISIT_MINUTES = ["00", "15", "30"] as const;

export function snapVisitTime(t?: string) {
  const now = new Date();
  const raw = (t ?? "").trim();
  let h = raw.length >= 2 ? Number(raw.slice(0, 2)) : now.getHours();
  let m = raw.length >= 4 ? Number(raw.slice(3, 5)) : now.getMinutes();
  if (!Number.isFinite(h)) h = now.getHours();
  if (!Number.isFinite(m)) m = now.getMinutes();
  h = Math.min(23, Math.max(0, Math.round(h)));
  let snapped: (typeof VISIT_MINUTES)[number];
  if (m < 8) snapped = "00";
  else if (m < 23) snapped = "15";
  else if (m < 38) snapped = "30";
  else {
    snapped = "00";
    h = (h + 1) % 24;
  }
  return `${String(h).padStart(2, "0")}:${snapped}`;
}

export function nowTime() {
  const d = new Date();
  return snapVisitTime(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`);
}

export function formatTime(t?: string) {
  if (!t) return undefined;
  return t.slice(0, 5);
}

export function ageFromBirth(birth?: string) {
  if (!birth) return undefined;
  const b = parseISO(birth);
  if (Number.isNaN(b.getTime())) return undefined;
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age -= 1;
  return age;
}

/** Parse 26.09.01 / 2026-09-01 / 26-09-01 / 2026.9.1 into ISO. */
export function parseSearchDate(q: string): string | undefined {
  const s = q.trim();
  const m = s.match(/^(\d{2,4})[.\-\/년\s]+(\d{1,2})[.\-\/월\s]+(\d{1,2})일?$/);
  if (!m) return undefined;
  let y = Number(m[1]);
  if (y < 100) y += 2000;
  const mo = String(Number(m[2])).padStart(2, "0");
  const d = String(Number(m[3])).padStart(2, "0");
  if (Number(mo) < 1 || Number(mo) > 12 || Number(d) < 1 || Number(d) > 31) return undefined;
  return `${y}-${mo}-${d}`;
}
