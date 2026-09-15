"use client";

import { useState, useEffect } from "react";
import { LineChart, Users, Phone, DollarSign, Target, ArrowUpRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    leads: 0,
    calls: 0,
    spend: 0,
    cpl: 0
  });
  const supabase = createClient();

  useEffect(() => {
    async function loadStats() {
      // In a real app we'd aggregate campaigns and leads tables
      // For now we will fetch leads count as a simple proxy for data existence
      const { count: leadsCount } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true });
        
      const { count: campaignsCount } = await supabase
        .from("campaigns")
        .select("*", { count: "exact", head: true });

      if (leadsCount !== null || campaignsCount !== null) {
        // If there are no campaigns at all, we keep stats at 0
        if (campaignsCount && campaignsCount > 0) {
          // If we had real aggregation backend we would use it, but since we don't, 
          // and the user explicitly said "NO inventes datos", we just show the real counts.
          // Since spend is not easily aggregated without a backend function, we will keep it 0 if it can't be fetched
          setStats({
            leads: leadsCount || 0,
            calls: 0, // Requires call tracking integration
            spend: 0, // Requires billing integration
            cpl: 0    // derived
          });
        }
      }
      setLoading(false);
    }
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const hasData = stats.leads > 0 || stats.spend > 0;

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-lg mx-auto text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-primary/10 p-6 rounded-full mb-2">
          <LineChart className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Your results will appear here.
        </h1>
        <p className="text-lg text-muted-foreground">
          Once your first campaign is running and customers start interacting with your ads, you&apos;ll see your results here.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Your Results</h1>
        <p className="text-muted-foreground mt-1">A simple breakdown of what your ads have generated.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-sm font-medium">Leads generated</span>
            <Users className="h-4 w-4" />
          </div>
          <p className="text-3xl font-bold">{stats.leads}</p>
        </div>
        <div className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-sm font-medium">Calls generated</span>
            <Phone className="h-4 w-4" />
          </div>
          <p className="text-3xl font-bold">{stats.calls}</p>
        </div>
        <div className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-sm font-medium">Ad spend</span>
            <DollarSign className="h-4 w-4" />
          </div>
          <p className="text-3xl font-bold">${stats.spend.toFixed(2)}</p>
        </div>
        <div className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-sm font-medium">Cost per lead</span>
            <Target className="h-4 w-4" />
          </div>
          <p className="text-3xl font-bold">${stats.cpl.toFixed(2)}</p>
        </div>
      </div>

      {stats.leads > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 mt-8">
          <div className="bg-blue-100 p-4 rounded-full text-blue-600 shrink-0">
            <Target className="h-8 w-8" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-blue-900 mb-1">You&apos;re getting leads!</h3>
            <p className="text-blue-800">
              Your ads are actively generating leads. We recommend keeping your campaigns active to maintain this momentum.
            </p>
          </div>
          <a href="/leads" className="bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition flex items-center gap-2 whitespace-nowrap">
            View Leads <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      )}
    </div>
  );
}
