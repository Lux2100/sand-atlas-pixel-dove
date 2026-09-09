import { useMemo, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { analyzeFace } from "@/lib/analyze";
import { todayISO } from "@/lib/format";
import { searchPatients } from "@/lib/patients";
import { compressImage } from "@/lib/photo";
import { TREATMENTS } from "@/lib/procedures";
import { protocolByName, protocolCatalogForAi } from "@/lib/protocol";
import { useClinicStore } from "@/lib/store";
import type { FaceAnalysis } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/analyze")({
  validateSearch: (search: Record<string, unknown>): { patientId?: string } => {
    const patientId = typeof search.patientId === "string" ? search.patientId : undefined;
    return patientId ? { patientId } : {};
  },
  component: AnalyzePage,
});

function AnalyzePage() {
  const navigate = useNavigate();
  const { patientId: initialPatientId } = Route.useSearch();
  const houseIds = useClinicStore((s) => s.houseIds);
  const patients = useClinicStore((s) => s.patients);
  const visits = useClinicStore((s) => s.visits);
  const addConsult = useClinicStore((s) => s.addConsult);
  const addPhoto = useClinicStore((s) => s.addPhoto);
  const houseNames = useMemo(
    () => TREATMENTS.filter((t) => houseIds.includes(t.id)).map((t) => t.name),
    [houseIds],
  );
  const fileRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FaceAnalysis | null>(null);
  const [linkChart, setLinkChart] = useState(Boolean(initialPatientId));
  const [patientId, setPatientId] = useState<string | undefined>(initialPatientId);
  const [pq, setPq] = useState("");
  const [savedId, setSavedId] = useState<string | null>(null);
  const selected = patients.find((p) => p.id === patientId);
  const matches = useMemo(() => searchPatients(patients, visits, pq).slice(0, 6), [patients, visits, pq]);
  const catalog = useMemo(
    () =>
      TREATMENTS.map((t) => {
        const house = houseIds.includes(t.id) ? "[주력] " : "";
        return `${house}${t.name} (${t.category}) — ${t.summary}`;
      }).join("\n"),
    [houseIds],
  );

  const saveToChart = (analysis: FaceAnalysis, pid: string) => {
    const consult = addConsult({
      patientId: pid,
      date: todayISO(),
      note: note.trim() || undefined,
      analysis,
      photoUrls: images,
    });
    for (const url of images) {
      addPhoto({ patientId: pid, kind: "other", url, takenAt: todayISO(), note: "AI상담" });
    }
    setSavedId(consult.id);
    return consult.id;
  };

  const run = async () => {
    if (images.length === 0) return;
    setBusy(true);
    setError(null);
    setSavedId(null);
    try {
      const res = await analyzeFace({
        data: { images, houseNames, catalog, protocols: protocolCatalogForAi(houseIds), note },
      });
      if (!res.ok) setError(res.error ?? "분석에 실패했습니다.");
      else {
        setResult(res.analysis);
        if (linkChart && patientId) saveToChart(res.analysis, patientId);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "상담에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs text-muted">AI 상담</p>
        <h1 className="font-display text-4xl tracking-tight">얼굴 사진으로 계획</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 md:items-start">
        <div className="grid gap-5">
          <section className="rounded-xl border border-border bg-surface p-5">
            <p className="text-xs text-muted">차트 연결</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant={!linkChart ? "default" : "outline"} onClick={() => setLinkChart(false)}>
                연결 안 함
              </Button>
              <Button size="sm" variant={linkChart ? "default" : "outline"} onClick={() => setLinkChart(true)}>
                차트에 연결
              </Button>
            </div>
            {linkChart ? (
              <div className="mt-4 grid gap-2">
                {selected ? (
                  <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                    <p className="text-sm">
                      <span className="font-medium">{selected.name}</span>
                      <span className="ml-2 text-xs text-muted">{selected.chartNo}</span>
                    </p>
                    <Button size="sm" variant="ghost" onClick={() => setPatientId(undefined)}>
                      변경
                    </Button>
                  </div>
                ) : (
                  <>
                    <Input value={pq} onChange={(e) => setPq(e.target.value)} placeholder="연결할 손님 이름 또는 차트번호" />
                    <ul className="overflow-hidden rounded-md border border-border">
                      {(pq.trim() ? matches : patients.slice(0, 6)).map((p) => (
                        <li key={p.id}>
                          <button type="button" className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-surface-2" onClick={() => setPatientId(p.id)}>
                            <span>{p.name}</span>
                            <span className="text-xs text-muted">{p.chartNo}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            ) : null}
          </section>
          <div className="rounded-xl border border-border bg-surface p-5">
            <p className="text-xs text-muted">우선 추천 · 원내 주력</p>
            <p className="mt-1 text-sm text-sage">{houseNames.join(" · ") || "시술 가이드에서 주력을 선택하세요."}</p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={async (e) => {
              const files = Array.from(e.target.files ?? []);
              e.target.value = "";
              const urls: string[] = [];
              for (const file of files.slice(0, 4)) urls.push(await compressImage(file));
              setImages((prev) => [...prev, ...urls].slice(0, 4));
            }}
          />
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => fileRef.current?.click()}>
              사진 추가
            </Button>
            {images.length > 0 ? (
              <Button variant="ghost" onClick={() => setImages([])}>
                지우기
              </Button>
            ) : null}
          </div>
          {images.length > 0 ? (
            <ul className="grid grid-cols-2 gap-3">
              {images.map((src, i) => (
                <li key={i} className="overflow-hidden rounded-lg border border-border">
                  <img src={src} alt="" className="aspect-square w-full object-cover" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted">정면 사진을 올리면 분석이 정확합니다.</p>
          )}
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="손님이 말한 고민, 최근 시술" />
          <Button disabled={busy || images.length === 0 || (linkChart && !patientId)} onClick={() => void run()}>
            {busy ? "분석 중…" : linkChart ? "분석하고 차트에 저장" : "시술 계획 보기"}
          </Button>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5 md:sticky md:top-6 md:min-h-[28rem]">
          <p className="text-xs text-muted">시술 계획</p>
          {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
          {savedId && selected ? (
            <div className="mt-3 flex items-center justify-between rounded-lg bg-sage-soft px-3 py-2">
              <p className="text-sm text-sage">{selected.name} 차트에 저장됨</p>
              <Button size="sm" variant="ghost" onClick={() => navigate({ to: "/patients/$id", params: { id: selected.id } })}>
                차트 보기
              </Button>
            </div>
          ) : null}
          {busy ? (
            <p className="mt-8 text-center text-sm text-muted">사진을 보고 계획을 짜는 중입니다…</p>
          ) : result ? (
            <Result analysis={result} />
          ) : (
            <p className="mt-8 text-center text-sm text-muted">왼쪽에서 사진을 올리고 시술 계획 보기를 누르면 여기에 답변이 나옵니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Result({ analysis }: { analysis: FaceAnalysis }) {
  return (
    <div className="mt-4 grid gap-5">
      {analysis.findings.map((f, i) => (
        <div key={i} className="rounded-lg border border-border px-4 py-3">
          <p className="text-sm font-medium">{f.area} · {f.concern}</p>
          <p className="mt-1 text-sm text-muted">{f.detail}</p>
        </div>
      ))}
      {analysis.recommendations.map((r, i) => (
        <div key={i} className="rounded-lg border border-border px-4 py-3">
          <p className="text-sm font-medium text-sage">{r.name}</p>
          <p className="mt-1 text-sm">{r.reason}</p>
          <p className="mt-1 text-xs text-muted">{r.protocol || formatFallback(r.name)}</p>
        </div>
      ))}
      {analysis.plan.map((step) => (
        <div key={step.order} className="flex gap-3 rounded-lg border border-border px-4 py-3">
          <span className="font-display text-2xl text-sage">{step.order}</span>
          <div>
            <p className="text-sm font-medium">{step.timing} · {step.title}</p>
            <p className="mt-1 text-sm text-sage">{step.treatments.join(" · ")}</p>
            <p className="mt-1 text-sm text-muted">{step.note}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function formatFallback(name: string) {
  const p = protocolByName(name);
  if (!p) return "";
  return [p.energy, p.tip, `${p.interval} 간격`, p.sessions].filter(Boolean).join(" · ");
}
