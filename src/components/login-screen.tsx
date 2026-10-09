import { useState } from "react";
import { GROK_PROVIDERS, signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";

const BEARER_KEY = "grok-auth.bearer-token";

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

function waitForPopupToken(popup: Window): Promise<string | null> {
  return new Promise((resolve) => {
    const origin = window.location.origin;
    let settled = false;
    let closeTimer: number | undefined;
    const finish = (token: string | null) => {
      if (settled) return;
      settled = true;
      window.clearInterval(pollTimer);
      if (closeTimer !== undefined) window.clearTimeout(closeTimer);
      window.removeEventListener("message", onMessage);
      resolve(token);
    };
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== origin) return;
      const data = event.data as { source?: string; token?: string | null } | null;
      if (!data || data.source !== "grok-auth-popup") return;
      finish(data.token ?? null);
    };
    const pollTimer = window.setInterval(() => {
      if (!popup.closed) return;
      window.clearInterval(pollTimer);
      closeTimer = window.setTimeout(() => finish(null), 400);
    }, 300);
    window.addEventListener("message", onMessage);
  });
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

  function start(providerId: string) {
    setError(null);
    setBusyId(providerId);

    const embedded = window.self !== window.top;
    const live = inLivePreview();

    // Inside a frame that is not the sandbox preview, a full-page Google
    // redirect is refused and the click looks dead. Open the preview popup
    // ourselves and keep this frame put.
    if (embedded && !live) {
      setStatus("로그인 창을 여는 중입니다. 따로 열린 창에서 계속해 주세요.");
      const popup = window.open(
        `${window.location.origin}/auth/popup?providerId=${encodeURIComponent(providerId)}`,
        `aura-signin-${Date.now()}`,
        "popup,width=500,height=650",
      );
      if (!popup) {
        fail("Pop-up blocked");
        return;
      }
      try {
        window.sessionStorage.removeItem(BEARER_KEY);
      } catch {
        /* ignore */
      }
      void waitForPopupToken(popup)
        .then((token) => {
          if (!token) throw new Error("Sign-in was cancelled or failed");
          window.sessionStorage.setItem(BEARER_KEY, token);
          window.location.assign("/");
        })
        .catch((err: unknown) => {
          fail(err instanceof Error ? err.message : "");
        });
      return;
    }

    setStatus(
      live
        ? "로그인 창을 여는 중입니다. 따로 열린 창에서 계속해 주세요."
        : "로그인 페이지로 이동하는 중입니다.",
    );
    try {
      void signIn(providerId, { callbackURL: "/" }).catch((err: unknown) => {
        fail(err instanceof Error ? err.message : "");
      });
    } catch (err: unknown) {
      fail(err instanceof Error ? err.message : "");
    }
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
          <p className="text-sm text-muted">초대된 이메일만 들어올 수 있습니다.</p>
          {status ? <p className="text-sm text-ink">{status}</p> : null}
          {error ? (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          ) : null}
          <div className="mt-3 grid gap-2">
            {GROK_PROVIDERS.map((provider) => (
              <Button
                key={provider.providerId}
                type="button"
                variant="outline"
                disabled={busyId !== null}
                onClick={() => start(provider.providerId)}
              >
                {busyId === provider.providerId ? "여는 중…" : `${provider.label}로 계속`}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
