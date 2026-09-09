import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CLINIC_SETS, currentSeasonSets, type ClinicSet } from "@/lib/events";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export const Route = createFileRoute("/events")({
  validateSearch: (s: Record<string, unknown>): { set?: string } =>
    typeof s.set === "string" ? { set: s.set } : {},
  component: EventsPage,
});

function EventsPage() {
  const { set: setId } = Route.useSearch();
  const [kind, setKind] = useState<"season" | "concern" | "now">("now");
  const [open, setOpen] = useState<ClinicSet | undefined>(() => CLINIC_SETS.find((s) => s.id === setId));
  const now = useMemo(() => currentSeasonSets(), []);
  const list = kind === "now" ? now : CLINIC_SETS.filter((s) => s.kind === kind);

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs text-muted">세트 메뉴</p>
        <h1 className="font-display text-4xl tracking-tight">시즌 · 고민별</h1>
        <p className="mt-2 max-w-xl text-sm text-muted">세트를 누르면 추천 코스가 순서대로 나옵니다.</p>
      </div>
      <div className="flex flex-wrap gap-1">
        {(
          [
            ["now", "지금 추천"],
            ["season", "시즌세트"],
            ["concern", "고민세트"],
          ] as const
        ).map(([k, label]) => (
          <Button key={k} size="sm" variant={kind === k ? "default" : "outline"} onClick={() => setKind(k)}>
            {label}
          </Button>
        ))}
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {list.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              className="flex h-full w-full flex-col rounded-xl border border-border bg-surface p-5 text-left shadow-card hover:border-sage/40"
              onClick={() => setOpen(s)}
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-base font-medium">{s.name}</h2>
                <Badge tone="sage">{s.kind === "season" ? s.season ?? "시즌" : "고민"}</Badge>
              </div>
              {s.period ? <p className="mt-1 text-xs text-muted">{s.period}</p> : null}
              <p className="mt-2 text-sm text-ink/80">{s.summary}</p>
              <p className="mt-3 text-sm text-sage">{s.treatments.join(" · ")}</p>
              <p className="mt-2 text-xs text-muted">
                {s.sessions} · {s.priceHint}
              </p>
            </button>
          </li>
        ))}
      </ul>
      <Dialog open={Boolean(open)} onOpenChange={(v) => !v && setOpen(undefined)}>
        <DialogContent title={open?.name ?? "세트"}>
          {open ? (
            <div className="mt-4 grid gap-4">
              <p className="text-sm text-ink/80">{open.summary}</p>
              <p className="text-sm text-sage">{open.treatments.join(" · ")}</p>
              <p className="text-xs text-muted">
                {open.sessions} · {open.priceHint}
              </p>
              <h3 className="text-sm font-medium">추천 코스</h3>
              <ol className="grid gap-2">
                {open.course.map((step, i) => (
                  <li key={i} className="flex gap-3 rounded-lg border border-border bg-surface-2 px-4 py-3">
                    <span className="font-display text-2xl text-sage">{i + 1}</span>
                    <div>
                      <p className="text-sm font-medium">
                        {step.timing} · {step.title}
                      </p>
                      <p className="mt-1 text-sm text-sage">{step.treatments.join(" · ")}</p>
                      <p className="mt-1 text-sm text-muted">{step.note}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
