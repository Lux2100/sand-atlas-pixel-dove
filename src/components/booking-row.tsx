import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { formatTime } from "@/lib/format";
import type { DayBooking } from "@/lib/reservations";
import { useClinicStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PatientFormDialog } from "@/components/patient-form-dialog";
import { ReservationFormDialog } from "@/components/reservation-form-dialog";

type Props = {
  booking: DayBooking;
  onToggleCancel: (booking: DayBooking) => void;
};

export function BookingRow({ booking, onToggleCancel }: Props) {
  const upsertReservation = useClinicStore((s) => s.upsertReservation);
  const upsertPatient = useClinicStore((s) => s.upsertPatient);
  const [chartOpen, setChartOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const missingChart = !booking.patientId;

  return (
    <li className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface px-3 py-3 sm:px-4">
      <span className="w-12 shrink-0 tabular-nums text-sm text-sage">{formatTime(booking.time) ?? "—"}</span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {booking.patientId ? (
            <Link to="/patients/$id" params={{ id: booking.patientId }} className="truncate font-medium hover:text-sage">
              {booking.name}
              {booking.chartNo ? <span className="ml-2 text-xs font-normal text-muted">{booking.chartNo}</span> : null}
            </Link>
          ) : (
            <span className="truncate font-medium">{booking.name}</span>
          )}
          {missingChart ? <Badge>신환 · 차트 없음</Badge> : null}
          {booking.cancelled ? <Badge className="bg-danger/10 text-danger">예약 취소</Badge> : null}
        </div>
        {booking.treatments?.length ? (
          <p className="mt-0.5 truncate text-xs text-muted">{booking.treatments.join(" · ")}</p>
        ) : booking.note ? (
          <p className="mt-0.5 truncate text-xs text-muted">{booking.note}</p>
        ) : null}
        {booking.treatments?.length && booking.note ? (
          <p className="mt-0.5 truncate text-xs text-muted">{booking.note}</p>
        ) : null}
      </div>
      <div className="ml-auto flex flex-wrap justify-end gap-1.5">
        {missingChart && !booking.cancelled ? (
          <Button size="sm" variant="soft" onClick={() => setChartOpen(true)}>
            차트 생성
          </Button>
        ) : null}
        <Button size="sm" variant="outline" onClick={() => setEditOpen(true)}>
          수정
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className={booking.cancelled ? "text-sage" : "text-danger hover:text-danger"}
          onClick={() => onToggleCancel(booking)}
        >
          {booking.cancelled ? "취소 해제" : "예약 취소"}
        </Button>
      </div>
      <PatientFormDialog
        open={chartOpen}
        onOpenChange={setChartOpen}
        initial={{ name: booking.name, phone: booking.phone }}
        onSave={(p) => {
          const created = upsertPatient(p);
          if (booking.source === "manual") {
            upsertReservation({
              id: booking.id,
              date: booking.date,
              time: booking.time,
              name: created.name,
              phone: created.phone ?? booking.phone,
              patientId: created.id,
              treatments: booking.treatments,
              note: booking.note,
              cancelled: booking.cancelled,
            });
          }
        }}
      />
      <ReservationFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        initial={{
          id: booking.source === "manual" ? booking.id : undefined,
          date: booking.date,
          time: booking.time,
          name: booking.name,
          phone: booking.phone,
          patientId: booking.patientId,
          treatments: booking.treatments,
          note: booking.source === "nextVisit" && booking.note === "다음 내원" ? "" : booking.note,
          cancelled: booking.cancelled,
        }}
      />
    </li>
  );
}
