"use client";

import { useState } from "react";
import Link from "next/link";
import { PLANS, isStripeConfigured } from "@/lib/services/billing/stripe";
import { usageService } from "@/lib/services/billing/usage";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Zap,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  Ban,
  Sliders,
} from "lucide-react";
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

export function BillingDashboard() {
  const configured = isStripeConfigured();
  const [selectedPlan, setSelectedPlan] = useState<string>("free");
  const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false);
  
  const currentPlan = PLANS[selectedPlan] || PLANS.free;

  // Track all 5 metrics required by Prompt 15:
  // 1. AI generations
  // 2. Creative generations
  // 3. Campaigns
  // 4. Connected ad accounts
  // 5. Leads
  const aiUsage = usageService.checkUsage(currentPlan.id, "ai_generation", 7);
  const creativeUsage = usageService.checkUsage(currentPlan.id, "creative", 3);
  const campaignUsage = usageService.checkUsage(currentPlan.id, "campaign", 1);
  const adAccountUsage = usageService.checkUsage(currentPlan.id, "ad_account", 1);
  const leadUsage = usageService.checkUsage(currentPlan.id, "lead", 28);

  const UsageBar = ({
    label,
    current,
    limit,
    percent,
  }: {
    label: string;
    current: number;
    limit: number;
    percent: number;
  }) => (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-slate-500 font-mono text-xs">
          {current} / {limit === -1 ? "Unlimited" : limit}
        </span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            percent >= 90
              ? "bg-red-500"
              : percent >= 70
              ? "bg-amber-500"
              : "bg-blue-600"
          }`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </div>
  );

  const handlePlanAction = (targetPlanId: string) => {
    if (!configured) {
      toast.info(`Switched demo preview to ${PLANS[targetPlanId]?.name} plan.`);
      setSelectedPlan(targetPlanId);
      return;
    }
    toast.success(`Redirecting to Stripe Checkout for ${PLANS[targetPlanId]?.name}...`);
  };

  const handleManageBilling = () => {
    if (!configured) {
      toast.info("Stripe is not configured. Customer portal would open in live mode.");
      return;
    }
    toast.success("Redirecting to Stripe Customer Portal...");
  };

  const handleCancelSubscription = () => {
    setIsCancelModalOpen(false);
    setSelectedPlan("free");
    toast.success("Subscription has been scheduled for cancellation at period end.");
  };

  return (
    <div className="space-y-8">
      {/* Demo / Setup Banner if Stripe is unconfigured */}
      {!configured && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-4 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-amber-900">Demo Mode: Stripe Not Configured</h4>
            <p className="text-amber-700 mt-1">
              Payments and portal redirects are simulated. Set <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-xs text-amber-900">STRIPE_SECRET_KEY</code> and <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-xs text-amber-900">STRIPE_WEBHOOK_SECRET</code> in production to process live subscriptions.
            </p>
          </div>
        </div>
      )}

      {/* Current Plan Overview Card */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900">
                Plan: <span className="text-blue-600">{currentPlan.name}</span>
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" /> Active
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {currentPlan.id === "free"
                  ? "Free forever tier — upgrade anytime"
                  : "Renews automatically on October 14, 2026"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentPlan.id !== "free" && (
              <button
                onClick={() => setIsCancelModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
              >
                <Ban className="w-3.5 h-3.5" /> Cancel Subscription
              </button>
            )}
            <Link
              href="/settings/plan-limits"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-sm transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-500" /> Configure Limits (Admin)
            </Link>
            <button
              onClick={handleManageBilling}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            >
              <CreditCard className="w-4 h-4" /> Manage Billing
            </button>
          </div>
        </div>

        {/* 5 Usage Meters */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Monthly Usage &amp; Quotas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <UsageBar
              label="AI Generations"
              current={aiUsage.current}
              limit={aiUsage.limit}
              percent={aiUsage.percentUsed}
            />
            <UsageBar
              label="Creative Designs"
              current={creativeUsage.current}
              limit={creativeUsage.limit}
              percent={creativeUsage.percentUsed}
            />
            <UsageBar
              label="Active Campaigns"
              current={campaignUsage.current}
              limit={campaignUsage.limit}
              percent={campaignUsage.percentUsed}
            />
            <UsageBar
              label="Connected Ad Accounts"
              current={adAccountUsage.current}
              limit={adAccountUsage.limit}
              percent={adAccountUsage.percentUsed}
            />
            <UsageBar
              label="Leads Captured"
              current={leadUsage.current}
              limit={leadUsage.limit}
              percent={leadUsage.percentUsed}
            />
          </div>
        </div>
      </div>

      {/* Available Plans Grid */}
      <div>
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900">Choose the Right Plan</h3>
          <p className="text-sm text-slate-500 mt-1">
            Upgrade, downgrade, or switch your plan anytime. Scale as your business grows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {Object.values(PLANS).map((plan) => {
            const isCurrent = plan.id === currentPlan.id;
            const isPro = plan.id === "pro";

            return (
              <div
                key={plan.id}
                className={`bg-white border rounded-xl p-6 flex flex-col transition-all duration-200 ${
                  isCurrent
                    ? "border-blue-500 ring-2 ring-blue-100 shadow-sm"
                    : isPro
                    ? "border-slate-300 shadow-sm"
                    : "border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-base font-bold text-slate-900">{plan.name}</h4>
                  {isCurrent && (
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                      CURRENT
                    </span>
                  )}
                  {!isCurrent && isPro && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      POPULAR
                    </span>
                  )}
                </div>

                <div className="mt-2">
                  <span className="text-3xl font-extrabold text-slate-900">${plan.price}</span>
                  <span className="text-xs text-slate-500 font-normal"> /month</span>
                </div>

                <ul className="mt-6 space-y-2.5 flex-1 text-xs text-slate-600">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanAction(plan.id)}
                  disabled={isCurrent}
                  className={`mt-6 w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    isCurrent
                      ? "bg-slate-100 text-slate-400 cursor-default"
                      : isPro
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                      : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {isCurrent ? (
                    "Active Plan"
                  ) : plan.price > currentPlan.price ? (
                    <>
                      <Zap className="w-3.5 h-3.5" /> Upgrade
                    </>
                  ) : (
                    <>
                      Downgrade <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cancellation Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelSubscription}
        title="Cancel Subscription?"
        description="Are you sure you want to cancel your plan? You will retain access until the end of your billing period, after which your account will return to the Free tier."
        confirmText="Confirm Cancellation"
        cancelText="Keep Subscription"
        variant="destructive"
      />
    </div>
  );
}
