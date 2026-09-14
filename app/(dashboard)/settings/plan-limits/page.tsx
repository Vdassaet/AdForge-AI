"use client";

import { useState, useEffect, useTransition } from "react";
import {
  type PlanId,
  type PlanConfig,
  type PlanLimits,
} from "@/lib/services/billing/plans";
import {
  getPlanConfigurationsAction,
  updatePlanLimitsAction,
  resetPlanLimitsAction,
} from "./actions";
import {
  Save,
  RotateCcw,
  Sliders,
  Info,
} from "lucide-react";
import { toast } from "sonner";

export default function PlanLimitsAdminPage() {
  const [plans, setPlans] = useState<Record<PlanId, PlanConfig> | null>(null);
  const [loading, setLoading] = useState(true);
  const [editedLimits, setEditedLimits] = useState<Record<PlanId, PlanLimits>>({} as Record<PlanId, PlanLimits>);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function loadPlans() {
      try {
        const data = await getPlanConfigurationsAction();
        setPlans(data);
        const initialLimits = {} as Record<PlanId, PlanLimits>;
        for (const [id, config] of Object.entries(data)) {
          initialLimits[id as PlanId] = { ...config.limits };
        }
        setEditedLimits(initialLimits);
      } catch {
        toast.error("Failed to load plan configurations.");
      } finally {
        setLoading(false);
      }
    }
    loadPlans();
  }, []);

  const handleLimitChange = (planId: PlanId, field: keyof PlanLimits, value: string) => {
    const num = parseInt(value, 10);
    if (isNaN(num)) return;
    setEditedLimits((prev) => ({
      ...prev,
      [planId]: {
        ...prev[planId],
        [field]: num,
      },
    }));
  };

  const handleSavePlan = (planId: PlanId) => {
    startTransition(async () => {
      const limits = editedLimits[planId];
      if (!limits) return;

      const res = await updatePlanLimitsAction(planId, limits);
      if (res.success && res.plan) {
        setPlans((prev) => (prev ? { ...prev, [planId]: res.plan! } : prev));
        toast.success(`Plan limits for ${res.plan.name} updated successfully!`);
      } else {
        toast.error(res.error || "Failed to update limits.");
      }
    });
  };

  const handleResetDefaults = () => {
    if (!confirm("Are you sure you want to reset all plan limits to baseline system defaults?")) {
      return;
    }

    startTransition(async () => {
      const res = await resetPlanLimitsAction();
      if (res.success) {
        setPlans(res.plans);
        const initialLimits = {} as Record<PlanId, PlanLimits>;
        for (const [id, config] of Object.entries(res.plans)) {
          initialLimits[id as PlanId] = { ...config.limits };
        }
        setEditedLimits(initialLimits);
        toast.success("All plan limits have been reset to factory defaults.");
      }
    });
  };

  if (loading || !plans) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-500">
        <Sliders className="w-5 h-5 animate-spin mr-2" /> Loading plan configurations...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">SaaS Plan Limits Configuration</h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wide">
              Admin Console
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Configure monthly quotas, limits, and enforcement rules across all subscription tiers in real time.
          </p>
        </div>

        <button
          onClick={handleResetDefaults}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm transition-colors disabled:opacity-50"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          Reset All to Defaults
        </button>
      </div>

      {/* Admin Notice Banner */}
      <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 leading-relaxed">
          <p className="font-semibold">Centralized Enforcement Active</p>
          <p className="mt-0.5 text-blue-700">
            Updates take effect immediately on live usage checks and generation operations.
            Enter <code className="bg-blue-100 font-mono px-1 rounded text-blue-900">-1</code> to designate unlimited or custom allocation for any resource.
          </p>
        </div>
      </div>

      {/* Plan Limit Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(["free", "starter", "pro", "agency"] as PlanId[]).map((planId) => {
          const plan = plans[planId];
          const limits = editedLimits[planId] || plan.limits;
          const isAgency = planId === "agency";

          return (
            <div
              key={planId}
              className={`bg-white border rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-all ${
                isAgency ? "border-purple-200 bg-gradient-to-b from-white to-purple-50/20" : "border-slate-200"
              }`}
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-900">{plan.name} Plan</h2>
                      {isAgency && (
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                          CUSTOM
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 font-mono">
                      {plan.price === 0 ? "Free tier" : `$${plan.price}/month`}
                    </span>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                    <Sliders className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-4">
                  {/* AI Generations */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold text-slate-700">
                        AI Generations / Month
                      </label>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {limits.ai_generations === -1 ? "Unlimited" : `${limits.ai_generations} gens`}
                      </span>
                    </div>
                    <input
                      type="number"
                      value={limits.ai_generations}
                      onChange={(e) => handleLimitChange(planId, "ai_generations", e.target.value)}
                      className="w-full text-sm font-medium border border-slate-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Creatives */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Creative Designs / Month
                      </label>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {limits.creatives === -1 ? "Unlimited" : `${limits.creatives} creatives`}
                      </span>
                    </div>
                    <input
                      type="number"
                      value={limits.creatives}
                      onChange={(e) => handleLimitChange(planId, "creatives", e.target.value)}
                      className="w-full text-sm font-medium border border-slate-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Campaigns */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Active Campaigns Limit
                      </label>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {limits.campaigns === -1 ? "Unlimited" : `${limits.campaigns} active`}
                      </span>
                    </div>
                    <input
                      type="number"
                      value={limits.campaigns}
                      onChange={(e) => handleLimitChange(planId, "campaigns", e.target.value)}
                      className="w-full text-sm font-medium border border-slate-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Connected Ad Accounts */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Connected Ad Accounts
                      </label>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {limits.ad_accounts === -1 ? "Unlimited" : `${limits.ad_accounts} accounts`}
                      </span>
                    </div>
                    <input
                      type="number"
                      value={limits.ad_accounts}
                      onChange={(e) => handleLimitChange(planId, "ad_accounts", e.target.value)}
                      className="w-full text-sm font-medium border border-slate-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Leads Captured */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Leads Limit / Month
                      </label>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {limits.leads === -1 ? "Unlimited" : `${limits.leads} leads`}
                      </span>
                    </div>
                    <input
                      type="number"
                      value={limits.leads}
                      onChange={(e) => handleLimitChange(planId, "leads", e.target.value)}
                      className="w-full text-sm font-medium border border-slate-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {limits.ai_generations === plan.limits.ai_generations &&
                  limits.creatives === plan.limits.creatives &&
                  limits.campaigns === plan.limits.campaigns
                    ? "Up to date"
                    : "Unsaved changes"}
                </span>
                <button
                  onClick={() => handleSavePlan(planId)}
                  disabled={isPending}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Changes
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
