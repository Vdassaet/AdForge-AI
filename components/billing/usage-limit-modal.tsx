"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Zap,
  ArrowUpRight,
  X,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export interface UsageLimitModalProps {
  isOpen: boolean;
  featureName: string;
  currentPlan?: string;
  currentCount?: number;
  limit?: number;
  recommendedPlanName?: string;
  recommendedFeatures?: string[];
  onClose: () => void;
  onUpgrade?: () => void;
}

export function UsageLimitModal({
  isOpen,
  featureName,
  currentPlan = "Free",
  currentCount,
  limit,
  recommendedPlanName = "Starter",
  recommendedFeatures = [
    "100 AI generations/month",
    "50 creative designs/month",
    "5 active campaigns",
    "Advanced analytics & A/B testing",
  ],
  onClose,
  onUpgrade,
}: UsageLimitModalProps) {
  const router = useRouter();

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleUpgradeClick = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      router.push("/billing");
    }
    onClose();
  };

  const isCountAvailable = currentCount !== undefined && limit !== undefined && limit > 0;
  const percentUsed = isCountAvailable ? Math.min(100, Math.round((currentCount / limit) * 100)) : 100;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="usage-limit-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 relative animate-in zoom-in-95 duration-200">
        {/* Header Ribbon / Accent */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 h-2 w-full" />

        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Icon and Title */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto ring-8 ring-amber-50/50 shadow-inner">
              <Zap className="w-7 h-7 fill-amber-500/20 stroke-amber-600" />
            </div>
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
              Quota Limit Reached
            </span>
            <h2 id="usage-limit-modal-title" className="text-2xl font-bold text-slate-900 tracking-tight">
              {featureName} Limit Reached
            </h2>
            <p className="text-slate-600 text-sm max-w-sm mx-auto">
              You have exhausted your monthly allowance for {featureName.toLowerCase()} on the{" "}
              <strong className="text-slate-900 font-semibold">{currentPlan}</strong> plan.
            </p>
          </div>

          {/* Usage Meter Breakdown */}
          {isCountAvailable && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-xs font-medium text-slate-600">
                <span>Monthly Consumption</span>
                <span className="font-mono text-red-600 font-semibold">
                  {currentCount} / {limit} ({percentUsed}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-red-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${percentUsed}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 text-right">
                Resets on the 1st of next month
              </p>
            </div>
          )}

          {/* Recommended Upgrade Tier Highlight */}
          <div className="bg-gradient-to-br from-blue-50/70 to-indigo-50/50 border border-blue-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-blue-700 text-xs font-bold uppercase tracking-wide">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Recommended Next Step
              </div>
              <span className="text-xs font-semibold text-blue-900 bg-blue-100 px-2 py-0.5 rounded-full">
                {recommendedPlanName} Tier
              </span>
            </div>

            <p className="text-xs text-slate-700 font-medium">
              Upgrade to <span className="text-blue-700 font-bold">{recommendedPlanName}</span> to immediately unlock:
            </p>

            <ul className="space-y-1.5 text-xs text-slate-600">
              {recommendedFeatures.map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTAs */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleUpgradeClick}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3 px-4 rounded-xl font-semibold shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all text-sm"
            >
              <span>Upgrade to {recommendedPlanName}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between gap-4 pt-1">
              <button
                onClick={() => {
                  router.push("/billing");
                  onClose();
                }}
                className="text-xs text-slate-600 hover:text-blue-600 underline font-medium transition-colors"
              >
                Compare all plans
              </button>

              <button
                onClick={onClose}
                className="text-xs text-slate-400 hover:text-slate-600 py-1 transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
