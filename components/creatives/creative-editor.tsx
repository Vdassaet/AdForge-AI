"use client";

import { useState, useEffect } from "react";
import { AdPreview } from "./ad-preview";
import { Image as ImageIcon, LayoutTemplate, Type, MousePointer2, Loader2 } from "lucide-react";
import { saveCreativeAction } from "@/app/(dashboard)/creatives/actions";
import { UsageLimitModal } from "@/components/billing/usage-limit-modal";
import { UsageStatus } from "@/lib/services/billing/usage";
import { toast } from "sonner";

export interface CreativeInitialData {
  businessName?: string;
  headline?: string;
  primaryText?: string;
  description?: string;
  cta?: string;
  imageUrl?: string;
  aspectRatio?: "1:1" | "4:5" | "9:16" | "16:9";
}

export function CreativeEditor({ initialData }: { initialData?: CreativeInitialData }) {
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "4:5" | "9:16" | "16:9">(
    initialData?.aspectRatio || "1:1"
  );
  const [isSaving, setIsSaving] = useState(false);
  const [usageStatus, setUsageStatus] = useState<UsageStatus | null>(null);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    businessName: initialData?.businessName || "NJ Fence and Railing",
    headline: initialData?.headline || "Transform Your Yard With Premium Fencing",
    primaryText: initialData?.primaryText || "Looking to upgrade your property? We offer top-tier aluminum and wood fencing installed by professionals. Get a free estimate today and secure your home in style.",
    description: initialData?.description || "njfence.com",
    cta: initialData?.cta || "Learn More",
    imageUrl: initialData?.imageUrl || "https://images.unsplash.com/photo-1589939705384-5185137a7f0f",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        businessName: initialData.businessName || "NJ Fence and Railing",
        headline: initialData.headline || "",
        primaryText: initialData.primaryText || "",
        description: initialData.description || "njfence.com",
        cta: initialData.cta || "Learn More",
        imageUrl: initialData.imageUrl || "https://images.unsplash.com/photo-1589939705384-5185137a7f0f",
      });
      if (initialData.aspectRatio) {
        setAspectRatio(initialData.aspectRatio);
      }
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveCreative = async () => {
    setIsSaving(true);
    try {
      const response = await saveCreativeAction({
        ...formData,
        aspectRatio,
      });

      if (response.limitReached && response.usage) {
        setUsageStatus(response.usage);
        setIsLimitModalOpen(true);
        toast.error("Creative generation limit reached! Please upgrade your plan to save more creatives.");
        return;
      }

      if (response.rateLimited) {
        toast.error("Too many requests. Please wait a moment before trying again.");
        return;
      }

      if (response.error) {
        toast.error(response.error);
        return;
      }

      if (response.success) {
        if (response.usage) {
          setUsageStatus(response.usage);
        }
        toast.success("Creative saved successfully!");
      }
    } catch {
      toast.error("Failed to save creative.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      {/* Editor Panel */}
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-[calc(100vh-8rem)]">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-slate-900">Creative Editor</h2>
            {usageStatus && (
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-mono">
                {usageStatus.current} / {usageStatus.limit}
              </span>
            )}
          </div>
          <button
            onClick={handleSaveCreative}
            disabled={isSaving}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50 inline-flex items-center gap-1.5"
          >
            {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {isSaving ? "Saving..." : "Save Creative"}
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Aspect Ratio Selector */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <LayoutTemplate className="w-4 h-4" /> Aspect Ratio (Format)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(["1:1", "4:5", "9:16", "16:9"] as const).map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`py-2 text-xs font-medium rounded-md border transition-colors ${
                    aspectRatio === ratio 
                      ? "bg-blue-50 border-blue-500 text-blue-700" 
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              {aspectRatio === "1:1" && "Square (Feed)"}
              {aspectRatio === "4:5" && "Portrait (Feed/Explore)"}
              {aspectRatio === "9:16" && "Vertical (Stories/Reels)"}
              {aspectRatio === "16:9" && "Landscape (In-Stream)"}
            </p>
          </div>

          <hr className="border-slate-100" />

          {/* Copy Editor */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Type className="w-4 h-4" /> Ad Copy
            </label>
            
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Primary Text</label>
              <textarea 
                name="primaryText" 
                value={formData.primaryText} 
                onChange={handleChange}
                rows={4}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" 
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Headline</label>
              <input 
                type="text"
                name="headline" 
                value={formData.headline} 
                onChange={handleChange}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" 
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Link Description</label>
              <input 
                type="text"
                name="description" 
                value={formData.description} 
                onChange={handleChange}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" 
              />
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Visuals */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> Media & Call to Action
            </label>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Image URL (from Assets)</label>
              <div className="flex gap-2">
                <input 
                  type="url"
                  name="imageUrl" 
                  value={formData.imageUrl} 
                  onChange={handleChange}
                  className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" 
                />
                <button className="bg-slate-100 border border-slate-300 rounded-md px-3 text-sm font-medium text-slate-700 hover:bg-slate-200">
                  Select
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
                <MousePointer2 className="w-3 h-3" /> Button Label (CTA)
              </label>
              <select 
                name="cta" 
                value={formData.cta} 
                onChange={handleChange}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="Learn More">Learn More</option>
                <option value="Get Quote">Get Quote</option>
                <option value="Book Now">Book Now</option>
                <option value="Contact Us">Contact Us</option>
                <option value="Send Message">Send Message</option>
                <option value="Sign Up">Sign Up</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex flex-col h-[calc(100vh-8rem)]">
        <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-center">
          <div className="flex gap-4">
            <span className="text-sm font-medium text-slate-500">Live Preview</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center">
          <div className="w-full max-w-md my-auto pb-10 scale-90 sm:scale-100 transform origin-top">
            <AdPreview
              businessName={formData.businessName}
              headline={formData.headline}
              primaryText={formData.primaryText}
              description={formData.description}
              cta={formData.cta}
              imageUrl={formData.imageUrl}
              aspectRatio={aspectRatio}
            />
          </div>
        </div>
      </div>

      {/* Usage Limit Modal */}
      <UsageLimitModal
        isOpen={isLimitModalOpen}
        featureName="Creative Designs"
        currentPlan={usageStatus?.planName || "Free"}
        currentCount={usageStatus?.current || 5}
        limit={usageStatus?.limit || 5}
        recommendedPlanName={usageStatus?.recommendedUpgrade?.name || "Starter"}
        recommendedFeatures={[
          "50 creative designs/month",
          "100 AI generations/month",
          "5 active campaigns",
          "Multi-format export",
        ]}
        onClose={() => setIsLimitModalOpen(false)}
      />
    </div>
  );
}
