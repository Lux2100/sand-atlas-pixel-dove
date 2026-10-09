import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import {
  canManageTarget,
  decideAccess,
  displayPersonName,
  emailOk,
  inviteRole,
  normalizeEmail,
  ROLE_LABEL,
  type StaffRole,
  type StaffStatus,
} from "@/lib/staff";

export type StaffRow = {
  email: string;
  name: string;
  role: StaffRole;
  roleLabel: string;
  status: StaffStatus;
  lastSeenAt: string | null;
  self: boolean;
};

export type AccessView = {
  configured: boolean;
  allowed: boolean;
  reason?: "not-invited" | "suspended" | "unconfigured";
  role: StaffRole | null;
  roleLabel: string;
  name: string;
  email: string;
};

export type AccessLogRow = {
  id: string;
  at: string;
  actorName: string;
  actorEmail: string;
  action: string;
  detail: string;
};

type Caller = { id: string; email: string; name: string };

function directorEmail() {
  return normalizeEmail(process.env.DIRECTOR_EMAIL);
}

function stamp(value: unknown): string | null {
  if (value == null || value === "") return null;
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

async function callerOf(userId: string): Promise<Caller> {
  const sql = await getSql();
  const rows = await sql<{ name: string; email: string }>`
    select name, email from "user" where id = ${userId} limit 1
  `;
  const row = rows[0];
  if (!row?.email) {
    const { UnauthorizedError } = await import("@/lib/auth/verify.server");
    throw new UnauthorizedError();
  }
  return { id: userId, email: normalizeEmail(row.email), name: row.name.trim() };
}

async function writeLog(input: {
  actorEmail: string;
  actorName: string;
  action: string;
  targetEmail?: string;
  detail: string;
}) {
  const sql = await getSql();
  await sql`
    insert into access_log (id, actor_email, actor_name, action, target_email, detail)
    values (${crypto.randomUUID()}, ${input.actorEmail}, ${input.actorName}, ${input.action}, ${input.targetEmail ?? null}, ${input.detail})
  `;
}

async function ensureDirector(caller: Caller) {
  const sql = await getSql();
  const name = displayPersonName("", caller.email, caller.name);
  await sql`
    insert into staff_member (email, name, role, status, user_id, last_seen_at)
    values (${caller.email}, ${name}, 'director', 'active', ${caller.id}, now())
    on conflict (email) do update set
      role = 'director',
      status = 'active',
      user_id = ${caller.id},
      name = case when staff_member.name = '' then ${name} else staff_member.name end
  `;
}

async function touchSeen(email: string, userId: string, sessionName: string) {
  const sql = await getSql();
  const rows = await sql<{ last_seen_at: unknown; name: string }>`
    select last_seen_at, name from staff_member where email = ${email} limit 1
  `;
  const prev = stamp(rows[0]?.last_seen_at);
  const stale = !prev || Date.now() - new Date(prev).getTime() > 30 * 60 * 1000;
  const due = !prev || Date.now() - new Date(prev).getTime() > 60 * 1000;
  if (due) {
    const name = displayPersonName(rows[0]?.name ?? "", email, sessionName);
    await sql`
      update staff_member
      set last_seen_at = now(),
          user_id = ${userId},
          name = case when name = '' then ${name} else name end
      where email = ${email}
    `;
  }
  if (stale) {
    const actorName = displayPersonName(rows[0]?.name ?? "", email, sessionName);
    await writeLog({
      actorEmail: email,
      actorName,
      action: "login",
      targetEmail: email,
      detail: "로그인",
    });
  }
}

export const getMyAccess = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<AccessView> => {
    const caller = await callerOf(context.userId);
    const director = directorEmail();
    const deployed = Boolean(process.env.GROK_PROJECT_ID?.trim() || process.env.DATABASE_URL?.trim());
    if (!director && deployed) {
      return {
        configured: false,
        allowed: false,
        reason: "unconfigured",
        role: null,
        roleLabel: "",
        name: displayPersonName("", caller.email, caller.name),
        email: caller.email,
      };
    }
    const sql = await getSql();
    const rows = await sql<{ role: string; status: string; name: string }>`
      select role, status, name from staff_member where email = ${caller.email} limit 1
    `;
    const decision = decideAccess({
      directorEmail: director,
      userEmail: caller.email,
      staff: rows[0] ?? null,
    });
    const name = displayPersonName(rows[0]?.name ?? "", caller.email, caller.name);
    if (decision.allowed && decision.role === "director") {
      await ensureDirector(caller);
      await touchSeen(caller.email, caller.id, caller.name);
    } else if (decision.allowed && decision.role) {
      await touchSeen(caller.email, caller.id, caller.name);
    }
    return {
      configured: decision.configured,
      allowed: decision.allowed,
      reason: decision.reason,
      role: decision.role,
      roleLabel: decision.roleLabel,
      name,
      email: caller.email,
    };
  });

async function requireDirector(userId: string) {
  const caller = await callerOf(userId);
  if (!caller.email || caller.email !== directorEmail()) {
    throw new Error("원장만 볼 수 있습니다.");
  }
  await ensureDirector(caller);
  return caller;
}

export const listStaff = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<StaffRow[]> => {
    const caller = await requireDirector(context.userId);
    const sql = await getSql();
    const rows = await sql<{
      email: string;
      name: string;
      role: StaffRole;
      status: StaffStatus;
      last_seen_at: unknown;
    }>`
      select email, name, role, status, last_seen_at
      from staff_member
      order by case role when 'director' then 0 when 'manager' then 1 else 2 end, email
    `;
    return rows.map((row) => ({
      email: row.email,
      name: row.name.trim() ? row.name : "—",
      role: row.role,
      roleLabel: ROLE_LABEL[row.role],
      status: row.status,
      lastSeenAt: stamp(row.last_seen_at),
      self: row.email === caller.email,
    }));
  });

