"use client";

import { useState, useTransition } from "react";
import {
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";
import { resetDemoDataAction } from "@/lib/demo";
import { toast } from "sonner";

export function DemoBanner() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleReset = () => {
    startTransition(async () => {
      const res = await resetDemoDataAction();
      if (res.success) {
        toast.success(res.message);
        // Reload current page to refresh all demo states
        window.location.reload();
      }
    });
  };

  return (
    <aside
      aria-label="Demo Mode Notice"
      className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white shadow-sm border-b border-amber-600 z-30 transition-all duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
        <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
          {/* Left: Indicator & Message */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/20 font-bold uppercase tracking-wider text-[11px]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span>DEMO MODE</span>
            </div>

            <span className="font-medium text-white/95">
              Simulating live operations for <strong className="text-white font-bold underline decoration-white/40">NJ Fence and Railing</strong>.
            </span>

            {!isMinimized && (
              <span className="hidden md:inline-flex items-center gap-1 text-amber-100 text-xs">
                <Info className="w-3.5 h-3.5" />
                No external credentials (Supabase, Meta, Stripe, AI) required. All data is isolated and safely simulated.
              </span>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleReset}
              disabled={isPending}
              title="Reset all demo campaigns, leads, and services to initial demo state"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/15 hover:bg-white/25 active:bg-white/30 text-white font-semibold rounded-md border border-white/20 transition-colors disabled:opacity-50 text-xs"
            >
              <RotateCcw className={`w-3 h-3 ${isPending ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Reset Demo Data</span>
            </button>

            <button
              onClick={() => setIsMinimized((prev) => !prev)}
              aria-label={isMinimized ? "Expand demo details" : "Minimize demo details"}
              className="p-1 hover:bg-white/15 rounded text-white/80 hover:text-white transition-colors"
            >
              {isMinimized ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Expanded Details Drawer */}
        {!isMinimized && (
          <div className="mt-1.5 pt-1.5 border-t border-white/15 flex flex-wrap items-center gap-2 text-[11px] text-amber-100">
            <span className="font-semibold text-white">Configured Services:</span>
            <span className="bg-black/15 px-1.5 py-0.5 rounded text-white/90">Aluminum Railing</span>
            <span className="bg-black/15 px-1.5 py-0.5 rounded text-white/90">Fence Installation</span>
            <span className="bg-black/15 px-1.5 py-0.5 rounded text-white/90">Railing Repair</span>
            <span className="bg-black/15 px-1.5 py-0.5 rounded text-white/90">Metal Fabrication</span>
            <span className="ml-auto hidden lg:inline text-white/75 italic">
              All interactions in this mode execute safely in sandbox memory.
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}
