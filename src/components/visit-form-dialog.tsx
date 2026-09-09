import { useEffect, useMemo, useState } from "react";
import { nowTime, snapVisitTime, todayISO } from "@/lib/format";
import { CATEGORY_LABEL, CATEGORY_ORDER, TREATMENTS, matchesTreatment, sortHouseFirst } from "@/lib/procedures";
import { useClinicStore } from "@/lib/store";
import type { TreatmentCategory, Visit } from "@/lib/types";
import { uid } from "@/lib/utils";
import { MemoEditor } from "@/components/memo-editor";
import { TimeSelect } from "@/components/time-select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Filter = "house" | "all" | TreatmentCategory;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
  initial?: Visit;
  onSave: (visit: Visit) => void;
};

function fillFrom(visit: Visit | undefined) {
  const editing = Boolean(visit?.id);
  return {
    date: visit?.date ?? todayISO(),
    time: visit?.time ? snapVisitTime(visit.time) : editing ? "10:00" : nowTime(),
    nextVisit: visit?.nextVisit ?? "",
    treatments: visit?.treatments ?? [],
    memo: visit?.memo ?? "",
    paid: visit?.paidAmount != null ? String(visit.paidAmount) : "",
    recharge: visit?.rechargeAmount != null ? String(visit.rechargeAmount) : "",
    redeem: visit?.redeemAmount != null ? String(visit.redeemAmount) : "",
  };
}

function parseAmount(raw: string): number | undefined {
  const n = Number(String(raw).replace(/,/g, "").trim());
  return raw.trim() !== "" && Number.isFinite(n) ? n : undefined;
}

export function VisitFormDialog({ open, onOpenChange, patientId, initial, onSave }: Props) {
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState(nowTime());
  const [nextVisit, setNextVisit] = useState("");
  const [treatments, setTreatments] = useState<string[]>([]);
  const [memo, setMemo] = useState("");
  const [paid, setPaid] = useState("");
  const [recharge, setRecharge] = useState("");
  const [redeem, setRedeem] = useState("");

  useEffect(() => {
    if (!open) return;
    const next = fillFrom(initial);
    setDate(next.date);
    setTime(next.time);
    setNextVisit(next.nextVisit);
    setTreatments(next.treatments);
    setMemo(next.memo);
    setPaid(next.paid);
    setRecharge(next.recharge);
    setRedeem(next.redeem);
  }, [open, initial?.id]);

  const submit = () => {
    if (!date) return;
    onSave({
      id: initial?.id ?? uid("v"),
      patientId,
      date,
      time,
      treatments,
      memo: memo || undefined,
      nextVisit: nextVisit || undefined,
      paidAmount: parseAmount(paid),
      rechargeAmount: parseAmount(recharge),
      redeemAmount: parseAmount(redeem),
      source: initial?.source,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title={initial?.id ? "기록 수정" : "기록 추가"}>
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
              <TimeSelect value={time} onChange={setTime} />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>다음 내원</Label>
            <Input type="date" value={nextVisit} onChange={(e) => setNextVisit(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label>시술</Label>
            <TreatmentPicker value={treatments} onChange={setTreatments} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <AmountField label="결제" value={paid} onChange={setPaid} />
            <AmountField label="충전" value={recharge} onChange={setRecharge} />
            <AmountField label="차감" value={redeem} onChange={setRedeem} />
          </div>
          <div className="grid gap-1.5">
            <Label>메모</Label>
            <MemoEditor value={memo} onChange={setMemo} />
          </div>
          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              닫기
            </Button>
            <Button type="submit">저장</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AmountField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      <Input type="number" inputMode="numeric" min={0} value={value} onChange={(e) => onChange(e.target.value)} placeholder="0" />
    </div>
  );
}

export function TreatmentPicker({ value, onChange }: { value: string[]; onChange: (next: string[]) => void }) {
  const houseIds = useClinicStore((s) => s.houseIds);
  const [filter, setFilter] = useState<Filter>("house");
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    let rows = sortHouseFirst(TREATMENTS, houseIds);
    if (filter === "house") rows = rows.filter((t) => houseIds.includes(t.id) || t.house);
    else if (filter !== "all") rows = rows.filter((t) => t.category === filter);
    return rows.filter((t) => matchesTreatment(t, q)).slice(0, 40);
  }, [filter, q, houseIds]);

  const toggle = (name: string) => {
    onChange(value.includes(name) ? value.filter((x) => x !== name) : [...value, name]);
  };

  const filters: { id: Filter; label: string }[] = [
    { id: "house", label: "주력" },
    { id: "all", label: "전체" },
    ...CATEGORY_ORDER.map((id) => ({ id, label: CATEGORY_LABEL[id] })),
  ];

  return (
    <div className="grid gap-2 rounded-md border border-border bg-surface p-2">
      {value.length > 0 ? (
        <ul className="flex flex-wrap gap-1">
          {value.map((name) => (
            <li key={name}>
              <button
                type="button"
                className="rounded-full bg-sage-soft px-2 py-0.5 text-xs text-sage"
                onClick={() => toggle(name)}
              >
                {name} ×
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-subtle">시술을 고르세요.</p>
      )}
      <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="시술 검색" />
      <div className="flex flex-wrap gap-1">
        {filters.map((f) => (
          <Button key={f.id} type="button" size="sm" variant={filter === f.id ? "default" : "outline"} onClick={() => setFilter(f.id)}>
            {f.label}
          </Button>
        ))}
      </div>
      <ul className="grid max-h-40 gap-1 overflow-y-auto">
        {list.map((t) => {
          const on = value.includes(t.name);
          return (
            <li key={t.id}>
              <button
                type="button"
                className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm ${on ? "bg-sage-soft text-sage" : "hover:bg-surface-2"}`}
                onClick={() => toggle(t.name)}
              >
                <span>{t.name}</span>
                <span className="text-xs text-muted">{CATEGORY_LABEL[t.category]}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
