import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface SimulatedBadgeProps {
  className?: string;
  label?: string;
  variant?: "default" | "subtle" | "outline";
}

export function SimulatedBadge({
  className,
  label = "Simulated Data",
  variant = "default",
}: SimulatedBadgeProps) {
  if (variant === "subtle") {
    return (
      <span
        title="This item is simulated in Demo Mode and not synced to an external ad account"
        className={cn(
          "inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60",
          className
        )}
      >
        <Sparkles className="w-2.5 h-2.5 text-amber-500" />
        {label}
      </span>
    );
  }

  if (variant === "outline") {
    return (
      <span
        title="This item is simulated in Demo Mode and not synced to an external ad account"
        className={cn(
          "inline-flex items-center gap-1 text-[10px] font-semibold text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full uppercase tracking-wider",
          className
        )}
      >
        <Sparkles className="w-3 h-3 text-amber-600" />
        {label}
      </span>
    );
  }

  return (
    <span
      title="This item is simulated in Demo Mode and not synced to an external ad account"
      className={cn(
        "inline-flex items-center gap-1 text-[11px] font-semibold text-amber-900 bg-amber-100 border border-amber-300/80 px-2 py-0.5 rounded-full shadow-xs",
        className
      )}
    >
      <Sparkles className="w-3 h-3 text-amber-600 fill-amber-500/20" />
      {label}
    </span>
  );
}
