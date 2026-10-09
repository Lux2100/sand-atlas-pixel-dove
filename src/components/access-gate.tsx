import { useContext, useEffect, useState, type ReactNode } from "react";
import { createContext } from "react";
import { authEnabled, signOut } from "@/lib/auth/client";
import { UserButton } from "@/lib/auth/gates";
import { hasGateSessionMarker } from "@/lib/auth/gate-session-marker";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMyAccess, type AccessView } from "@/lib/staff-api";
import { LoginScreen } from "@/components/login-screen";

type StaffAccess = AccessView & { ready: boolean };

const OPEN: StaffAccess = {
  ready: true,
  configured: false,
  allowed: true,
  role: null,
  roleLabel: "",
  name: "",
  email: "",
};

const StaffAccessContext = createContext<StaffAccess>(OPEN);

export function useStaffAccess() {
  return useContext(StaffAccessContext);
}

function BootScreen() {
  return (
    <main className="grid min-h-dvh place-items-center bg-bg">
      <p className="font-display text-4xl tracking-wide text-sage">AURA</p>
    </main>
  );
}

function Blocked({ access }: { access: StaffAccess }) {
  useEffect(() => {
    if (access.reason !== "suspended" || hasGateSessionMarker()) return;
    void signOut().catch(() => undefined);
  }, [access.reason]);

  const message =
    access.reason === "suspended"
      ? "이 계정은 정지되어 있습니다. 다시 들어올 수 없습니다."
      : access.reason === "unconfigured"
        ? "원장 이메일을 DIRECTOR_EMAIL 환경 변수로 지정해야 열 수 있습니다."
        : "초대된 이메일만 로그인할 수 있습니다.";

  return (
    <main className="grid min-h-dvh place-items-center bg-bg px-6 text-ink">
      <div className="grid w-full max-w-sm gap-4 text-center">
        <p className="font-display text-4xl tracking-wide text-sage">AURA</p>
        <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
          <h1 className="font-display text-3xl tracking-tight">들어올 수 없어요</h1>
          <p className="mt-2 text-sm text-muted">{message}</p>
          <div className="mt-4 flex justify-center [&_span.text-sm.font-medium]:sr-only">
            <UserButton />
          </div>
        </div>
      </div>
    </main>
  );
}

export function AccountBar() {
  const access = useStaffAccess();
  if (!authEnabled || !access.allowed || !access.name) return null;
  return (
    <div className="mb-4 flex items-center justify-end gap-2">
      <p className="min-w-0 truncate text-right text-sm">
        {access.name} · {access.roleLabel}
      </p>
      <div className="shrink-0 [&_span.text-sm.font-medium]:sr-only">
        <UserButton />
      </div>
    </div>
  );
}

export function AccessGate({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  const [access, setAccess] = useState<StaffAccess>(authEnabled ? { ...OPEN, ready: false, allowed: false } : OPEN);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authEnabled) return;
    if (isPending) return;
    if (!user) {
      setAccess({ ...OPEN, ready: true, allowed: false });
      return;
    }
    let stop = false;
    const tick = () => {
      void getMyAccess()
        .then((view) => {
          if (!stop) {
            setError(null);
            setAccess({ ...view, ready: true });
          }
        })
        .catch((err: unknown) => {
          const message = err instanceof Error ? err.message : "";
          if (!stop && message.includes("Unauthorized") && !hasGateSessionMarker()) {
            void signOut().catch(() => undefined);
            return;
          }
          if (!stop && message) setError(message);
        });
    };
    tick();
    const timer = window.setInterval(tick, 4000);
    const onFocus = () => tick();
    window.addEventListener("focus", onFocus);
    return () => {
      stop = true;
      window.clearInterval(timer);
      window.removeEventListener("focus", onFocus);
    };
  }, [isPending, user]);

  let body: ReactNode;
  if (!authEnabled) body = children;
  else if (error && !access.ready) {
    body = (
      <main className="grid min-h-dvh place-items-center bg-bg px-6">
        <p className="max-w-sm text-center text-sm text-danger">{error}</p>
      </main>
    );
  } else if (isPending || (user && !access.ready)) body = <BootScreen />;
  else if (!user) body = <LoginScreen />;
  else if (!access.allowed) body = <Blocked access={access} />;
  else body = children;

  return <StaffAccessContext.Provider value={access}>{body}</StaffAccessContext.Provider>;
}
