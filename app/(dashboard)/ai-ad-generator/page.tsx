"use client";

import { useState } from "react";
import { GenerationForm } from "@/components/ai/generation-form";
import { GenerationResults } from "@/components/ai/generation-results";
import { PromptInput, AdGenerationOutput } from "@/lib/services/ai/schema";
import { generateAdAction } from "./actions";
import { UsageLimitModal } from "@/components/billing/usage-limit-modal";
import { toast } from "sonner";
import { UsageStatus } from "@/lib/services/billing/usage";

export default function AiAdGeneratorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AdGenerationOutput | null>(null);
  const [usageStatus, setUsageStatus] = useState<UsageStatus | null>(null);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);

  const handleGenerate = async (data: PromptInput) => {
    setIsLoading(true);
    try {
      const response = await generateAdAction(data);

      if (response.limitReached && response.usage) {
        setUsageStatus(response.usage);
        setIsLimitModalOpen(true);
        toast.error("AI Generation limit reached! Please upgrade your plan to continue.");
        return;
      }

      if (response.rateLimited) {
        toast.error("Too many generation requests. Please slow down to prevent abuse.");
        return;
      }

      if (response.error) {
        toast.error(response.error);
      } else if (response.data) {
        setResults(response.data);
        if (response.usage) {
          setUsageStatus(response.usage);
        }
        toast.success("Ad generated successfully!");
      }
    } catch {
      toast.error("Failed to generate. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">AI Ad Generator</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Generate high-converting ad copy tailored to your local service business.
          </p>
        </div>

        {usageStatus && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-card text-xs text-muted-foreground">
            <span>Quota:</span>
            <span className="font-semibold text-foreground">
              {usageStatus.current} / {usageStatus.limit === -1 ? "Unlimited" : usageStatus.limit}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-4 bg-card p-6 rounded-xl border border-border shadow-sm sticky top-24">
          <GenerationForm onGenerate={handleGenerate} isLoading={isLoading} />
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-8">
          <GenerationResults results={results} />
        </div>
      </div>

      {/* Upgrade Prompt Modal */}
      <UsageLimitModal
        isOpen={isLimitModalOpen}
        featureName="AI Generations"
        currentPlan={usageStatus?.planName || "Free"}
        currentCount={usageStatus?.current || 10}
        limit={usageStatus?.limit || 10}
        recommendedPlanName={usageStatus?.recommendedUpgrade?.name || "Starter"}
        recommendedFeatures={[
          "100 AI generations/month",
          "50 creative designs/month",
          "5 active campaigns",
          "A/B experiment builder",
        ]}
        onClose={() => setIsLimitModalOpen(false)}
      />
    </div>
  );
}
