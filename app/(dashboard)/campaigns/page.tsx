"use client";

import { Target } from "lucide-react";
import Link from "next/link";

export default function CampaignsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-lg mx-auto text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-primary/10 p-6 rounded-full mb-2">
        <Target className="h-12 w-12 text-primary" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-foreground">
        Active Campaigns
      </h1>
      <p className="text-lg text-muted-foreground">
        View and manage your active ads.
      </p>
      <Link 
        href="/campaigns/new" 
        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-sm hover:bg-primary/90 transition-all"
      >
        Create an Ad
      </Link>
    </div>
  );
}
