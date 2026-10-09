import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { inviteStaff, listAccessLog, listStaff, setStaffRole, setStaffStatus, type AccessLogRow, type StaffRow } from "@/lib/staff-api";
import { useStaffAccess } from "@/components/access-gate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/staff")({ component: StaffPage });

function StaffPage() {
  const access = useStaffAccess();
  const [rows, setRows] = useState<StaffRow[]>([]);
  const [logs, setLogs] = useState<AccessLogRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"manager" | "staff">("staff");
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    if (access.role !== "director") return;
    void Promise.all([listStaff(), listAccessLog()])
      .then(([staff, log]) => {
        setRows(staff);
        setLogs(log);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "직원 목록을 불러오지 못했습니다.");
      });
  }, [access.role]);

  useEffect(() => {
    load();
  }, [load]);

  if (!access.configured) {
    return (
      <div className="grid gap-3">
        <h1 className="font-display text-4xl tracking-tight">직원 관리</h1>
        <p className="max-w-xl text-sm text-muted">
          원장 계정은 하나뿐입니다. 지금 로그인한 이메일을 환경 변수 DIRECTOR_EMAIL로 지정하면 그 계정이 원장이 됩니다.
        </p>
        <p className="text-sm">{access.email}</p>
      </div>
    );
  }

  if (access.role !== "director") {
    return (
      <div className="grid gap-3">
        <h1 className="font-display text-4xl tracking-tight">직원 관리</h1>
        <p className="text-sm text-muted">원장만 볼 수 있습니다.</p>
      </div>
    );
  }

  const invite = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await inviteStaff({ data: { email, role } });
      if (!res.ok) setError(res.error);
      else {
        setEmail("");
        load();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "초대에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  };

  const changeRole = async (row: StaffRow, next: "manager" | "staff") => {
    const res = await setStaffRole({ data: { email: row.email, role: next } });
    if (!res.ok) setError(res.error);
    else load();
  };

  const changeStatus = async (row: StaffRow) => {
    const res = await setStaffStatus({
      data: { email: row.email, status: row.status === "suspended" ? "active" : "suspended" },
    });
    if (!res.ok) setError(res.error);
    else load();
  };

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs text-muted">권한</p>
        <h1 className="font-display text-4xl tracking-tight">직원 관리</h1>
      </div>

      <form
        className="grid gap-3 rounded-xl border border-border bg-surface p-4 sm:grid-cols-[1fr_8rem_auto] sm:items-end"
        onSubmit={(e) => {
          e.preventDefault();
          void invite();
        }}
      >
        <label className="grid gap-1 text-xs text-muted">
          이메일
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="staff@clinic.kr" required />
        </label>
        <label className="grid gap-1 text-xs text-muted">
          역할
          <select
            value={role}
            onChange={(e) => setRole(e.target.value === "manager" ? "manager" : "staff")}
            className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm text-ink"
          >
            <option value="manager">실장</option>
            <option value="staff">직원</option>
          </select>
        </label>
        <Button type="submit" disabled={busy}>
          초대
        </Button>
      </form>
      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <div className="min-w-0 max-w-full overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="text-xs text-muted">
            <tr className="border-b border-border">
              <th className="px-3 py-2 font-medium">이름</th>
              <th className="px-3 py-2 font-medium">이메일</th>
              <th className="px-3 py-2 font-medium">역할</th>
              <th className="px-3 py-2 font-medium">마지막 접속</th>
              <th className="px-3 py-2 font-medium">상태</th>
              <th className="px-3 py-2 font-medium"> </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.email} className="border-b border-border last:border-0">
                <td className="px-3 py-2">{row.name}</td>
                <td className="px-3 py-2 text-muted">{row.email}</td>
                <td className="px-3 py-2">
                  {row.self || row.role === "director" ? (
                    row.roleLabel
                  ) : (
                    <select
                      value={row.role}
                      onChange={(e) => void changeRole(row, e.target.value === "manager" ? "manager" : "staff")}
                      className="h-8 rounded-md border border-border bg-surface px-2 text-xs"
                      aria-label={`${row.email} 역할`}
                    >
                      <option value="manager">실장</option>
                      <option value="staff">직원</option>
                    </select>
                  )}
                </td>
                <td className="px-3 py-2 tabular-nums text-muted">
                  {row.lastSeenAt ? formatDate(row.lastSeenAt, "M월 d일 HH:mm") : "아직 없음"}
                </td>
                <td className="px-3 py-2">{row.status === "suspended" ? "정지" : "사용 중"}</td>
                <td className="px-3 py-2 text-right">
                  {row.self || row.role === "director" ? null : (
                    <Button size="sm" variant={row.status === "suspended" ? "outline" : "ghost"} className={row.status === "suspended" ? "" : "text-danger hover:text-danger"} onClick={() => void changeStatus(row)}>
                      {row.status === "suspended" ? "정지 해제" : "정지"}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="grid gap-3">
        <h2 className="text-sm font-medium">접근 기록</h2>
        {logs.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted">아직 기록이 없습니다.</p>
        ) : (
          <ul className="grid gap-2">
            {logs.map((log) => (
              <li key={log.id} className="rounded-lg border border-border bg-surface px-3 py-2 text-sm">
                <span className="tabular-nums text-muted">{log.at ? formatDate(log.at, "M월 d일 HH:mm") : ""}</span>
                <span className="mx-2">{log.actorName}</span>
                <span>{log.detail}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
