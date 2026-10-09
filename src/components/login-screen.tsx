import { GROK_PROVIDERS, signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";

export function LoginScreen() {
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
          <div className="mt-3 grid gap-2">
            {GROK_PROVIDERS.map((provider) => (
              <Button
                key={provider.providerId}
                variant="outline"
                onClick={() => signIn(provider.providerId, { callbackURL: "/" })}
              >
                {provider.label}로 계속
              </Button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
