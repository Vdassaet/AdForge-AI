"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, Users, Phone, DollarSign, Target } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Campaign {
  id: string;
  name: string;
  status: string;
  daily_budget: number;
  location: string;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function loadDashboard() {
      const { data } = await supabase
        .from("campaigns")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        setCampaigns(data);
      }
      setLoading(false);
    }
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const hasCampaigns = campaigns.length > 0;

  if (!hasCampaigns) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-lg mx-auto text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-primary/10 p-6 rounded-full mb-2">
          <Target className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Let&apos;s get your first ad running.
        </h1>
        <p className="text-lg text-muted-foreground">
          Tell us what you want to advertise. We&apos;ll handle the complex targeting, design, and settings automatically.
        </p>
        <Link 
          href="/campaigns/new" 
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all active:scale-95"
        >
          <PlusCircle className="h-6 w-6" />
          Create my first ad
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            How is my advertising doing?
          </h1>
          <p className="text-muted-foreground mt-1">Here is a simple summary of your results.</p>
        </div>
        <Link 
          href="/campaigns/new" 
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
        >
          <PlusCircle className="h-5 w-5" />
          Create Ad
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Leads generated", value: "0", icon: Users },
          { label: "Calls received", value: "0", icon: Phone },
          { label: "Ad spend", value: "$0.00", icon: DollarSign },
          { label: "Cost per lead", value: "$0.00", icon: Target },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-sm font-medium">{stat.label}</span>
              <stat.icon className="h-4 w-4" />
            </div>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Active Ads</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map((camp) => (
            <div key={camp.id} className="bg-card border rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 font-medium px-2.5 py-0.5 rounded-full text-xs">
                  <span className="h-1.5 w-1.5 bg-green-600 rounded-full animate-pulse"></span>
                  {camp.status || "Active"}
                </span>
                <span className="text-sm font-medium text-muted-foreground">${camp.daily_budget}/day</span>
              </div>
              <h3 className="font-bold text-lg mb-1">{camp.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{camp.location || "Local targeting"}</p>
              
              <Link href={`/analytics`} className="text-sm font-semibold text-primary hover:underline">
                View Results &rarr;
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
