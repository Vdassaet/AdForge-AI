"use client";

import { useState, useEffect } from "react";
import { RecommendationCard } from "@/components/recommendations/recommendation-card";
import { demoStore } from "@/lib/demo/demo-data";
import { SimulatedBadge } from "@/components/demo/simulated-badge";
import { Bot, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import type { AIRecommendation } from "@/lib/services/ai/optimization";

export function RecommendationList() {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load tailored demo recommendations for NJ Fence and Railing
    const demoRecs = demoStore.getRecommendations() as unknown as AIRecommendation[];
    setRecommendations(demoRecs.filter((r) => r.status === "pending"));
    setIsLoading(false);
  }, []);

  const handleApply = (id: string) => {
    setRecommendations((prev) => prev.filter((r) => r.id !== id));
    toast.success("AI Recommendation applied successfully (Simulated)!");
  };

  const handleDismiss = (id: string) => {
    setRecommendations((prev) => prev.filter((r) => r.id !== id));
    toast.info("Recommendation dismissed.");
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl h-64 animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
        <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">You&apos;re All Set!</h3>
        <p className="text-slate-500 max-w-md mx-auto">
          Our AI has analyzed your active campaigns and didn&apos;t find any critical optimizations needed at this time. Check back tomorrow!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start justify-between gap-3 shadow-xs">
        <div className="flex items-start gap-3">
          <Bot className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-blue-900">
              AI Optimization Active for NJ Fence and Railing
            </h4>
            <p className="text-xs text-blue-700 mt-0.5">
              Machine learning models identified <strong>{recommendations.length} opportunities</strong> to lower CPL and increase qualified inbound calls.
            </p>
          </div>
        </div>
        <SimulatedBadge variant="subtle" />
      </div>

      <div className="space-y-6">
        {recommendations.map((rec) => (
          <RecommendationCard
            key={rec.id}
            recommendation={rec}
            onApply={handleApply}
            onDismiss={handleDismiss}
          />
        ))}
      </div>
    </div>
  );
}
