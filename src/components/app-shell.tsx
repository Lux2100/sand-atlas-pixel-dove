import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { CalendarDays, ClipboardList, Ellipsis, Home, Images, Layers, ScanFace, Sparkles, Users } from "lucide-react";
import { AccountBar, useStaffAccess } from "@/components/access-gate";
import { authEnabled } from "@/lib/auth/client";
import { useClinicStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "홈", icon: Home },
  { to: "/charts", label: "차트", icon: ClipboardList },
  { to: "/reservations", label: "예약", icon: CalendarDays },
  { to: "/treatments", label: "시술", icon: Sparkles },
  { to: "/events", label: "세트", icon: Layers },
  { to: "/gallery", label: "전후 사진", icon: Images },
  { to: "/analyze", label: "AI상담", icon: ScanFace },
] as const;

const TABS = [
  { to: "/", label: "홈", icon: Home },
  { to: "/charts", label: "차트", icon: ClipboardList },
  { to: "/reservations", label: "예약", icon: CalendarDays },
  { to: "/treatments", label: "시술", icon: Sparkles },
] as const;

const MORE = [
  { to: "/events", label: "세트", icon: Layers },
  { to: "/gallery", label: "전후 사진", icon: Images },
  { to: "/analyze", label: "AI상담", icon: ScanFace },
] as const;

function isActive(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  if (to === "/charts") return pathname === "/charts" || pathname.startsWith("/patients");
  return pathname === to || pathname.startsWith(`${to}/`);
}

function ScratchNote({ id }: { id: string }) {
  const note = useClinicStore((s) => s.scratchNote);
  const setScratchNote = useClinicStore((s) => s.setScratchNote);
  return (
    <div className="grid gap-1">
      <label htmlFor={id} className="px-1 text-xs text-muted">
        간단 메모
      </label>
      <textarea
        id={id}
        value={note}
        onChange={(e) => setScratchNote(e.target.value)}
        placeholder="접수 · 전달사항"
        className="h-28 w-full resize-none rounded-md border border-border bg-surface-2 px-2.5 py-2 text-sm text-ink outline-none placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-ring/40"
      />
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [more, setMore] = useState(false);
  const access = useStaffAccess();
  const showStaff =
    authEnabled && (access.role === "director" || (access.allowed && !access.configured));
  const moreActive = MORE.some((item) => isActive(pathname, item.to)) || (showStaff && isActive(pathname, "/staff"));

  return (
    <div className="flex min-h-dvh bg-bg text-ink">
      <aside className="sticky top-0 hidden h-dvh w-16 shrink-0 flex-col border-r border-border bg-surface sm:flex md:w-52">
        <Link to="/" className="flex flex-col items-center px-2 py-5 md:items-start md:px-5">
          <span className="font-display text-2xl leading-none tracking-wide text-sage md:hidden">A</span>
          <span className="hidden font-display text-2xl leading-none tracking-wide text-sage md:block">AURA</span>
          <span className="mt-1 hidden text-xs text-muted md:block">원내 차트</span>
        </Link>
        <nav className="flex flex-col gap-1 px-2 pb-2 md:px-3">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.to);
            const className = cn(
              "flex h-11 items-center justify-center gap-2 rounded-md px-0 text-sm transition-colors md:justify-start md:px-3",
              active ? "bg-sage-soft text-sage" : "text-muted hover:bg-surface-2 hover:text-ink",
            );
            const inner = (
              <>
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                <span className="sr-only md:not-sr-only md:inline">{item.label}</span>
              </>
            );
            if (item.to === "/analyze") {
              return (
                <Link key={item.to} to="/analyze" search={{}} className={className}>
                  {inner}
                </Link>
              );
            }
            return (
              <Link key={item.to} to={item.to} className={className}>
                {inner}
              </Link>
            );
          })}
          {showStaff ? (
            <Link
              to="/staff"
              className={cn(
                "flex h-11 items-center justify-center gap-2 rounded-md px-0 text-sm transition-colors md:justify-start md:px-3",
                isActive(pathname, "/staff") ? "bg-sage-soft text-sage" : "text-muted hover:bg-surface-2 hover:text-ink",
              )}
            >
              <Users className="size-4 shrink-0" aria-hidden="true" />
              <span className="sr-only md:not-sr-only md:inline">직원 관리</span>
            </Link>
          ) : null}
        </nav>
        <div className="hidden min-h-0 flex-1 flex-col px-3 pb-4 md:flex">
          <ScratchNote id="scratch-note" />
        </div>
      </aside>
      <main className="min-w-0 flex-1 overflow-x-hidden px-4 pt-6 pb-24 sm:pb-6 md:px-8 md:py-8">
        <div className="mx-auto w-full max-w-5xl">
          <AccountBar />
          {children}
        </div>
      </main>
      {more ? (
        <div className="fixed inset-x-0 bottom-16 z-40 max-h-[70dvh] overflow-y-auto border-t border-border bg-surface px-4 py-4 shadow-card sm:hidden">
          <div className="grid gap-2">
            {MORE.map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.to);
              const className = cn(
                "flex h-11 items-center gap-2 rounded-md px-3 text-sm",
                active ? "bg-sage-soft text-sage" : "text-ink hover:bg-surface-2",
              );
              const inner = (
                <>
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  {item.label}
                </>
              );
              if (item.to === "/analyze") {
                return (
                  <Link key={item.to} to="/analyze" search={{}} className={className} onClick={() => setMore(false)}>
                    {inner}
                  </Link>
                );
              }
              return (
                <Link key={item.to} to={item.to} className={className} onClick={() => setMore(false)}>
                  {inner}
                </Link>
              );
            })}
            {showStaff ? (
              <Link
                to="/staff"
                className={cn(
                  "flex h-11 items-center gap-2 rounded-md px-3 text-sm",
                  isActive(pathname, "/staff") ? "bg-sage-soft text-sage" : "text-ink hover:bg-surface-2",
                )}
                onClick={() => setMore(false)}
              >
                <Users className="size-4 shrink-0" aria-hidden="true" />
                직원 관리
              </Link>
            ) : null}
          </div>
          <div className="mt-4">
            <ScratchNote id="scratch-note-mobile" />
          </div>
        </div>
      ) : null}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] sm:hidden">
        <div className="grid grid-cols-5">
          {TABS.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.to);
            const className = cn(
              "flex h-16 flex-col items-center justify-center gap-1 text-xs",
              active ? "text-sage" : "text-muted",
            );
            const inner = (
              <>
                <Icon className="size-4" aria-hidden="true" />
                {item.label}
              </>
            );
            return (
              <Link key={item.to} to={item.to} className={className} onClick={() => setMore(false)}>
                {inner}
              </Link>
            );
          })}
          <button
            type="button"
            className={cn(
              "flex h-16 flex-col items-center justify-center gap-1 text-xs",
              more || moreActive ? "text-sage" : "text-muted",
            )}
            onClick={() => setMore((open) => !open)}
          >
            <Ellipsis className="size-4" aria-hidden="true" />
            더보기
          </button>
        </div>
      </nav>
    </div>
  );
}