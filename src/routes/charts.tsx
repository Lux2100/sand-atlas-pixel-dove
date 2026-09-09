import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PatientFormDialog } from "@/components/patient-form-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/format";
import { searchPatients, type PatientHit } from "@/lib/patients";
import { useClinicStore } from "@/lib/store";

export const Route = createFileRoute("/charts")({ component: ChartsPage });

function ChartsPage() {
  const navigate = useNavigate();
  const patients = useClinicStore((s) => s.patients);
  const visits = useClinicStore((s) => s.visits);
  const upsertPatient = useClinicStore((s) => s.upsertPatient);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const list = useMemo(() => searchPatients(patients, visits, q), [patients, visits, q]);
  const dateHits = list.filter((p) => p.visitDate);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs text-muted">차트</p>
          <h1 className="font-display text-4xl tracking-tight">손님 검색</h1>
          <p className="mt-1 text-xs text-muted">이름, 차트번호, 또는 날짜 (예: 26.09.01)</p>
        </div>
        <Button onClick={() => setOpen(true)}>새 차트</Button>
      </div>
      <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="이름, 차트번호, 26.09.01" />
      {dateHits.length > 0 ? (
        <p className="text-sm text-sage">{formatDate(dateHits[0].visitDate!, "yyyy.MM.dd")} 내원 {dateHits.length}명</p>
      ) : q.trim() && list.length === 0 ? (
        <p className="text-sm text-muted">그날 내원 기록이 없거나 검색어가 맞지 않습니다.</p>
      ) : null}
      <ul className="grid gap-2">
        {list.length === 0 ? (
          <li className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
            검색 결과가 없습니다.
          </li>
        ) : (
          list.map((p) => <HitRow key={p.id} hit={p} />)
        )}
      </ul>
      <PatientFormDialog
        open={open}
        onOpenChange={setOpen}
        onSave={(p) => {
          const created = upsertPatient(p);
          navigate({ to: "/patients/$id", params: { id: created.id } });
        }}
      />
    </div>
  );
}

function HitRow({ hit }: { hit: PatientHit }) {
  const navigate = useNavigate();
  return (
    <li>
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 text-left hover:border-sage/40"
        onClick={() => navigate({ to: "/patients/$id", params: { id: hit.id } })}
      >
        <span>
          <span className="font-medium">{hit.name}</span>
          <span className="ml-2 text-xs text-muted">{hit.chartNo}</span>
          {hit.phone ? <span className="ml-2 text-xs text-subtle">{hit.phone}</span> : null}
        </span>
        <span className="text-right">
          <span className="block max-w-[220px] truncate text-xs text-sage">
            {hit.hitLabel || (hit.lastTreatments ? hit.lastTreatments.join(" · ") : "기록 없음")}
          </span>
        </span>
      </button>
    </li>
  );
}
