import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PatientFormDialog } from "@/components/patient-form-dialog";
import { PhotoGallery } from "@/components/photo-gallery";
import { VisitFormDialog } from "@/components/visit-form-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ageFromBirth, formatDate, formatTime, formatWon } from "@/lib/format";
import { memoToPlain } from "@/lib/memo";
import { cardBalance, useClinicStore } from "@/lib/store";
import type { Consult, Visit } from "@/lib/types";

export const Route = createFileRoute("/patients/$id")({ component: PatientChart });

type Tab = "visits" | "consults" | "photos" | "ledger";

function PatientChart() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const patients = useClinicStore((s) => s.patients);
  const visitsAll = useClinicStore((s) => s.visits);
  const consultsAll = useClinicStore((s) => s.consults);
  const upsertPatient = useClinicStore((s) => s.upsertPatient);
  const upsertVisit = useClinicStore((s) => s.upsertVisit);
  const removeVisit = useClinicStore((s) => s.removeVisit);
  const removeConsult = useClinicStore((s) => s.removeConsult);
  const removePatient = useClinicStore((s) => s.removePatient);
  const patient = patients.find((p) => p.id === id);
  const visits = useMemo(
    () => visitsAll.filter((v) => v.patientId === id).sort((a, b) => b.date.localeCompare(a.date)),
    [visitsAll, id],
  );
  const consults = useMemo(
    () => consultsAll.filter((c) => c.patientId === id).sort((a, b) => b.date.localeCompare(a.date)),
    [consultsAll, id],
  );
  const balance = cardBalance(visitsAll, id);
  const [tab, setTab] = useState<Tab>("visits");
  const [edit, setEdit] = useState(false);
  const [visitForm, setVisitForm] = useState<{ open: boolean; visit?: Visit }>({ open: false });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [pendingVisit, setPendingVisit] = useState<Visit | undefined>();

  if (!patient) {
    return (
      <div className="grid gap-3">
        <p className="text-sm text-muted">차트를 찾을 수 없습니다.</p>
        <Button variant="outline" onClick={() => navigate({ to: "/charts" })}>
          차트 목록
        </Button>
      </div>
    );
  }

  const age = patient.age ?? ageFromBirth(patient.birth);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <button type="button" className="text-xs text-muted" onClick={() => navigate({ to: "/charts" })}>
            ← 차트 목록
          </button>
          <h1 className="mt-1 font-display text-4xl tracking-tight">{patient.name}</h1>
          <p className="mt-1 text-sm text-muted">
            {patient.chartNo || "번호 없음"}
            {age != null ? ` · ${age}세` : ""}
            {patient.gender ? ` · ${patient.gender === "F" ? "여" : "남"}` : ""}
            {patient.phone ? ` · ${patient.phone}` : ""}
          </p>
          {patient.memo ? <p className="mt-2 max-w-xl text-sm text-ink/80">{patient.memo}</p> : null}
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="rounded-lg border border-border bg-surface px-4 py-3 text-right">
            <p className="text-[11px] text-muted">회원카드 잔액</p>
            <p className="text-lg font-medium tabular-nums">{formatWon(balance)}</p>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => navigate({ to: "/analyze", search: { patientId: patient.id } })}>
              AI상담
            </Button>
            <Button size="sm" variant="outline" onClick={() => setEdit(true)}>
              차트 수정
            </Button>
            <Button size="sm" variant="ghost" className="text-danger hover:text-danger" onClick={() => setConfirmDelete(true)}>
              차트 삭제
            </Button>
            <Button size="sm" onClick={() => setVisitForm({ open: true })}>
              기록 추가
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-1 rounded-md bg-surface-2 p-1">
        {(
          [
            ["visits", "기록"],
            ["consults", `상담${consults.length ? ` ${consults.length}` : ""}`],
            ["photos", "사진"],
            ["ledger", "결제"],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            className={`h-9 flex-1 rounded-sm text-sm ${tab === k ? "bg-surface text-ink shadow-sm" : "text-muted"}`}
            onClick={() => setTab(k as Tab)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "visits" ? (
        <ol className="grid gap-3">
          {visits.length === 0 ? (
            <p className="text-sm text-muted">기록이 없습니다.</p>
          ) : (
            visits.map((v) => (
              <li key={v.id} className="rounded-xl border border-border bg-surface p-4 shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">
                      {formatDate(v.date, "yyyy.MM.dd (EEE)")}
                      {v.time ? <span className="ml-2 tabular-nums text-sage">{formatTime(v.time)}</span> : null}
                    </p>
                    <p className="mt-1 text-sm text-sage">
                      {v.source === "cancel" ? <span className="text-danger">예약 취소</span> : v.treatments.join(" · ") || "시술 없음"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setVisitForm({ open: true, visit: v })}>
                      수정
                    </Button>
                    <Button size="sm" variant="ghost" className="text-danger hover:text-danger" onClick={() => setPendingVisit(v)}>
                      삭제
                    </Button>
                  </div>
                </div>
                {v.memo ? (
                  <div className="memo-body mt-3 text-sm leading-relaxed text-ink/90" dangerouslySetInnerHTML={{ __html: v.memo }} />
                ) : null}
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted">
                  {v.paidAmount ? <span>결제 {formatWon(v.paidAmount)}</span> : null}
                  {v.rechargeAmount ? <span>충전 {formatWon(v.rechargeAmount)}</span> : null}
                  {v.redeemAmount ? <span>차감 {formatWon(v.redeemAmount)}</span> : null}
                  {v.nextVisit ? <span>다음 내원 {formatDate(v.nextVisit, "M월 d일")}</span> : null}
                </div>
              </li>
            ))
          )}
        </ol>
      ) : null}

      {tab === "consults" ? <ConsultList consults={consults} onRemove={removeConsult} /> : null}
      {tab === "photos" ? <PhotoGallery patientId={patient.id} patientName={patient.name} /> : null}
      {tab === "ledger" ? <Ledger visits={visits} /> : null}

      <PatientFormDialog open={edit} onOpenChange={setEdit} initial={patient} onSave={upsertPatient} />
      <VisitFormDialog
        key={visitForm.visit?.id ?? "new"}
        open={visitForm.open}
        onOpenChange={(open) => {
          if (!open) setVisitForm({ open: false });
        }}
        patientId={patient.id}
        initial={visitForm.visit}
        onSave={upsertVisit}
      />
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent title="차트 삭제">
          <p className="mt-3 text-sm text-muted">
            {patient.name} 차트를 삭제하면 기록·사진·상담이 함께 지워집니다.
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
              닫기
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                removePatient(patient.id);
                navigate({ to: "/charts" });
              }}
            >
              삭제
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={Boolean(pendingVisit)} onOpenChange={(v) => !v && setPendingVisit(undefined)}>
        <DialogContent title="기록 삭제">
          <p className="mt-3 text-sm text-muted">
            {pendingVisit
              ? `${formatDate(pendingVisit.date, "yyyy.MM.dd")}${pendingVisit.time ? ` ${formatTime(pendingVisit.time)}` : ""} 기록을 삭제할까요?`
              : "이 기록을 삭제할까요?"}
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setPendingVisit(undefined)}>
              닫기
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (!pendingVisit) return;
                removeVisit(pendingVisit.id);
                setPendingVisit(undefined);
              }}
            >
              삭제
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ConsultList({ consults, onRemove }: { consults: Consult[]; onRemove: (id: string) => void }) {
  if (consults.length === 0) return <p className="text-sm text-muted">저장된 AI 상담이 없습니다.</p>;
  return (
    <ol className="grid gap-3">
      {consults.map((c) => (
        <li key={c.id} className="rounded-xl border border-border bg-surface p-4 shadow-card">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-sage">AI 상담</p>
              <p className="text-sm font-medium">{formatDate(c.date, "yyyy.MM.dd (EEE)")}</p>
            </div>
            <Button size="sm" variant="ghost" onClick={() => onRemove(c.id)}>
              삭제
            </Button>
          </div>
          {c.analysis.recommendations.length > 0 ? (
            <p className="mt-3 text-sm text-sage">{c.analysis.recommendations.map((r) => r.name).join(" · ")}</p>
          ) : null}
          {c.analysis.plan.length > 0 ? (
            <ol className="mt-3 grid gap-1.5 text-sm">
              {c.analysis.plan.map((step) => (
                <li key={step.order}>
                  {step.order}. {step.timing} · {step.title}
                </li>
              ))}
            </ol>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

function Ledger({ visits }: { visits: Visit[] }) {
  let running = 0;
  const rows = [...visits]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((v) => {
      running += (v.rechargeAmount ?? 0) - (v.redeemAmount ?? 0);
      return { v, running };
    });
  const totalPaid = visits.reduce((s, v) => s + (v.paidAmount ?? 0), 0);
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      <p className="px-3 py-2 text-xs text-muted">누적 결제 {formatWon(totalPaid)}</p>
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="text-xs text-muted">
          <tr className="border-b border-border">
            <th className="px-3 py-2 font-medium">날짜</th>
            <th className="px-3 py-2 font-medium">시술</th>
            <th className="px-3 py-2 font-medium">결제</th>
            <th className="px-3 py-2 font-medium">잔액</th>
          </tr>
        </thead>
        <tbody>
          {[...rows].reverse().map(({ v, running: bal }) => (
            <tr key={v.id} className="border-b border-border last:border-0">
              <td className="px-3 py-2 tabular-nums">{v.date}</td>
              <td className="px-3 py-2 text-muted">{v.treatments.join(", ") || memoToPlain(v.memo ?? "")}</td>
              <td className="px-3 py-2 tabular-nums">{v.paidAmount ? formatWon(v.paidAmount) : "—"}</td>
              <td className="px-3 py-2 tabular-nums">{formatWon(bal)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
