import { createFileRoute } from "@tanstack/react-router";
import { ShowcaseStrip } from "@/components/photo-gallery";

export const Route = createFileRoute("/gallery")({ component: GalleryPage });

function GalleryPage() {
  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs text-muted">전후 사진</p>
        <h1 className="font-display text-4xl tracking-tight">사진 전후 기록</h1>
        <p className="mt-2 text-sm text-muted">차트에서 고른 전후 사진이 여기에 모입니다.</p>
      </div>
      <ShowcaseStrip />
    </div>
  );
}
