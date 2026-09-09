import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BookingRow } from "@/components/booking-row";
import { ReservationFormDialog } from "@/components/reservation-form-dialog";
import { Button } from "@/components/ui/button";
import { dayOffset, formatDate, todayISO } from "@/lib/format";
import { bookingsForDate, pendingBookings, type DayBooking } from "@/lib/reservations";
import { useClinicStore } from "@/lib/store";

export const Route = createFileRoute("/reservations")({ component: ReservationsPage });

function ReservationsPage() {
  const patients = useClinicStore((s) => s.patients);
  const visits = useClinicStore((s) => s.visits);
  const reservations = useClinicStore((s) => s.reservations);
  const toggleBookingCancel = useClinicStore((s) => s.toggleBookingCancel);
  const [open, setOpen] = useState(false);
  const today = todayISO();
  const tomorrow = dayOffset(1);
  const todayList = useMemo(
    () => pendingBookings(bookingsForDate(today, patients, visits, reservations), visits, today),
    [today, patients, visits, reservations],
  );
  const tomorrowList = useMemo(
    () => bookingsForDate(tomorrow, patients, visits, reservations),
    [tomorrow, patients, visits, reservations],
  );

  return (
    <div className="grid gap-8">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs text-muted">예약관리</p>
          <h1 className="font-display text-4xl tracking-tight">오늘 · 내일</h1>
        </div>
        <Button onClick={() => setOpen(true)}>예약 추가</Button>
      </div>
      <Section title={`오늘 ${formatDate(today)}`} items={todayList} onToggle={toggleBookingCancel} />
      <Section title={`내일 ${formatDate(tomorrow)}`} items={tomorrowList} onToggle={toggleBookingCancel} />
      <ReservationFormDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

function Section({ title, items, onToggle }: { title: string; items: DayBooking[]; onToggle: (b: DayBooking) => void }) {
  return (
    <section className="grid gap-3">
      <h2 className="text-sm font-medium">{title}</h2>
      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted">예약이 없습니다.</p>
      ) : (
        <ul className="grid gap-2">
          {items.map((b) => (
            <BookingRow key={b.key} booking={b} onToggleCancel={onToggle} />
          ))}
        </ul>
      )}
    </section>
  );
}
