import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { formatTime } from "@/lib/format";
import { treatmentLine } from "@/lib/procedures";
import { displayCopy, memoToPlain } from "@/lib/memo";
import type { DayBooking } from "@/lib/reservations";
import { useClinicStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PhoneNumber } from "@/components/phone-number";
import { PatientFormDialog } from "@/components/patient-form-dialog";
import { ReservationFormDialog } from "@/components/reservation-form-dialog";

type Props = {
  booking: DayBooking;
  onToggleCancel: (booking: DayBooking) => void;
};

export function BookingRow({ booking, onToggleCancel }: Props) {
  const upsertReservation = useClinicStore((s) => s.upsertReservation);
  const upsertPatient = useClinicStore((s) => s.upsertPatient);
  const arriveBooking = useClinicStore((s) => s.arriveBooking);
  const [chartOpen, setChartOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const missingChart = !booking.patientId;
  const chartMemo = memoToPlain(booking.chartMemo);
  const noteText = displayCopy(booking.note);

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
        {chartMemo ? <p className="mt-0.5 line-clamp-2 text-sm text-danger">{chartMemo}</p> : null}
        {booking.phone ? <PhoneNumber phone={booking.phone} className="mt-0.5" /> : null}
        {booking.treatments?.length ? (
          <p className="mt-0.5 truncate text-xs text-muted">{treatmentLine(booking.treatments)}</p>
        ) : noteText ? (
          <p className="mt-0.5 truncate text-xs text-muted">{noteText}</p>
        ) : null}
        {booking.treatments?.length && noteText ? (
          <p className="mt-0.5 truncate text-xs text-muted">{noteText}</p>
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
        {!booking.cancelled ? (
          <Button size="sm" variant="soft" onClick={() => arriveBooking(booking)}>
            내원
          </Button>
        ) : null}
        <Button
          size="sm"
          variant="ghost"
          className={booking.cancelled ? "text-sage" : "text-danger hover:text-danger"}
          onClick={() => {
            if (booking.cancelled) onToggleCancel(booking);
            else setConfirmCancel(true);
          }}
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
          chartNo: booking.chartNo,
          gender: booking.gender,
          treatments: booking.treatments,
          note: booking.source === "nextVisit" && booking.note === "다음 내원" ? "" : booking.note,
          cancelled: booking.cancelled,
        }}
      />
      <Dialog open={confirmCancel} onOpenChange={setConfirmCancel}>
        <DialogContent title="예약 취소">
          <p className="mt-3 text-sm text-muted">
            {booking.name}님 {formatTime(booking.time) ?? "시간 미정"} 예약을 취소할까요?
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setConfirmCancel(false)}>
              닫기
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                onToggleCancel(booking);
                setConfirmCancel(false);
              }}
            >
              예약 취소
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </li>
  );
}
