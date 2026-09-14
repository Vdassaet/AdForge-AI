"use client";

import { useState } from "react";
import { Sparkles, TrendingUp, TrendingDown, AlertCircle, CheckCircle2, X } from "lucide-react";
import type { AIRecommendation } from "@/lib/services/ai/optimization";

interface RecommendationCardProps {
  recommendation: AIRecommendation;
  onApply: (id: string) => void;
  onDismiss: (id: string) => void;
}

export function RecommendationCard({ recommendation, onApply, onDismiss }: RecommendationCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async () => {
    setIsApplying(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    onApply(recommendation.id);
    setShowConfirm(false);
  };

  const getImpactIcon = (value: string) => {
    if (value.startsWith("+")) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (value.startsWith("-")) return <TrendingDown className="w-4 h-4 text-blue-600" />;
    return <Sparkles className="w-4 h-4 text-purple-600" />;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm relative group">
      {/* Confidence Badge */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
        <span className="text-xs font-semibold text-slate-700">{recommendation.confidence}% Confidence</span>
      </div>

      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-blue-600" />
          </div>
          <div className="pr-24">
            <h3 className="text-lg font-semibold text-slate-900">{recommendation.title}</h3>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">{recommendation.explanation}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> Evidence
            </h4>
            <p className="text-sm text-slate-700">{recommendation.evidence}</p>
          </div>
          
          <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100/50">
            <h4 className="text-xs font-semibold text-blue-600/80 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              {getImpactIcon(recommendation.impact_value)} Est. Impact
            </h4>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{recommendation.impact_value}</span>
              <span className="text-sm font-medium text-slate-600">{recommendation.impact_metric}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500">
          Action: <span className="font-mono bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">{recommendation.action_type}</span>
        </p>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onDismiss(recommendation.id)}
            className="text-sm font-medium text-slate-500 hover:text-slate-700 px-3 py-2 transition-colors"
          >
            Dismiss
          </button>
          <button 
            onClick={() => setShowConfirm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            Review & Apply
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="absolute inset-0 z-10 bg-white/95 backdrop-blur-sm flex items-center justify-center p-6 border-t border-blue-600/20">
          <button onClick={() => setShowConfirm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
          
          <div className="max-w-sm text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Apply Recommendation?</h4>
            <p className="text-sm text-slate-600 mb-6">
              This will execute the <span className="font-mono bg-slate-100 px-1 rounded text-xs">{recommendation.action_type}</span> action via the platform APIs. This action will be audited.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button 
                onClick={() => setShowConfirm(false)}
                disabled={isApplying}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleApply}
                disabled={isApplying}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {isApplying ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Applying...
                  </>
                ) : 'Confirm Apply'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
