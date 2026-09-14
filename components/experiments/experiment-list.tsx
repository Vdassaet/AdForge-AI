"use client";

import { ExperimentCard } from "@/components/experiments/experiment-card";
import type { ABExperiment } from "@/lib/services/experiments";
import { Plus } from "lucide-react";

export function ExperimentList() {
  const MOCK_EXPERIMENTS: ABExperiment[] = [
    {
      id: "exp_1",
      organization_id: "org_1",
      campaign_id: "camp_1",
      name: "Fall Promotion Copy Test",
      variable: "Primary Text",
      status: "running",
      start_date: "2026-09-01T00:00:00Z",
      variant_a: {
        variant_id: "var_a1",
        name: "Standard Copy",
        impressions: 450, // Not enough data
        clicks: 12,
        leads: 1,
        spend: 25.50
      },
      variant_b: {
        variant_id: "var_b1",
        name: "Urgent Copy",
        impressions: 480,
        clicks: 22,
        leads: 2,
        spend: 26.10
      }
    },
    {
      id: "exp_2",
      organization_id: "org_1",
      campaign_id: "camp_2",
      name: "Vinyl vs Wood Image",
      variable: "Creative",
      status: "running",
      start_date: "2026-08-15T00:00:00Z",
      variant_a: {
        variant_id: "var_a2",
        name: "Lifestyle Vinyl",
        impressions: 12500, // Enough data
        clicks: 310,
        leads: 28,
        spend: 450.00
      },
      variant_b: {
        variant_id: "var_b2",
        name: "Close-up Wood",
        impressions: 11800,
        clicks: 145,
        leads: 8,
        spend: 430.00
      }
    },
    {
      id: "exp_3",
      organization_id: "org_1",
      campaign_id: "camp_3",
      name: "CTA Button Test",
      variable: "CTA",
      status: "completed",
      winner_variant_id: "var_b3",
      start_date: "2026-07-01T00:00:00Z",
      end_date: "2026-07-15T00:00:00Z",
      variant_a: {
        variant_id: "var_a3",
        name: "Learn More",
        impressions: 8000,
        clicks: 95,
        leads: 5,
        spend: 200.00
      },
      variant_b: {
        variant_id: "var_b3",
        name: "Get Quote",
        impressions: 8100,
        clicks: 215,
        leads: 22,
        spend: 205.00
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1">
          <button className="px-4 py-1.5 text-sm font-medium bg-slate-100 text-slate-900 rounded-md">
            Active Tests (2)
          </button>
          <button className="px-4 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-md transition-colors">
            Completed (1)
          </button>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors">
          <Plus className="w-4 h-4" /> New Experiment
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {MOCK_EXPERIMENTS.map((exp) => (
          <ExperimentCard key={exp.id} experiment={exp} />
        ))}
      </div>
    </div>
  );
}
