export type StaffRole = "director" | "manager" | "staff";
export type StaffStatus = "active" | "suspended";
export type AccessReason = "not-invited" | "suspended";

export const ROLE_LABEL: Record<StaffRole, string> = {
  director: "원장",
  manager: "실장",
  staff: "직원",
};

export function normalizeEmail(email: string | null | undefined): string {
  return (email ?? "").trim().toLowerCase();
}

export function emailOk(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 200;
}

export function inviteRole(role: string): "manager" | "staff" | null {
  return role === "manager" || role === "staff" ? role : null;
}

export function displayPersonName(name: string, email: string, sessionName?: string | null): string {
  const picked = name.trim() || (sessionName ?? "").trim() || email.split("@")[0] || "이름 없음";
  return picked.slice(0, 80);
}

export type AccessDecision = {
  configured: boolean;
  allowed: boolean;
  reason?: AccessReason;
  role: StaffRole | null;
  roleLabel: string;
};

/** Who may open the clinic. Only the env director, or an active invited manager/staff. */
export function decideAccess(input: {
  directorEmail: string;
  userEmail: string;
  staff: { role: string; status: string } | null;
}): AccessDecision {
  const director = normalizeEmail(input.directorEmail);
  const email = normalizeEmail(input.userEmail);
  if (!director) {
    return { configured: false, allowed: true, role: null, roleLabel: "권한 미설정" };
  }
  if (email && email === director) {
    return { configured: true, allowed: true, role: "director", roleLabel: ROLE_LABEL.director };
  }
  const row = input.staff;
  if (!email || !row || row.role === "director" || (row.role !== "manager" && row.role !== "staff")) {
    return { configured: true, allowed: false, reason: "not-invited", role: null, roleLabel: "" };
  }
  if (row.status === "suspended") {
    return { configured: true, allowed: false, reason: "suspended", role: row.role, roleLabel: ROLE_LABEL[row.role] };
  }
  if (row.status !== "active") {
    return { configured: true, allowed: false, reason: "not-invited", role: null, roleLabel: "" };
  }
  return { configured: true, allowed: true, role: row.role, roleLabel: ROLE_LABEL[row.role] };
}

/** Director may change or suspend other people, never their own director account. */
export function canManageTarget(actorEmail: string, targetEmail: string, directorEmail: string): boolean {
  const director = normalizeEmail(directorEmail);
  const actor = normalizeEmail(actorEmail);
  const target = normalizeEmail(targetEmail);
  if (!director || actor !== director) return false;
  if (!target || target === director) return false;
  return true;
}
