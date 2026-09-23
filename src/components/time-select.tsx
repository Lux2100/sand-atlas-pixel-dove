import { VISIT_MINUTES, snapVisitTime } from "@/lib/format";
import { cn } from "@/lib/utils";

const ALL_HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));

type TimeSelectProps = {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  minHour?: number;
  maxHour?: number;
};

export function TimeSelect({ value, onChange, className, minHour = 0, maxHour = 23 }: TimeSelectProps) {
  const snapped = snapVisitTime(value);
  const hour = snapped.slice(0, 2);
  const minute = snapped.slice(3, 5);
  const hours = ALL_HOURS.filter((h) => {
    const n = Number(h);
    return n >= minHour && n <= maxHour;
  });

  const selectClass =
    "h-10 rounded-md border border-border bg-surface px-2 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-ring/40";

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <select
        aria-label="시"
        className={selectClass}
        value={hour}
        onChange={(e) => onChange(snapVisitTime(`${e.target.value}:${minute}`))}
      >
        {hours.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>
      <span className="text-muted">:</span>
      <select
        aria-label="분"
        className={selectClass}
        value={VISIT_MINUTES.includes(minute as (typeof VISIT_MINUTES)[number]) ? minute : "00"}
        onChange={(e) => onChange(snapVisitTime(`${hour}:${e.target.value}`))}
      >
        {VISIT_MINUTES.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
    </div>
  );
}
