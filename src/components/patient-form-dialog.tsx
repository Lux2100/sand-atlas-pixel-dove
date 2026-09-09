import { useEffect, useState, type ReactNode } from "react";
import { ageFromBirth } from "@/lib/format";
import type { Patient } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type PatientDraft = {
  id?: string;
  chartNo: string;
  name: string;
  phone?: string;
  birth?: string;
  age?: number;
  gender?: "F" | "M";
  memo?: string;
  createdAt?: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Partial<Patient>;
  onSave: (patient: PatientDraft) => void;
};

function emptyAge(birth?: string, age?: number) {
  if (age != null && Number.isFinite(age)) return String(age);
  const suggested = ageFromBirth(birth);
  return suggested != null ? String(suggested) : "";
}

export function PatientFormDialog({ open, onOpenChange, initial, onSave }: Props) {
  const [chartNo, setChartNo] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birth, setBirth] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"F" | "M" | "">("");
  const [memo, setMemo] = useState("");

  const editing = Boolean(initial?.id);

  useEffect(() => {
    if (!open) return;
    setChartNo(initial?.chartNo ?? "");
    setName(initial?.name ?? "");
    setPhone(initial?.phone ?? "");
    setBirth(initial?.birth ?? "");
    setAge(emptyAge(initial?.birth, initial?.age));
    setGender(initial?.gender ?? "");
    setMemo(initial?.memo ?? "");
  }, [open, initial?.id]);

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const ageNum = age.trim() === "" ? undefined : Number(age);
    onSave({
      id: initial?.id,
      createdAt: initial?.createdAt,
      chartNo: chartNo.trim(),
      name: trimmed,
      phone: phone.trim() || undefined,
      birth: birth || undefined,
      age: ageNum != null && Number.isFinite(ageNum) ? ageNum : undefined,
      gender: gender || undefined,
      memo: memo.trim() || undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title={editing ? "차트 수정" : "새 차트"}>
        <form
          className="mt-4 grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <Field label="차트번호">
            <Input value={chartNo} onChange={(e) => setChartNo(e.target.value)} placeholder="직접 입력" />
          </Field>
          <Field label="이름">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="이름" autoFocus />
          </Field>
          <Field label="전화">
            <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-" />
          </Field>
          <Field label="생년월일">
            <Input
              type="date"
              value={birth}
              onChange={(e) => {
                const next = e.target.value;
                setBirth(next);
                const suggested = ageFromBirth(next);
                if (suggested != null) setAge(String(suggested));
                else if (!next) setAge("");
              }}
            />
          </Field>
          <Field label="나이">
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              max={120}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="자동 계산, 수정 가능"
            />
          </Field>
          <div className="grid gap-1.5">
            <Label>성별</Label>
            <div className="flex gap-2">
              <Button type="button" size="sm" variant={gender === "F" ? "default" : "outline"} onClick={() => setGender("F")}>
                여
              </Button>
              <Button type="button" size="sm" variant={gender === "M" ? "default" : "outline"} onClick={() => setGender("M")}>
                남
              </Button>
            </div>
          </div>
          <Field label="메모">
            <Textarea value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="알러지, 주의사항" />
          </Field>
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

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
