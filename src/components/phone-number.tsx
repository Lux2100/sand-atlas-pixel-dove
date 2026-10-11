import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function maskPhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.length >= 7) return `${digits.slice(0, 3)}-****-${digits.slice(-4)}`;
  if (digits.length >= 4) return `${"*".repeat(digits.length - 4)}${digits.slice(-4)}`;
  return "****";
}

export function formatPhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 11) return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  if (digits.length === 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  return raw.trim();
}

export function PhoneNumber({ phone, className }: { phone: string; className?: string }) {
  const [shown, setShown] = useState(false);
  return (
    <span className={cn("inline-flex max-w-full items-center gap-0.5 align-middle text-sm text-ink", className)}>
      <span className="tabular-nums">{shown ? formatPhone(phone) : maskPhone(phone)}</span>
      <button
        type="button"
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-ink"
        aria-label={shown ? "전화번호 가리기" : "전화번호 보기"}
        title={shown ? "가리기" : "보기"}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShown((v) => !v);
        }}
      >
        {shown ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
      </button>
    </span>
  );
}
