import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BookingRow } from "@/components/booking-row";
import { PatientFormDialog } from "@/components/patient-form-dialog";
import { ReservationFormDialog } from "@/components/reservation-form-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { dayOffset, formatDate, formatTime, formatWon, todayISO } from "@/lib/format";
import { memoToPlain } from "@/lib/memo";
import { searchPatients } from "@/lib/patients";
import { bookingsForDate, visitsOnDate, activeBookings, pendingBookings, type DayBooking } from "@/lib/reservations";
import { homeRecommendedSets } from "@/lib/events";
import { monthSales, todaySales, useClinicStore } from "@/lib/store";
import type { Visit, VisitStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Home });

const VISIT_STATUSES: { id: VisitStatus; label: string; on: string; off: string }[] = [
  { id: "consult", label: "상담중", on: "bg-consult text-consult-fg", off: "border-consult/50 text-consult" },
  { id: "prep", label: "준비중", on: "bg-prep text-prep-fg", off: "border-prep/50 text-prep" },
  { id: "done", label: "시술 완료", on: "bg-done text-done-fg", off: "border-ink/25 text-ink" },
];

function Home() {
  const navigate = useNavigate();
  const patients = useClinicStore((s) => s.patients);
  const visits = useClinicStore((s) => s.visits);
  const reservations = useClinicStore((s) => s.reservations);
  const toggleBookingCancel = useClinicStore((s) => s.toggleBookingCancel);
  const upsertPatient = useClinicStore((s) => s.upsertPatient);
  const setVisitStatus = useClinicStore((s) => s.setVisitStatus);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [reserveOpen, setReserveOpen] = useState(false);
  const today = todayISO();
  const tomorrow = dayOffset(1);
  const todayRev = todaySales(visits, today);
  const monthRev = monthSales(visits, today);
  const todayBooks = useMemo(
    () => pendingBookings(bookingsForDate(today, patients, visits, reservations), visits, today),
    [today, patients, visits, reservations],
  );
  const tomorrowBooks = useMemo(
    () => bookingsForDate(tomorrow, patients, visits, reservations),
    [tomorrow, patients, visits, reservations],
  );
  const todayVisits = useMemo(
    () => [...visitsOnDate(visits, today)].sort((a, b) => (a.time ?? "99:99").localeCompare(b.time ?? "99:99")),
    [visits, today],
  );
  const hits = q.trim() ? searchPatients(patients, visits, q) : [];
  const todayBookCount = activeBookings(todayBooks).length;

  return (
    <div className="grid gap-8">
      <section className="grid gap-4 sm:flex sm:flex-wrap sm:items-end sm:justify-between">
        <div>
          <p className="text-xs tracking-wide text-muted">오늘</p>
          <h1 className="font-display text-4xl tracking-tight">{formatDate(today, "M월 d일 eeee")}</h1>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <Stat label="오늘 매출" value={formatWon(todayRev)} />
          <Stat label="이번달 매출" value={formatWon(monthRev)} />
        </div>
      </section>

      <section className="grid gap-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="이름, 차트번호, 날짜(26.09.01)"
            className="sm:flex-1"
          />
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 sm:flex-none" onClick={() => navigate({ to: "/analyze", search: {} })}>
              AI상담
            </Button>
            <Button className="flex-1 sm:flex-none" onClick={() => setOpen(true)}>
              새 차트
            </Button>
          </div>
        </div>
        {q.trim() ? (
          hits.length === 0 ? (
            <Empty>검색 결과가 없습니다.</Empty>
          ) : (
            <ul className="grid gap-2">
              {hits.map((p) => (
                <PatientRow key={p.id} id={p.id} name={p.name} chartNo={p.chartNo} extra={p.hitLabel} />
              ))}
            </ul>
          )
        ) : null}
        <div className="grid grid-cols-3 gap-2">
          <Stat label="총 등록손님" value={`${patients.length}명`} />
          <Stat label="오늘 내원" value={`${todayVisits.length}명`} />
          <Stat label="내일 예약" value={`${activeBookings(tomorrowBooks).length}명`} />
        </div>
      </section>

      <section className="grid gap-3">
        <HeaderRow
          title="오늘 예약"
          count={todayBookCount}
          action="예약추가"
          onAction={() => setReserveOpen(true)}
        />
        {todayBooks.length === 0 ? (
          <Empty>오늘 잡힌 예약이 없습니다.</Empty>
        ) : (
          <BookingSplitList bookings={todayBooks} onToggleCancel={toggleBookingCancel} />
        )}
      </section>

      <section className="grid gap-3">
        <HeaderRow title="오늘 내원" />
        {todayVisits.length === 0 ? (
          <Empty>오늘 기록된 내원이 없습니다.</Empty>
        ) : (
          <ul className="grid gap-2">
            {todayVisits.map((v) => {
              const p = patients.find((x) => x.id === v.patientId);
              return (
                <TodayVisitRow
                  key={v.id}
                  visit={v}
                  name={p?.name ?? "삭제된 차트"}
                  chartNo={p?.chartNo}
                  chartMemo={p?.memo}
                  onOpen={() => p && navigate({ to: "/patients/$id", params: { id: p.id } })}
                  onStatus={(status) => setVisitStatus(v.id, status)}
                />
              );
            })}
          </ul>
        )}
      </section>

      <section className="grid gap-3">
        <HeaderRow title="지금 추천 세트" action="전체" onAction={() => navigate({ to: "/events" })} />
        <ul className="grid gap-2 sm:grid-cols-2">
          {homeRecommendedSets().map((s) => (
            <li key={s.id}>
              <button
                type="button"
                className="flex h-full w-full flex-col rounded-lg border border-border bg-surface px-4 py-3 text-left hover:border-sage/40"
                onClick={() => navigate({ to: "/events", search: { set: s.id } })}
              >
                <p className="text-sm font-medium">{s.name}</p>
                <p className="mt-1 text-xs text-muted">{s.period ?? s.sessions}</p>
                <p className="mt-2 text-xs text-sage">{s.treatments.join(" · ")}</p>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <PatientFormDialog
        open={open}
        onOpenChange={setOpen}
        onSave={(p) => {
          const created = upsertPatient(p);
          navigate({ to: "/patients/$id", params: { id: created.id } });
        }}
      />
      <ReservationFormDialog open={reserveOpen} onOpenChange={setReserveOpen} />
    </div>
  );
}

function BookingSplitList({
  bookings,
  onToggleCancel,
}: {
  bookings: DayBooking[];
  onToggleCancel: (b: DayBooking) => void;
}) {
  const am = bookings.filter((b) => Number((b.time ?? "00:00").slice(0, 2)) < 12);
  const pm = bookings.filter((b) => Number((b.time ?? "00:00").slice(0, 2)) >= 12);
  return (
    <ul className="grid gap-2">
      {am.map((b) => (
        <BookingRow key={b.key} booking={b} onToggleCancel={onToggleCancel} />
      ))}
      {am.length > 0 && pm.length > 0 ? (
        <li className="list-none py-2" aria-hidden>
          <div className="h-px bg-border" />
        </li>
      ) : null}
      {pm.map((b) => (
        <BookingRow key={b.key} booking={b} onToggleCancel={onToggleCancel} />
      ))}
    </ul>
  );
}

function TodayVisitRow({
  visit,
  name,
  chartNo,
  chartMemo,
  onOpen,
  onStatus,
}: {
  visit: Visit;
  name: string;
  chartNo?: string;
  chartMemo?: string;
  onOpen: () => void;
  onStatus: (status: VisitStatus) => void;
}) {
  const status = visit.status ?? "prep";
  const memo = memoToPlain(visit.memo);
  const chartText = memoToPlain(chartMemo);
  return (
    <li className="grid gap-2 rounded-lg border border-border bg-surface px-3 py-3 sm:px-4">
      <button type="button" className="min-w-0 text-left hover:text-sage" onClick={onOpen}>
        <span className="flex flex-wrap items-baseline gap-2">
          <span className="tabular-nums text-sm text-sage">{formatTime(visit.time) ?? "시간미정"}</span>
          <span className="font-medium">{name}</span>
          {chartNo ? <span className="text-xs text-muted">{chartNo}</span> : null}
        </span>
        {chartText ? <p className="mt-1 line-clamp-2 text-sm text-danger">{chartText}</p> : null}
        {memo ? <p className="mt-1 line-clamp-2 text-sm text-ink/80">{memo}</p> : null}
        {visit.treatments.length ? (
          <p className="mt-1 truncate text-xs text-muted">{visit.treatments.join(" · ")}</p>
        ) : null}
      </button>
      <div className="flex flex-wrap justify-end gap-1">
        {VISIT_STATUSES.map((s) => (
          <button
            key={s.id}
            type="button"
            className={cn(
              "h-8 shrink-0 rounded-md border px-2.5 text-xs font-medium whitespace-nowrap",
              status === s.id ? s.on : `bg-surface ${s.off}`,
            )}
            onClick={() => onStatus(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>
    </li>
  );
}

function PatientRow({ id, name, chartNo, extra }: { id: string; name: string; chartNo: string; extra?: string }) {
  const navigate = useNavigate();
  return (
    <li>
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 text-left hover:border-sage/40"
        onClick={() => navigate({ to: "/patients/$id", params: { id } })}
      >
        <span>
          <span className="font-medium">{name}</span>
          {chartNo ? <span className="ml-2 text-xs text-muted">{chartNo}</span> : null}
        </span>
        {extra ? <span className="text-xs text-sage">{extra}</span> : null}
      </button>
    </li>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface px-2.5 py-3 sm:px-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="font-medium tabular-nums">{value}</p>
    </div>
  );
}

function HeaderRow({
  title,
  count,
  action,
  onAction,
}: {
  title: string;
  count?: number;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-sm font-medium">
        {title}
        {count != null ? <span className="ml-1.5 tabular-nums text-sage">{count}</span> : null}
      </h2>
      {action ? (
        <button type="button" className="text-xs text-sage" onClick={onAction}>
          {action}
        </button>
      ) : null}
    </div>
  );
}

function Empty({ children }: { children: string }) {
  return <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted">{children}</p>;
}
