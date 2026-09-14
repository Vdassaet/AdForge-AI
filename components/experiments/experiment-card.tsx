"use client";

import { useState } from "react";
import { experimentService, type ABExperiment } from "@/lib/services/experiments";
import { Trophy, AlertTriangle, Activity, DollarSign, MousePointerClick, Users } from "lucide-react";

interface ExperimentCardProps {
  experiment: ABExperiment;
}

export function ExperimentCard({ experiment }: ExperimentCardProps) {
  const [status, setStatus] = useState(experiment.status);
  const [winner, setWinner] = useState(experiment.winner_variant_id);

  const sig = experimentService.calculateSignificance(experiment.variant_a, experiment.variant_b);

  const handleDeclareWinner = async (variantId: string) => {
    const success = await experimentService.declareManualWinner(experiment.id, variantId);
    if (success) {
      setWinner(variantId);
      setStatus("completed");
    }
  };

  const MetricRow = ({ icon: Icon, label, valA, valB, format = (v: number) => v.toString() }: { icon: React.ElementType, label: string, valA: number, valB: number, format?: (v: number) => string }) => {
    const isABetter = valA > valB; // Simplified, in reality depends on metric (e.g., lower CPL is better)
    return (
      <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
        <div className="flex items-center gap-2 text-slate-500 w-1/3">
          <Icon className="w-4 h-4" />
          <span className="text-xs font-medium">{label}</span>
        </div>
        <div className={`w-1/3 text-center font-medium ${isABetter && !winner ? 'text-slate-900' : 'text-slate-500'}`}>
          {format(valA)}
        </div>
        <div className={`w-1/3 text-center font-medium ${!isABetter && !winner ? 'text-slate-900' : 'text-slate-500'}`}>
          {format(valB)}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
              status === 'running' ? 'bg-blue-100 text-blue-700' : 
              status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-700'
            }`}>
              {status}
            </span>
            <span className="text-xs font-medium text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
              Variable: {experiment.variable}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900">{experiment.name}</h3>
        </div>
        
        {/* Significance Badge */}
        {status === 'running' && !sig.hasEnoughData && (
          <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs font-semibold">Not Enough Data</span>
          </div>
        )}
        {status === 'running' && sig.hasEnoughData && (
          <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
            <Activity className="w-4 h-4" />
            <span className="text-xs font-semibold">{sig.confidence.toFixed(1)}% Confidence</span>
          </div>
        )}
      </div>

      {/* A/B Comparison */}
      <div className="p-5 grid grid-cols-[auto_1fr_1fr] gap-4">
        {/* Headers */}
        <div className="w-24"></div>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold mb-2">A</div>
          <h4 className="text-sm font-semibold text-slate-900 truncate px-2">{experiment.variant_a.name}</h4>
        </div>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold mb-2">B</div>
          <h4 className="text-sm font-semibold text-slate-900 truncate px-2">{experiment.variant_b.name}</h4>
        </div>

        {/* Metrics */}
        <div className="col-span-3 mt-4">
          <MetricRow icon={MousePointerClick} label="Clicks" valA={experiment.variant_a.clicks} valB={experiment.variant_b.clicks} />
          <MetricRow icon={Users} label="Leads" valA={experiment.variant_a.leads} valB={experiment.variant_b.leads} />
          <MetricRow icon={DollarSign} label="CPL" valA={experiment.variant_a.spend / Math.max(experiment.variant_a.leads, 1)} valB={experiment.variant_b.spend / Math.max(experiment.variant_b.leads, 1)} format={(v: number) => `$${v.toFixed(2)}`} />
          <MetricRow icon={Activity} label="CTR" valA={(experiment.variant_a.clicks / experiment.variant_a.impressions) * 100} valB={(experiment.variant_b.clicks / experiment.variant_b.impressions) * 100} format={(v: number) => `${v.toFixed(2)}%`} />
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="mt-auto border-t border-slate-200 p-4 bg-slate-50 flex items-center justify-between">
        {status === 'completed' && winner ? (
          <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
            <Trophy className="w-5 h-5" />
            Variant {winner === experiment.variant_a.variant_id ? 'A' : 'B'} won this experiment
          </div>
        ) : (
          <>
            <p className="text-xs text-slate-500">
              {sig.hasEnoughData ? "Ready for a decision." : "Wait for more conversions to reach statistical significance."}
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleDeclareWinner(experiment.variant_a.variant_id)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
              >
                Select A
              </button>
              <button 
                onClick={() => handleDeclareWinner(experiment.variant_b.variant_id)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
              >
                Select B
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
