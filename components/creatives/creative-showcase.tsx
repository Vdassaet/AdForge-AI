"use client";

import { useState } from "react";
import { demoStore, DemoCreative } from "@/lib/demo/demo-data";
import { SimulatedBadge } from "@/components/demo/simulated-badge";
import { CreativeEditor, CreativeInitialData } from "./creative-editor";
import { Sparkles, Layers, Edit3, CheckCircle2, ArrowRight } from "lucide-react";

export function CreativeShowcase() {
  const creatives = demoStore.getCreatives();
  const [activeTab, setActiveTab] = useState<"library" | "editor">("library");
  const [selectedCreative, setSelectedCreative] = useState<CreativeInitialData | undefined>(undefined);
  const [filterCampaign, setFilterCampaign] = useState<string>("ALL");

  const campaigns = ["ALL", ...Array.from(new Set(creatives.map((c) => c.campaignName)))];

  const filteredCreatives =
    filterCampaign === "ALL"
      ? creatives
      : creatives.filter((c) => c.campaignName === filterCampaign);

  const handleEditCreative = (creative: DemoCreative) => {
    setSelectedCreative({
      businessName: "NJ Fence and Railing",
      headline: creative.headline,
      primaryText: creative.primaryText,
      description: creative.description,
      cta: creative.cta,
      imageUrl: creative.imageUrl,
      aspectRatio: creative.aspectRatio,
    });
    setActiveTab("editor");
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("library")}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === "library"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Layers className="w-4 h-4" />
            Pre-Built Demo Ads ({creatives.length})
          </button>
          <button
            onClick={() => setActiveTab("editor")}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === "editor"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Edit3 className="w-4 h-4" />
            Creative Studio & Editor
          </button>
        </div>

        <div className="flex items-center gap-2">
          <SimulatedBadge label="4 Pre-Trained Demo Ads" />
        </div>
      </div>

      {activeTab === "library" ? (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span>Filter by Campaign:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {campaigns.map((camp) => (
                <button
                  key={camp}
                  onClick={() => setFilterCampaign(camp)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    filterCampaign === camp
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {camp === "ALL" ? "All Creatives" : camp}
                </button>
              ))}
            </div>
          </div>

          {/* Creatives Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCreatives.map((creative) => (
              <div
                key={creative.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Aspect Ratio Badge & Score */}
                  <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      {creative.aspectRatio} • {creative.campaignName}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      <Sparkles className="w-3 h-3 text-emerald-500" />
                      Score {creative.performanceScore}/100
                    </div>
                  </div>

                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-slate-100 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={creative.imageUrl}
                      alt={creative.headline}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2 left-2">
                      <SimulatedBadge variant="subtle" label="Demo Ad" />
                    </div>
                  </div>

                  {/* Content Preview */}
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-sm text-slate-900 line-clamp-2">
                      {creative.headline}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {creative.primaryText}
                    </p>
                    <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
                      <span>CTA: <strong className="text-slate-800">{creative.cta}</strong></span>
                      <span className="truncate max-w-[120px]">{creative.description}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-3 bg-slate-50/70 border-t border-slate-100">
                  <button
                    onClick={() => handleEditCreative(creative)}
                    className="w-full py-2 px-3 bg-white hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200 hover:border-blue-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Load in Creative Studio
                    <ArrowRight className="w-3 h-3 ml-auto opacity-60" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Demo Info Box */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 space-y-1">
              <p className="font-semibold">Simulated Ad Formats & Multi-Platform Readiness</p>
              <p className="text-amber-800/90 leading-relaxed">
                These creatives are calibrated for <strong>NJ Fence and Railing</strong> across standard Meta placements: 1:1 Feed square, 4:5 high-engagement portrait, 9:16 vertical reels & stories, and 16:9 landscape. All image assets are hosted via reliable CDNs and do not require active Meta Marketing API credentials to preview or test.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Quick Preset Picker */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-2.5 rounded-xl border border-slate-200">
            <span className="text-xs font-medium text-slate-600 px-1">Load Preset Ad:</span>
            {creatives.map((c) => (
              <button
                key={c.id}
                onClick={() => handleEditCreative(c)}
                className="px-2.5 py-1 text-xs font-medium bg-white hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200 rounded-md transition-colors"
              >
                {c.campaignName} ({c.aspectRatio})
              </button>
            ))}
          </div>

          <CreativeEditor initialData={selectedCreative} />
        </div>
      )}
    </div>
  );
}
