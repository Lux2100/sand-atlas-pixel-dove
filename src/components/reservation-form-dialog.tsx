import { useEffect, useMemo, useState } from "react";
import { nowTime, snapVisitTime, todayISO } from "@/lib/format";
import { useClinicStore } from "@/lib/store";
import type { Reservation } from "@/lib/types";
import { uid } from "@/lib/utils";
import { TreatmentPicker } from "@/components/visit-form-dialog";
import { TimeSelect } from "@/components/time-select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Partial<Reservation>;
};

function reserveTime(t?: string) {
  const snapped = snapVisitTime(t);
  const h = Number(snapped.slice(0, 2));
  const hour = h < 8 ? 8 : h > 20 ? 20 : h;
  return `${String(hour).padStart(2, "0")}:${snapped.slice(3, 5)}`;
}

export function ReservationFormDialog({ open, onOpenChange, initial }: Props) {
  const patients = useClinicStore((s) => s.patients);
  const upsertReservation = useClinicStore((s) => s.upsertReservation);
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState(() => reserveTime(nowTime()));
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [chartNo, setChartNo] = useState("");
  const [gender, setGender] = useState<"F" | "M" | "">("");
  const [patientId, setPatientId] = useState<string | undefined>();
  const [treatments, setTreatments] = useState<string[]>([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) return;
    const linked = initial?.patientId
      ? useClinicStore.getState().patients.find((p) => p.id === initial.patientId)
      : undefined;
    setDate(initial?.date ?? todayISO());
    setTime(reserveTime(initial?.time ?? nowTime()));
    setName(initial?.name ?? "");
    setPhone(initial?.phone ?? linked?.phone ?? "");
    setChartNo(initial?.chartNo ?? linked?.chartNo ?? "");
    setGender(initial?.gender ?? linked?.gender ?? "");
    setPatientId(initial?.patientId);
    setTreatments(initial?.treatments ?? []);
    setNote(initial?.note ?? "");
  }, [open, initial?.id]);

  const matches = useMemo(() => {
    const n = name.trim().toLowerCase();
    const ph = phone.replace(/\D/g, "");
    const no = chartNo.trim().toLowerCase();
    if (!n && ph.length < 3 && !no) return [];
    return patients
      .filter((p) => {
        if (patientId && p.id === patientId) return false;
        if (n && p.name.toLowerCase().includes(n)) return true;
        if (ph.length >= 3 && (p.phone ?? "").replace(/\D/g, "").includes(ph)) return true;
        if (no && p.chartNo.toLowerCase().includes(no)) return true;
        return false;
      })
      .slice(0, 6);
  }, [name, phone, chartNo, patients, patientId]);

  const selected = patients.find((p) => p.id === patientId);

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed || !date) return;
    upsertReservation({
      id: initial?.id ?? uid("r"),
      date,
      time: reserveTime(time),
      name: trimmed,
      phone: phone.trim() || undefined,
      patientId,
      chartNo: chartNo.trim() || undefined,
      gender: gender || undefined,
      treatments: treatments.length ? treatments : undefined,
      note: note.trim(),
      cancelled: initial?.cancelled,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title={initial ? "예약 수정" : "예약 추가"}>
        <form
          className="mt-4 grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>날짜</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label>시간</Label>
              <TimeSelect value={time} onChange={(next) => setTime(reserveTime(next))} minHour={8} maxHour={20} />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>이름</Label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setPatientId(undefined);
              }}
              placeholder="예약 손님"
            />
            {selected ? (
              <p className="text-xs text-sage">
                연결됨 · {selected.name} {selected.chartNo}
              </p>
            ) : matches.length > 0 ? (
              <ul className="overflow-hidden rounded-md border border-border">
                {matches.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-surface-2"
                      onClick={() => {
                        setName(p.name);
                        setPhone(p.phone ?? phone);
                        setChartNo(p.chartNo);
                        setGender(p.gender ?? gender);
                        setPatientId(p.id);
                      }}
                    >
                      <span>{p.name}</span>
                      <span className="text-xs text-muted">{p.chartNo}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>차트번호</Label>
              <Input
                value={chartNo}
                onChange={(e) => {
                  const next = e.target.value;
                  setChartNo(next);
                  const key = next.trim().toLowerCase();
                  const exact = key ? patients.filter((p) => p.chartNo.trim().toLowerCase() === key) : [];
                  if (exact.length === 1) {
                    setName(exact[0].name);
                    setPhone(exact[0].phone ?? phone);
                    setGender(exact[0].gender ?? gender);
                    setPatientId(exact[0].id);
                  } else {
                    setPatientId(undefined);
                  }
                }}
                placeholder="직접 입력"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>성별</Label>
              <div className="flex gap-2">
                <Button type="button" size="sm" variant={gender === "F" ? "default" : "outline"} onClick={() => setGender(gender === "F" ? "" : "F")}>
                  여
                </Button>
                <Button type="button" size="sm" variant={gender === "M" ? "default" : "outline"} onClick={() => setGender(gender === "M" ? "" : "M")}>
                  남
                </Button>
              </div>
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>전화</Label>
            <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-" />
          </div>
          <div className="grid gap-1.5">
            <Label>시술</Label>
            <TreatmentPicker value={treatments} onChange={setTreatments} />
          </div>
          <div className="grid gap-1.5">
            <Label>메모</Label>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="예약 메모" />
          </div>
          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              닫기
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              저장
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
