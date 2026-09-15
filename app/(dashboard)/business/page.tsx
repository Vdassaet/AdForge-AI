"use client";

import { useState, useEffect } from "react";
import { MapPin, Globe, Phone, Camera, PenSquare, PlusCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

import Image from "next/image";

interface BusinessProfile {
  name: string;
  tagline?: string;
  website?: string;
  phone?: string;
  logo_url?: string;
}

export default function BusinessProfilePage() {
  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadBusiness() {
      // In a real app we'd fetch the user's organization profile
      // We will attempt to get it from a potential 'organizations' table or similar.
      // If none exists, we show empty state or defaults.
      
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        // Just checking metadata for now if no organizations table exists
        setBusiness({
          name: userData.user.user_metadata?.first_name 
            ? `${userData.user.user_metadata.first_name}'s Business`
            : "Your Business",
        });
      }
      setLoading(false);
    }
    loadBusiness();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Your Business</h1>
          <p className="text-muted-foreground mt-1">This information is used by the AI to generate your ads.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/80 transition-colors">
          <PenSquare className="h-4 w-4" /> Edit business
        </button>
      </div>

      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-8 flex flex-col md:flex-row gap-8 items-start">
          <div className="w-32 h-32 bg-muted rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground shrink-0 relative group cursor-pointer overflow-hidden">
            {business?.logo_url ? (
              <Image src={business.logo_url} fill alt="Logo" className="object-cover" />
            ) : (
              <>
                <Camera className="h-8 w-8 mb-2" />
                <span className="text-xs font-semibold">Add Logo</span>
              </>
            )}
            <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white text-xs font-bold transition-all">
              Change
            </div>
          </div>
          
          <div className="flex-1 space-y-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-muted-foreground">Business Name</label>
                <p className="text-lg font-bold">{business?.name || "Not set"}</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-muted-foreground">What you do</label>
                <p className="text-lg font-medium">{business?.tagline || "Not set"}</p>
              </div>
            </div>

            <hr className="border-border" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> Service Area
                </label>
                <p className="font-medium">Not set</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Globe className="h-4 w-4" /> Website
                </label>
                <p className="font-medium text-primary">{business?.website || "Not set"}</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Phone className="h-4 w-4" /> Phone
                </label>
                <p className="font-medium">{business?.phone || "Not set"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-card border rounded-2xl shadow-sm p-8">
        <h2 className="text-xl font-bold mb-6">Business Photos</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="aspect-square bg-muted rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground cursor-pointer hover:bg-muted/80 transition-colors">
            <PlusCircle className="h-8 w-8 mb-2" />
            <span className="text-xs font-semibold">Upload Photo</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Upload photos of your team, your work, or your office. The AI will use these in your ads.
        </p>
      </div>
    </div>
  );
}
