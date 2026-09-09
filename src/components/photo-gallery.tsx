import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { formatDate, todayISO } from "@/lib/format";
import { compressImage } from "@/lib/photo";
import { useClinicStore } from "@/lib/store";
import type { Photo, PhotoKind, Showcase } from "@/lib/types";
import { cn, uid } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const KIND_LABEL: Record<PhotoKind, string> = {
  before: "시술 전",
  after: "시술 후",
  other: "기타",
};

const KIND_ORDER: Record<PhotoKind, number> = { before: 0, after: 1, other: 2 };

type ViewFilter = "all" | "before" | "after";

type GalleryProps = {
  patientId: string;
  patientName?: string;
};

function SafeImg({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setFailed(false);
  }, [src]);
  if (!src || src.startsWith("blob:") || failed) {
    return (
      <div className={cn("flex items-center justify-center bg-surface-2 px-3 text-center text-xs text-muted", className)}>
        사진을 불러올 수 없습니다
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />;
}

function dateKey(iso?: string) {
  const k = (iso ?? "").slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(k) ? k : "";
}

function formatPhotoDate(iso?: string) {
  const k = dateKey(iso);
  return k ? formatDate(k, "M월 d일") : "날짜 없음";
}

function groupPhotos(photos: Photo[]) {
  const map = new Map<string, Photo[]>();
  for (const p of photos) {
    const k = dateKey(p.takenAt);
    const arr = map.get(k);
    if (arr) arr.push(p);
    else map.set(k, [p]);
  }
  for (const arr of map.values()) {
    arr.sort((a, b) => KIND_ORDER[a.kind] - KIND_ORDER[b.kind] || a.id.localeCompare(b.id));
  }
  return [...map.entries()].sort((a, b) => (b[0] || "0000").localeCompare(a[0] || "0000"));
}

export function PhotoGallery({ patientId, patientName }: GalleryProps) {
  const photosAll = useClinicStore((s) => s.photos);
  const showcasesAll = useClinicStore((s) => s.showcases);
  const photos = useMemo(() => photosAll.filter((p) => p.patientId === patientId), [photosAll, patientId]);
  const showcases = useMemo(() => showcasesAll.filter((s) => s.patientId === patientId), [showcasesAll, patientId]);
  const addPhoto = useClinicStore((s) => s.addPhoto);
  const updatePhoto = useClinicStore((s) => s.updatePhoto);
  const removePhoto = useClinicStore((s) => s.removePhoto);
  const addShowcase = useClinicStore((s) => s.addShowcase);
  const removeShowcase = useClinicStore((s) => s.removeShowcase);
  const fileRef = useRef<HTMLInputElement>(null);
  const [filter, setFilter] = useState<ViewFilter>("all");
  const [kind, setKind] = useState<PhotoKind>("before");
  const [takenAt, setTakenAt] = useState(todayISO());
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [viewId, setViewId] = useState<string | undefined>();
  const [compareOpen, setCompareOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Photo | undefined>();

  const uploadKind: PhotoKind = filter === "all" ? kind : filter;

  const visible = useMemo(
    () => (filter === "all" ? photos : photos.filter((p) => p.kind === filter)),
    [photos, filter],
  );
  const grouped = useMemo(() => groupPhotos(visible), [visible]);

  const picked = useMemo(
    () => selected.map((id) => photos.find((p) => p.id === id)).filter((p): p is Photo => Boolean(p)),
    [selected, photos],
  );
  const view = viewId ? (photos.find((p) => p.id === viewId) ?? undefined) : undefined;

  const toggle = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  const upload = async (files: File[]) => {
    setBusy(true);
    let failed = 0;
    const date = dateKey(takenAt) || todayISO();
    try {
      for (const file of files.slice(0, 8)) {
        try {
          const url = await compressImage(file);
          addPhoto({ patientId, kind: uploadKind, url, takenAt: date });
        } catch {
          failed += 1;
        }
      }
      if (failed) toast.error("일부 사진을 읽지 못했습니다. JPG 또는 PNG로 올려 주세요.");
    } finally {
      setBusy(false);
    }
  };

  const pin = () => {
    if (picked.length < 2) return;
    const before = picked.find((p) => p.kind === "before") ?? picked[0];
    const after = picked.find((p) => p.kind === "after" && p.id !== before.id) ?? picked.find((p) => p.id !== before.id);
    if (!after) return;
    addShowcase({
      id: uid("s"),
      patientId,
      title: patientName ? `${patientName} 전후` : "전후",
      treatments: [],
      beforePhotoId: before.id,
      afterPhotoId: after.id,
    });
    setSelected([]);
    setCompareOpen(false);
  };

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {([
          ["all", "전체"],
          ["before", "시술 전"],
          ["after", "시술 후"],
        ] as const).map(([id, label]) => (
          <Button
            key={id}
            size="sm"
            variant={filter === id ? "default" : "outline"}
            onClick={() => {
              setFilter(id);
              if (id !== "all") setKind(id);
            }}
          >
            {label}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap items-end gap-2">
        {filter === "all" ? (
          <div className="flex gap-1">
            {(["before", "after"] as const).map((k) => (
              <Button key={k} size="sm" variant={kind === k ? "soft" : "ghost"} onClick={() => setKind(k)}>
                {KIND_LABEL[k]}
              </Button>
            ))}
          </div>
        ) : null}
        <div className="grid gap-1">
          <Label htmlFor="photo-date">촬영일</Label>
          <Input
            id="photo-date"
            type="date"
            value={dateKey(takenAt) || todayISO()}
            onChange={(e) => setTakenAt(e.target.value)}
            className="h-10 w-40"
          />
        </div>
        <Button size="sm" variant="outline" disabled={busy} onClick={() => fileRef.current?.click()}>
          {busy ? "올리는 중…" : "사진 추가"}
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            e.target.value = "";
            if (files.length) void upload(files);
          }}
        />
        {picked.length >= 2 ? (
          <>
            <Button size="sm" onClick={() => setCompareOpen(true)}>
              {picked.length}장 비교 보기
            </Button>
            <Button size="sm" variant="soft" onClick={pin}>
              전후 고정
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelected([])}>
              선택 해제
            </Button>
          </>
        ) : (
          <p className="pb-1 text-xs text-muted">최대 3장까지 선택해 크게 비교할 수 있습니다.</p>
        )}
      </div>

      {visible.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
          {filter === "before" ? "시술 전 사진이 없습니다." : filter === "after" ? "시술 후 사진이 없습니다." : "아직 사진이 없습니다."}
        </p>
      ) : (
        <div className="grid gap-6">
          {grouped.map(([day, rows]) => (
            <section key={day || "none"} className="grid gap-2">
              <h3 className="text-sm font-medium text-ink">{formatPhotoDate(day)}</h3>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {rows.map((p) => {
                  const on = selected.includes(p.id);
                  return (
                    <li key={p.id} className={`overflow-hidden rounded-lg border ${on ? "border-sage" : "border-border"}`}>
                      <button type="button" className="block w-full" onClick={() => setViewId(p.id)}>
                        <SafeImg src={p.url} alt="" className="aspect-square w-full object-cover" />
                      </button>
                      <div className="grid gap-1 px-2 py-1.5">
                        <div className="flex items-center justify-between gap-1">
                          <Badge tone={p.kind === "other" ? "default" : "sage"}>{KIND_LABEL[p.kind]}</Badge>
                          <span className="text-xs tabular-nums text-muted">{formatPhotoDate(p.takenAt)}</span>
                        </div>
                        <div className="flex justify-end gap-2">
                          <button type="button" className="text-xs text-sage" onClick={() => toggle(p.id)}>
                            {on ? "선택됨" : "선택"}
                          </button>
                          <button type="button" className="text-xs text-danger" onClick={() => setPendingDelete(p)}>
                            삭제
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}

      {showcases.length > 0 ? (
        <div className="grid gap-2">
          <p className="text-sm font-medium">고정된 전후</p>
          {showcases.map((s) => (
            <ShowcaseCard
              key={s.id}
              showcase={s}
              photos={photos}
              onRemove={() => removeShowcase(s.id)}
            />
          ))}
        </div>
      ) : null}

      <Dialog open={Boolean(view)} onOpenChange={(v) => !v && setViewId(undefined)}>
        <DialogContent title={view ? KIND_LABEL[view.kind] : "사진"} className="max-w-2xl">
          {view ? (
            <div className="mt-4 grid gap-3">
              <SafeImg src={view.url} alt="" className="max-h-[70dvh] w-full rounded-lg object-contain" />
              <div className="grid gap-1.5">
                <Label htmlFor="view-photo-date">촬영일</Label>
                <Input
                  id="view-photo-date"
                  type="date"
                  value={dateKey(view.takenAt) || ""}
                  onChange={(e) => updatePhoto(view.id, { takenAt: e.target.value || view.takenAt })}
                  className="h-10 w-40"
                />
              </div>
              {view.note ? <p className="text-sm text-muted">{view.note}</p> : null}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={compareOpen && picked.length >= 2}
        onOpenChange={(v) => {
          if (!v) setCompareOpen(false);
        }}
      >
        <DialogContent
          title={`${picked.length}장 비교`}
          className="w-full max-w-6xl"
        >
          <div className={`mt-4 grid gap-2 ${picked.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
            {picked.map((p) => (
              <figure key={p.id} className="min-w-0">
                <SafeImg src={p.url} alt="" className="max-h-[72dvh] w-full rounded-lg object-contain" />
                <figcaption className="mt-2 text-center text-xs text-muted">
                  {KIND_LABEL[p.kind]} · {formatPhotoDate(p.takenAt)}
                </figcaption>
              </figure>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(pendingDelete)} onOpenChange={(v) => !v && setPendingDelete(undefined)}>
        <DialogContent title="사진 삭제">
          <p className="mt-3 text-sm text-muted">이 사진을 삭제할까요? 삭제하면 되돌릴 수 없습니다.</p>
          {pendingDelete ? (
            <SafeImg src={pendingDelete.url} alt="" className="mt-4 max-h-40 w-full rounded-lg object-contain" />
          ) : null}
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setPendingDelete(undefined)}>
              닫기
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (!pendingDelete) return;
                const id = pendingDelete.id;
                removePhoto(id);
                setSelected((prev) => prev.filter((x) => x !== id));
                if (viewId === id) setViewId(undefined);
                setPendingDelete(undefined);
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

export function ShowcaseStrip() {
  const showcases = useClinicStore((s) => s.showcases);
  const photos = useClinicStore((s) => s.photos);
  const patients = useClinicStore((s) => s.patients);

  if (showcases.length === 0) {
    return <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted">차트에서 전후 사진을 고정하면 여기에 모입니다.</p>;
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {showcases.map((s) => {
        const patient = patients.find((p) => p.id === s.patientId);
        return (
          <li key={s.id}>
            <ShowcaseCard
              showcase={s}
              photos={photos}
              caption={patient ? `${patient.name} · ${patient.chartNo || "번호 없음"}` : s.title}
              href={s.patientId}
            />
          </li>
        );
      })}
    </ul>
  );
}

function ShowcaseCard({
  showcase,
  photos,
  caption,
  href,
  onRemove,
}: {
  showcase: Showcase;
  photos: Photo[];
  caption?: string;
  href?: string;
  onRemove?: () => void;
}) {
  const before = photos.find((p) => p.id === showcase.beforePhotoId);
  const after = photos.find((p) => p.id === showcase.afterPhotoId);
  const body = (
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
      <div className="grid grid-cols-2">
        <figure>
          <SafeImg src={before?.url} alt="" className="aspect-[4/5] w-full object-cover" />
          <figcaption className="px-2 py-1 text-center text-xs text-muted">시술 전</figcaption>
        </figure>
        <figure>
          <SafeImg src={after?.url} alt="" className="aspect-[4/5] w-full object-cover" />
          <figcaption className="px-2 py-1 text-center text-xs text-muted">시술 후</figcaption>
        </figure>
      </div>
      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{caption ?? showcase.title}</p>
          {showcase.treatments.length ? <p className="truncate text-xs text-sage">{showcase.treatments.join(" · ")}</p> : null}
        </div>
        {onRemove ? (
          <button type="button" className="shrink-0 text-xs text-muted hover:text-danger" onClick={onRemove}>
            해제
          </button>
        ) : null}
      </div>
    </div>
  );
  if (href) {
    return (
      <Link to="/patients/$id" params={{ id: href }} className="block">
        {body}
      </Link>
    );
  }
  return body;
}
