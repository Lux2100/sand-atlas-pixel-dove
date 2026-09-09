import { useEffect, useRef } from "react";
import { MEMO_MARKS, sanitizeMemo } from "@/lib/memo";
import { cn } from "@/lib/utils";

const RED = "#a61b1b";
const INK = "#1c1915";

type MemoEditorProps = {
  value?: string;
  onChange: (html: string) => void;
  className?: string;
};

export function MemoEditor({ value, onChange, className }: MemoEditorProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const next = value ?? "";
    if (el.innerHTML !== next) el.innerHTML = next;
  }, [value]);

  const emit = () => {
    const el = ref.current;
    if (!el) return;
    onChange(sanitizeMemo(el.innerHTML));
  };

  const run = (cmd: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(cmd, false, arg);
    emit();
  };

  const paintBody = () => {
    ref.current?.focus();
    document.execCommand("removeFormat");
    document.execCommand("foreColor", false, INK);
    emit();
  };

  const insertMark = (mark: string) => {
    ref.current?.focus();
    document.execCommand("insertText", false, mark);
    emit();
  };

  return (
    <div className={cn("overflow-hidden rounded-md border border-border bg-surface", className)}>
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-surface-2 px-2 py-1.5">
        <button
          type="button"
          className="h-8 rounded-md px-2 text-xs text-ink hover:bg-surface"
          onMouseDown={(e) => e.preventDefault()}
          onClick={paintBody}
        >
          본문
        </button>
        <button
          type="button"
          className="h-8 rounded-md px-2 text-xs hover:bg-surface"
          style={{ color: RED }}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => run("foreColor", RED)}
        >
          강조
        </button>
        <span className="mx-1 h-4 w-px bg-border" />
        {MEMO_MARKS.map((m) => (
          <button
            key={m}
            type="button"
            className="size-8 rounded-md text-sm text-ink hover:bg-surface"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => insertMark(m)}
          >
            {m}
          </button>
        ))}
      </div>
      <div
        ref={ref}
        contentEditable
        role="textbox"
        aria-label="시술 메모"
        className="memo-body min-h-24 px-3 py-2 text-sm leading-relaxed text-ink outline-none"
        onInput={emit}
        onBlur={() => {
          const el = ref.current;
          if (!el) return;
          const html = sanitizeMemo(el.innerHTML);
          if (el.innerHTML !== html) el.innerHTML = html;
          onChange(html);
        }}
      />
    </div>
  );
}
