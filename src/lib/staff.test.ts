import assert from "node:assert/strict";
import test from "node:test";
import { canManageTarget, decideAccess, inviteRole } from "./staff.ts";

test("unset director email does not grant a director role", () => {
  const decision = decideAccess({ directorEmail: "", userEmail: "a@clinic.kr", staff: null });
  assert.equal(decision.configured, false);
  assert.equal(decision.allowed, true);
  assert.equal(decision.role, null);
});

test("only the configured email is director", () => {
  const director = decideAccess({
    directorEmail: "Wonjang@Clinic.kr",
    userEmail: "wonjang@clinic.kr",
    staff: null,
  });
  assert.equal(director.role, "director");
  assert.equal(director.allowed, true);

  const other = decideAccess({
    directorEmail: "wonjang@clinic.kr",
    userEmail: "staff@clinic.kr",
    staff: { role: "director", status: "active" },
  });
  assert.equal(other.allowed, false);
  assert.equal(other.reason, "not-invited");
});

test("invited staff can enter until suspended", () => {
  const active = decideAccess({
    directorEmail: "wonjang@clinic.kr",
    userEmail: "lee@clinic.kr",
    staff: { role: "manager", status: "active" },
  });
  assert.equal(active.allowed, true);
  assert.equal(active.roleLabel, "실장");

  const stopped = decideAccess({
    directorEmail: "wonjang@clinic.kr",
    userEmail: "lee@clinic.kr",
    staff: { role: "staff", status: "suspended" },
  });
  assert.equal(stopped.allowed, false);
  assert.equal(stopped.reason, "suspended");
});

test("director cannot manage their own account", () => {
  assert.equal(canManageTarget("wonjang@clinic.kr", "wonjang@clinic.kr", "wonjang@clinic.kr"), false);
  assert.equal(canManageTarget("lee@clinic.kr", "kim@clinic.kr", "wonjang@clinic.kr"), false);
  assert.equal(canManageTarget("wonjang@clinic.kr", "lee@clinic.kr", "wonjang@clinic.kr"), true);
  assert.equal(inviteRole("director"), null);
  assert.equal(inviteRole("manager"), "manager");
});
