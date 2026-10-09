import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <div className="mx-auto grid max-w-md gap-3 py-16 text-center">
      <h1 className="font-display text-4xl tracking-tight">페이지를 찾을 수 없어요</h1>
      <p className="text-sm text-muted">주소가 바뀌었거나 삭제된 페이지예요.</p>
      <div>
        <Button asChild>
          <Link to="/">홈으로 가기</Link>
        </Button>
      </div>
    </div>
  );
}
