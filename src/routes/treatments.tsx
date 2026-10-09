import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BOTOX_BRANDS, BOTOX_REGION_LABEL } from "@/lib/botox";
import { FILLERS, FILLER_REGION_LABEL } from "@/lib/fillers";
import { CATEGORY_LABEL, CATEGORY_ORDER, TREATMENTS, matchesTreatment, sortHouseFirst } from "@/lib/procedures";
import { protocolOf } from "@/lib/protocol";
import { useClinicStore } from "@/lib/store";
import type { TreatmentCategory, TreatmentProtocol } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/treatments")({ component: TreatmentsPage });

type Filter = "all" | "house" | TreatmentCategory | "fillers" | "botox";

function TreatmentsPage() {
  const houseIds = useClinicStore((s) => s.houseIds);
  const toggleHouse = useClinicStore((s) => s.toggleHouse);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("house");
  const list = useMemo(() => {
    let rows = sortHouseFirst(TREATMENTS, houseIds);
    const searching = q.trim().length > 0;
    if (!searching) {
      if (filter === "house") rows = rows.filter((t) => houseIds.includes(t.id));
      else if (filter !== "all" && filter !== "fillers" && filter !== "botox") rows = rows.filter((t) => t.category === filter);
    } else if (filter !== "all" && filter !== "house" && filter !== "fillers" && filter !== "botox") {
      rows = rows.filter((t) => t.category === filter);
    }
    return rows.filter((t) => matchesTreatment(t, q));
  }, [filter, q, houseIds]);

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs text-muted">시술 가이드</p>
        <h1 className="font-display text-4xl tracking-tight">원내 메뉴</h1>
        <p className="mt-2 text-xs text-muted">원내 참고용 일반 범위이며, 실제 설정은 장비 매뉴얼과 의료진 판단을 따릅니다.</p>
        <p className="mt-2 max-w-xl text-sm text-muted">주력을 선택하면 AI상담이 그 시술을 먼저 권합니다.</p>
      </div>
      <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="시술명, 별칭, 고민" />
      <div className="flex flex-wrap gap-1">
        {(["house", "all", ...CATEGORY_ORDER, "fillers", "botox"] as Filter[]).map((f) => (
          <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f)}>
            {f === "house" ? "주력" : f === "all" ? "전체" : f === "fillers" ? "필러비교" : f === "botox" ? "보톡스비교" : CATEGORY_LABEL[f]}
          </Button>
        ))}
      </div>
      {filter === "fillers" ? (
        <BrandList
          query={q}
          items={FILLERS.map((f) => ({
            id: f.id,
            name: f.name,
            region: FILLER_REGION_LABEL[f.region],
            maker: f.maker,
            line: `${f.material} · 지속 ${f.duration}`,
            bestFor: f.bestFor,
            traits: f.traits,
            diff: f.diff,
            blob: [f.name, f.maker, f.bestFor, f.diff, ...f.traits].join(" "),
          }))}
        />
      ) : filter === "botox" ? (
        <BrandList
          query={q}
          items={BOTOX_BRANDS.map((b) => ({
            id: b.id,
            name: b.name,
            region: BOTOX_REGION_LABEL[b.region],
            maker: b.maker,
            line: `${b.type} · 발현 ${b.onset} · 지속 ${b.duration}`,
            bestFor: b.bestFor,
            traits: b.traits,
            diff: b.diff,
            blob: [b.name, b.maker, b.bestFor, b.diff, ...b.traits].join(" "),
          }))}
        />
      ) : (
        <ul className="grid gap-3">
          {list.map((t) => {
            const house = houseIds.includes(t.id);
            const proto = protocolOf(t.id);
            return (
              <li key={t.id} className="rounded-xl border border-border bg-surface p-5 shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-medium">{t.name}</h2>
                      <Badge>{CATEGORY_LABEL[t.category]}</Badge>
                      {house ? <Badge tone="sage">주력</Badge> : null}
                    </div>
                    <p className="mt-2 text-sm text-ink/80">{t.summary}</p>
                    {proto ? <ProtocolFacts proto={proto} summary={t.summary} /> : null}
                    <p className="mt-2 text-xs text-muted">{t.concerns.join(" · ")}</p>
                  </div>
                  <Button size="sm" variant={house ? "default" : "outline"} onClick={() => toggleHouse(t.id)}>
                    {house ? "주력 해제" : "주력"}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function extraNote(note: string | undefined, summary: string) {
  if (!note || summary.includes(note)) return "";
  const parts = note
    .split(/(?<=[.。])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
  const kept = parts.filter((part) => {
    const core = part.replace(/[.。]$/, "").trim();
    return core.length > 1 && !summary.includes(core);
  });
  return kept.join(" ");
}

function ProtocolFacts({ proto, summary }: { proto: TreatmentProtocol; summary: string }) {
  const note = extraNote(proto.note, summary);
  const rows = [
    proto.energy ? ["에너지", proto.energy] : null,
    proto.tip ? ["팁", proto.tip] : null,
    proto.depth ? ["깊이", proto.depth] : null,
    ["간격", proto.interval],
    ["횟수", proto.sessions],
  ].filter((row): row is [string, string] => Boolean(row));
  return (
    <div className="mt-3 grid gap-1">
      {rows.map(([label, value]) => (
        <p key={label} className="text-sm text-ink">
          <span className="text-muted">{label} </span>
          {value}
        </p>
      ))}
      {note ? <p className="mt-1 text-sm text-ink/80">{note}</p> : null}
    </div>
  );
}

function BrandList({
  query,
  items,
}: {
  query: string;
  items: { id: string; name: string; region: string; maker: string; line: string; bestFor: string; traits: string[]; diff: string; blob: string }[];
}) {
  const s = query.trim();
  const rows = s ? items.filter((i) => i.blob.includes(s)) : items;
  return (
    <ul className="grid gap-3">
      {rows.map((f) => (
        <li key={f.id} className="rounded-xl border border-border bg-surface p-5 shadow-card">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-medium">{f.name}</h2>
            <Badge>{f.region}</Badge>
            <span className="text-xs text-muted">{f.maker}</span>
          </div>
          <p className="mt-2 text-sm">{f.line}</p>
          <p className="mt-1 text-sm text-sage">잘 맞는 부위 · {f.bestFor}</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {f.traits.map((t) => (
              <Badge key={t} tone="sage">
                {t}
              </Badge>
            ))}
          </ul>
          <p className="mt-3 text-sm text-muted">{f.diff}</p>
        </li>
      ))}
    </ul>
  );
}
