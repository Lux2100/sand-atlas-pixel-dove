import { useEffect, useMemo, useRef, useState } from "react";
import { clinicTime, nowTime, todayISO } from "@/lib/format";
import { displayCopy } from "@/lib/memo";
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

export function ReservationFormDialog({ open, onOpenChange, initial }: Props) {
  const patients = useClinicStore((s) => s.patients);
  const upsertReservation = useClinicStore((s) => s.upsertReservation);
  const upsertPatient = useClinicStore((s) => s.upsertPatient);
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState(() => clinicTime(nowTime()));
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [chartNo, setChartNo] = useState("");
  const [gender, setGender] = useState<"F" | "M" | "">("");
  const [patientId, setPatientId] = useState<string | undefined>();
  const [treatments, setTreatments] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const fromChart = useRef(false);

  useEffect(() => {
    if (!open) return;
    const linked = initial?.patientId
      ? useClinicStore.getState().patients.find((p) => p.id === initial.patientId)
      : undefined;
    setDate(initial?.date ?? todayISO());
    setTime(clinicTime(initial?.time ?? nowTime()));
    setName(initial?.name ?? "");
    setPhone(initial?.phone ?? linked?.phone ?? "");
    setChartNo(initial?.chartNo ?? linked?.chartNo ?? "");
    setGender(initial?.gender ?? linked?.gender ?? "");
    setPatientId(initial?.patientId);
    setTreatments(initial?.treatments ?? []);
    setNote(displayCopy(initial?.note ?? ""));
    fromChart.current = Boolean(initial?.patientId);
  }, [open, initial?.id]);

  const matches = useMemo(() => {
    const n = name.trim().toLowerCase();
    const ph = phone.replace(/\D/g, "");
    if (!n && ph.length < 3) return [];
    return patients
      .filter((p) => {
        if (patientId && p.id === patientId) return false;
        if (n && p.name.toLowerCase().includes(n)) return true;
        if (ph.length >= 3 && (p.phone ?? "").replace(/\D/g, "").includes(ph)) return true;
        return false;
      })
      .slice(0, 6);
  }, [name, phone, patients, patientId]);

  const chartKey = chartNo.trim().toLowerCase();
  const chartMatches = useMemo(() => {
    if (!chartKey) return [];
    return patients
      .filter((p) => {
        const no = p.chartNo.trim().toLowerCase();
        if (!no.startsWith(chartKey)) return false;
        if (patientId && p.id === patientId && no === chartKey) return false;
        return true;
      })
      .slice(0, 6);
  }, [chartKey, patients, patientId]);

  const selected = patients.find((p) => p.id === patientId);

  const applyPatient = (p: (typeof patients)[number], keepChart = false) => {
    setName(p.name);
    setPhone(p.phone ?? "");
    if (!keepChart) setChartNo(p.chartNo);
    setGender(p.gender ?? "");
    setPatientId(p.id);
    fromChart.current = true;
  };

  const onChartNo = (next: string) => {
    setChartNo(next);
    const key = next.trim().toLowerCase();
    const clearLinked = () => {
      if (!fromChart.current) {
        setPatientId(undefined);
        return;
      }
      setName("");
      setPhone("");
      setGender("");
      setPatientId(undefined);
      fromChart.current = false;
    };
    if (!key) {
      clearLinked();
      return;
    }
    const exact = patients.filter((p) => p.chartNo.trim().toLowerCase() === key);
    const hasLonger = patients.some((p) => {
      const no = p.chartNo.trim().toLowerCase();
      return no.startsWith(key) && no.length > key.length;
    });
    if (exact.length === 1 && !hasLonger) applyPatient(exact[0], true);
    else clearLinked();
  };

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed || !date) return;
    const no = chartNo.trim();
    let linkedId = patientId;
    if (!linkedId) {
      const exact = no
        ? patients.find((p) => p.chartNo.trim().toLowerCase() === no.toLowerCase())
        : undefined;
      if (exact) {
        linkedId = exact.id;
      } else if (!initial?.patientId) {
        linkedId = upsertPatient({
          name: trimmed,
          phone: phone.trim() || undefined,
          chartNo: no,
          gender: gender || undefined,
        }).id;
      }
    }
    upsertReservation({
      id: initial?.id ?? uid("r"),
      date,
      time: clinicTime(time),
      name: trimmed,
      phone: phone.trim() || undefined,
      patientId: linkedId,
      chartNo: no || undefined,
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
              <TimeSelect value={time} onChange={(next) => setTime(clinicTime(next))} minHour={8} maxHour={20} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>차트번호</Label>
              <Input
                value={chartNo}
                onChange={(e) => onChartNo(e.target.value)}
                placeholder="직접 입력"
              />
              {chartMatches.length > 0 ? (
                <ul className="overflow-hidden rounded-md border border-border">
                  {chartMatches.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-surface-2"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applyPatient(p)}
                      >
                        <span>{p.chartNo}</span>
                        <span className="text-xs text-muted">{p.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
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
            <Label>이름</Label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setPatientId(undefined);
                fromChart.current = false;
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
                        fromChart.current = true;
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