export const listAccessLog = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<AccessLogRow[]> => {
    await requireDirector(context.userId);
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      at: unknown;
      actor_name: string;
      actor_email: string;
      action: string;
      detail: string;
    }>`
      select id, at, actor_name, actor_email, action, detail
      from access_log
      order by at desc
      limit 100
    `;
    return rows.map((row) => ({
      id: row.id,
      at: stamp(row.at) ?? "",
      actorName: row.actor_name || row.actor_email,
      actorEmail: row.actor_email,
      action: row.action,
      detail: row.detail,
    }));
  });

export const inviteStaff = createServerFn({ method: "POST" })
  .validator((input: { email?: string; role?: string }) => ({
    email: normalizeEmail(input.email),
    role: inviteRole(input.role ?? ""),
  }))
  .middleware([authMiddleware])
  .handler(async ({ context, data }): Promise<{ ok: true } | { ok: false; error: string }> => {
    const caller = await requireDirector(context.userId);
    if (!data.role) return { ok: false, error: "역할은 실장 또는 직원만 선택할 수 있습니다." };
    if (!emailOk(data.email)) return { ok: false, error: "이메일 형식이 올바르지 않습니다." };
    if (!canManageTarget(caller.email, data.email, directorEmail())) {
      return { ok: false, error: "원장 계정은 초대할 수 없습니다." };
    }
    const sql = await getSql();
    const existing = await sql<{ status: string }>`
      select status from staff_member where email = ${data.email} limit 1
    `;
    if (existing[0]) return { ok: false, error: "이미 등록된 이메일입니다." };
    await sql`
      insert into staff_member (email, name, role, status)
      values (${data.email}, '', ${data.role}, 'active')
    `;
    const roleLabel = ROLE_LABEL[data.role];
    await writeLog({
      actorEmail: caller.email,
      actorName: displayPersonName("", caller.email, caller.name),
      action: "invite",
      targetEmail: data.email,
      detail: `${data.email} 계정을 ${roleLabel}으로 초대`,
    });
    return { ok: true };
  });

export const setStaffRole = createServerFn({ method: "POST" })
  .validator((input: { email?: string; role?: string }) => ({
    email: normalizeEmail(input.email),
    role: inviteRole(input.role ?? ""),
  }))
  .middleware([authMiddleware])
  .handler(async ({ context, data }): Promise<{ ok: true } | { ok: false; error: string }> => {
    const caller = await requireDirector(context.userId);
    if (!data.role) return { ok: false, error: "역할은 실장 또는 직원만 선택할 수 있습니다." };
    if (!canManageTarget(caller.email, data.email, directorEmail())) {
      return { ok: false, error: "원장 역할은 바꾸거나 지울 수 없습니다." };
    }
    const sql = await getSql();
    const rows = await sql<{ role: StaffRole; name: string; status: string }>`
      select role, name, status from staff_member where email = ${data.email} and role <> 'director' limit 1
    `;
    const row = rows[0];
    if (!row) return { ok: false, error: "계정을 찾을 수 없습니다." };
    if (row.role === data.role) return { ok: true };
    await sql`update staff_member set role = ${data.role} where email = ${data.email} and role <> 'director'`;
    const who = row.name.trim() || data.email;
    await writeLog({
      actorEmail: caller.email,
      actorName: displayPersonName("", caller.email, caller.name),
      action: "role_change",
      targetEmail: data.email,
      detail: `${who} 역할을 ${ROLE_LABEL[row.role]}에서 ${ROLE_LABEL[data.role]}으로 변경`,
    });
    return { ok: true };
  });

export const setStaffStatus = createServerFn({ method: "POST" })
  .validator((input: { email?: string; status?: string }) => ({
    email: normalizeEmail(input.email),
    status: input.status === "suspended" || input.status === "active" ? input.status : "",
  }))
  .middleware([authMiddleware])
  .handler(async ({ context, data }): Promise<{ ok: true } | { ok: false; error: string }> => {
    const caller = await requireDirector(context.userId);
    if (data.status !== "active" && data.status !== "suspended") {
      return { ok: false, error: "상태를 확인할 수 없습니다." };
    }
    if (!canManageTarget(caller.email, data.email, directorEmail())) {
      return { ok: false, error: "원장 계정은 정지할 수 없습니다." };
    }
    const sql = await getSql();
    const rows = await sql<{ role: string; name: string; status: string; user_id: string | null }>`
      select role, name, status, user_id from staff_member where email = ${data.email} and role <> 'director' limit 1
    `;
    const row = rows[0];
    if (!row) return { ok: false, error: "계정을 찾을 수 없습니다." };
    if (row.status === data.status) return { ok: true };
    await sql`
      update staff_member set status = ${data.status}
      where email = ${data.email} and role <> 'director'
    `;
    if (data.status === "suspended" && row.user_id) {
      await sql`delete from "session" where "userId" = ${row.user_id}`;
    }
    const who = row.name.trim() || data.email;
    await writeLog({
      actorEmail: caller.email,
      actorName: displayPersonName("", caller.email, caller.name),
      action: data.status === "suspended" ? "suspend" : "unsuspend",
      targetEmail: data.email,
      detail: data.status === "suspended" ? `${who} 계정을 정지` : `${who} 정지를 해제`,
    });
    return { ok: true };
  });
