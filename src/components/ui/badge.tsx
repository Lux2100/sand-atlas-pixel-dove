import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeProps = React.ComponentProps<"span"> & {
  tone?: "default" | "sage";
};

function Badge({ className, tone = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        tone === "sage" ? "bg-sage-soft text-sage" : "bg-surface-2 text-muted",
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
