import { useState } from "react";
import { GROK_PROVIDERS, signIn } from "@/lib/auth/client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function inLivePreview() {
  const host = window.location.hostname;
  return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}

function explainSignIn(message: string) {
  if (/pop-up blocked/i.test(message)) {
    return "로그인 창이 차단되었습니다. 브라우저에서 팝업을 허용한 뒤 다시 눌러 주세요.";
  }
  if (/cancelled or failed/i.test(message)) {
    return "로그인이 취소되었거나 완료되지 않았습니다. 다시 눌러 주세요.";
  }
  return "로그인에 실패했습니다. 잠시 후 다시 눌러 주세요.";
}

export function LoginScreen() {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function fail(message: string) {
    setBusyId(null);
    setStatus(null);
    setError(explainSignIn(message));
  }

  function start(event: React.MouseEvent<HTMLAnchorElement>, providerId: string) {
    const preview = inLivePreview() || window.self !== window.top;
    setError(null);
    setBusyId(providerId);
    if (!preview) {
      event.preventDefault();
      setStatus("로그인 페이지로 이동하는 중입니다.");
      void signIn(providerId, { callbackURL: "/" }).catch((err: unknown) => {
        fail(err instanceof Error ? err.message : "");
      });
      return;
    }
    // Let the link navigate the whole window. A popup never leaves this
    // preview, so the login page has to replace the current tab.
    setStatus("로그인 페이지로 이동하는 중입니다.");
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-bg px-6 text-ink">
      <div className="grid w-full max-w-sm gap-6 text-center">
        <div>
          <p className="font-display text-4xl tracking-wide text-sage">AURA</p>
          <p className="mt-1 text-sm text-muted">원내 차트</p>
        </div>
        <div className="grid gap-2 rounded-xl border border-border bg-surface p-5 text-left shadow-card">
          <h1 className="font-display text-3xl tracking-tight">로그인</h1>
          <p className="text-sm text-muted">초대된 이메일만 들어올 수 있습니다. 누르면 이 창이 로그인 페이지로 바뀝니다.</p>
          {status ? <p className="text-sm text-ink">{status}</p> : null}
          {error ? (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          ) : null}
          <div className="mt-3 grid gap-2">
            {GROK_PROVIDERS.map((provider) => (
              <a
                key={provider.providerId}
                className={cn(buttonVariants({ variant: "outline" }), "w-full")}
                href={`/auth/popup?providerId=${encodeURIComponent(provider.providerId)}`}
                target="_top"
                onClick={(event) => start(event, provider.providerId)}
              >
                {busyId === provider.providerId ? "이동 중…" : `${provider.label}로 계속`}
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
