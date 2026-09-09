import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { CalendarDays, ClipboardList, Home, Images, Layers, ScanFace, Sparkles } from "lucide-react";
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

function isActive(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  if (to === "/charts") return pathname === "/charts" || pathname.startsWith("/patients");
  return pathname === to || pathname.startsWith(`${to}/`);
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-dvh bg-bg text-ink">
      <aside className="sticky top-0 flex h-dvh w-16 shrink-0 flex-col border-r border-border bg-surface md:w-52">
        <Link to="/" className="flex flex-col items-center px-2 py-5 md:items-start md:px-5">
          <span className="font-display text-2xl leading-none tracking-wide text-sage md:hidden">A</span>
          <span className="hidden font-display text-2xl leading-none tracking-wide text-sage md:block">AURA</span>
          <span className="mt-1 hidden text-[11px] text-muted md:block">원내 차트</span>
        </Link>
        <nav className="flex flex-1 flex-col gap-1 px-2 pb-4 md:px-3">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.to);
            const className = cn(
              "flex h-11 items-center justify-center gap-2 rounded-md px-0 text-sm transition-colors md:justify-start md:px-3",
              active ? "bg-sage-soft text-sage" : "text-muted hover:bg-surface-2 hover:text-ink",
            );
            const inner = (
              <>
                <Icon className="size-4 shrink-0" />
                <span className="hidden md:inline">{item.label}</span>
                <span className="sr-only md:hidden">{item.label}</span>
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
        </nav>
      </aside>
      <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8">
        <div className="mx-auto w-full max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
