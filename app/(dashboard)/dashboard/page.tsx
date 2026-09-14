"use client";

import {
  Megaphone,
  Users,
  DollarSign,
  MousePointerClick,
  Phone,
  Globe,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { demoStore } from "@/lib/demo/demo-data";
import { SimulatedBadge } from "@/components/demo/simulated-badge";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const business = demoStore.getBusiness();
  const analytics = demoStore.getAnalytics();
  const campaigns = demoStore.getCampaigns();
  const recentLeads = demoStore.getLeads().slice(0, 4);

  const stats = [
    {
      name: "Active Campaigns",
      value: analytics.activeCampaigns.toString(),
      icon: Megaphone,
      trend: "+3 this month",
    },
    {
      name: "Total Leads",
      value: analytics.totalLeads.toString(),
      icon: Users,
      trend: "+18% vs prev",
    },
    {
      name: "Cost Per Lead",
      value: `$${analytics.avgCpl.toFixed(2)}`,
      icon: DollarSign,
      trend: "-12% improvement",
    },
    {
      name: "Ad Spend",
      value: `$${analytics.totalSpend.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: MousePointerClick,
      trend: "on target",
    },
    {
      name: "Calls Tracked",
      value: analytics.callsReceived.toString(),
      icon: Phone,
      trend: "+24% inbound",
    },
    {
      name: "Web Leads",
      value: analytics.formLeads.toString(),
      icon: Globe,
      trend: "+9% conversion",
    },
    {
      name: "Conversion Rate",
      value: `${analytics.conversionRate}%`,
      icon: TrendingUp,
      trend: "+2.4% avg",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {business.name}
            </h1>
            <SimulatedBadge variant="outline" label="Demo Account" />
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            {business.tagline} &bull; Paramus &amp; Northern New Jersey
          </p>
        </div>

        <div className="flex w-full sm:w-auto gap-3">
          <Button variant="outline" asChild>
            <Link href="/ai-ad-generator">Generate Ad with AI</Link>
          </Button>
          <Button asChild>
            <Link href="/campaigns/new">Create Campaign</Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name} className="transition-all hover:shadow-md border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {stat.name}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2 mt-2">
                    <Skeleton className="h-8 w-[100px]" />
                    <Skeleton className="h-4 w-[60px]" />
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center justify-between">
                      <span className="text-emerald-600 font-medium">{stat.trend}</span>
                      <SimulatedBadge variant="subtle" label="Demo" />
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Active Campaigns Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">Active Ad Campaigns</h2>
            <SimulatedBadge variant="subtle" />
          </div>
          <Link
            href="/campaigns"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View All Campaigns <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {campaigns.map((camp) => (
            <div
              key={camp.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {camp.status}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 font-mono">
                    ${camp.dailyBudget}/day
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{camp.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{camp.location}</p>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Leads</span>
                    <p className="text-sm font-bold text-slate-900">{camp.leadsCount}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Cost/Lead</span>
                    <p className="text-sm font-bold text-blue-600">${camp.cpl.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">CTR</span>
                    <p className="text-sm font-bold text-slate-900">{camp.ctr}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[11px]">Spend: ${camp.totalSpend.toFixed(2)}</span>
                <Link
                  href="/analytics"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Analytics &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Inquiries Preview */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Recent Inbound Leads</h2>
            <SimulatedBadge variant="subtle" />
          </div>
          <Link
            href="/leads"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            Manage CRM Leads <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100 overflow-x-auto">
          {recentLeads.map((lead) => (
            <div key={lead.id} className="py-3 flex items-center justify-between gap-4 text-xs">
              <div className="min-w-[140px]">
                <p className="font-semibold text-slate-900">{lead.name}</p>
                <p className="text-slate-500 text-[11px]">{lead.location}</p>
              </div>

              <div className="hidden sm:block min-w-[130px]">
                <span className="font-medium text-slate-700">{lead.service}</span>
              </div>

              <div>
                <span className="font-bold text-slate-900 font-mono">
                  ${lead.estimatedValue.toLocaleString()}
                </span>
              </div>

              <div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  lead.status === "won" ? "bg-green-100 text-green-800" :
                  lead.status === "qualified" ? "bg-purple-100 text-purple-800" :
                  lead.status === "estimate" ? "bg-indigo-100 text-indigo-800" :
                  "bg-blue-100 text-blue-800"
                }`}>
                  {lead.status}
                </span>
              </div>

              <span className="text-slate-400 text-[11px] min-w-[70px] text-right">
                {lead.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
