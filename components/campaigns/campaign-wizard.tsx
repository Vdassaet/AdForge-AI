"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, Settings, Loader2 } from "lucide-react";
import { publishCampaignAction } from "@/app/(dashboard)/campaigns/actions";
import { UsageLimitModal } from "@/components/billing/usage-limit-modal";
import { UsageStatus } from "@/lib/services/billing/usage";
import { toast } from "sonner";

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export function CampaignWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [publishStatus, setPublishStatus] = useState<"draft" | "publishing" | "active" | "failed">("draft");
  const [usageStatus, setUsageStatus] = useState<UsageStatus | null>(null);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  
  // Minimal form state to hold the wizard data
  const [formData, setFormData] = useState({
    name: "Fall Fencing Promotion",
    objective: "Leads",
    service: "Aluminum Fencing",
    location: "Bergen County, NJ",
    audience: "Homeowners, 30-65+",
    creative: "Creative ID Placeholder", // Would be selected from /creatives
    dailyBudget: 20,
    startDate: new Date().toISOString().split('T')[0],
  });

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 9) as Step);
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1) as Step);

  const handleSimulatedPublish = async () => {
    setPublishStatus("publishing");
    
    try {
      const response = await publishCampaignAction({
        name: formData.name,
        objective: formData.objective,
        service: formData.service,
        location: formData.location,
        dailyBudget: formData.dailyBudget,
        startDate: formData.startDate,
      });

      if (response.limitReached && response.usage) {
        setPublishStatus("draft");
        setUsageStatus(response.usage);
        setIsLimitModalOpen(true);
        toast.error("Campaign limit reached! Please upgrade your plan to publish more active campaigns.");
        return;
      }

      if (response.rateLimited) {
        setPublishStatus("draft");
        toast.error("Too many requests. Please wait a moment.");
        return;
      }

      if (response.error) {
        setPublishStatus("failed");
        toast.error(response.error);
        return;
      }

      if (response.success) {
        if (response.usage) {
          setUsageStatus(response.usage);
        }
        setPublishStatus("active");
        toast.success("Campaign published successfully!");
        
        setTimeout(() => {
          router.push("/campaigns");
        }, 1500);
      }
    } catch {
      setPublishStatus("failed");
      toast.error("An error occurred while publishing the campaign.");
    }
  };

  const stepTitles = [
    "Objective", "Service", "Location", "Audience", 
    "Creative", "Budget", "Schedule", "Review", "Publish"
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">What is your campaign objective?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["Leads", "Website Traffic", "Calls", "Messages", "Awareness"].map(obj => (
                <div 
                  key={obj}
                  onClick={() => setFormData({...formData, objective: obj})}
                  className={`p-4 border rounded-lg cursor-pointer hover:border-blue-500 transition-colors ${formData.objective === obj ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}
                >
                  <h3 className="font-medium">{obj}</h3>
                </div>
              ))}
            </div>
          </div>
        );
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        // Simplifying steps 2-7 for brevity in the wizard mockup
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{stepTitles[currentStep - 1]} Configuration</h2>
            <p className="text-slate-500">Configure your {stepTitles[currentStep - 1].toLowerCase()} settings here.</p>
            <div className="p-8 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400">
              <Settings className="w-8 h-8 mr-2 opacity-50" />
              Settings placeholder for Step {currentStep}
            </div>
          </div>
        );
      case 8:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Review your Campaign</h2>
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-slate-500">Name:</span> <p className="font-medium">{formData.name}</p></div>
                <div><span className="text-slate-500">Objective:</span> <p className="font-medium">{formData.objective}</p></div>
                <div><span className="text-slate-500">Service:</span> <p className="font-medium">{formData.service}</p></div>
                <div><span className="text-slate-500">Location:</span> <p className="font-medium">{formData.location}</p></div>
                <div><span className="text-slate-500">Budget:</span> <p className="font-medium">${formData.dailyBudget} / day</p></div>
                <div><span className="text-slate-500">Start Date:</span> <p className="font-medium">{formData.startDate}</p></div>
              </div>
            </div>
          </div>
        );
      case 9:
        return (
          <div className="space-y-6 flex flex-col items-center justify-center text-center py-12">
            {publishStatus === "draft" && (
              <>
                <h2 className="text-2xl font-semibold text-slate-900">Ready to Publish</h2>
                <p className="text-slate-500 max-w-md">Your campaign is fully configured and ready to be sent to the advertising networks.</p>
                <button 
                  onClick={handleSimulatedPublish}
                  className="mt-6 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors"
                >
                  Publish Campaign
                </button>
              </>
            )}
            
            {publishStatus === "publishing" && (
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <h2 className="text-xl font-semibold text-slate-900">Publishing to Meta...</h2>
                <p className="text-slate-500">Uploading creatives and syncing budget rules.</p>
              </div>
            )}

            {publishStatus === "active" && (
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-900">Campaign Active!</h2>
                <p className="text-slate-500">Your campaign has been successfully published and is now running.</p>
                <p className="text-sm text-slate-400">Redirecting to dashboard...</p>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-5xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 rounded-full -z-10"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 rounded-full -z-10 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / 8) * 100}%` }}
          ></div>
          
          {stepTitles.map((title, idx) => {
            const stepNum = idx + 1;
            const isActive = stepNum === currentStep;
            const isCompleted = stepNum < currentStep;
            
            return (
              <div key={title} className="flex flex-col items-center gap-2 bg-slate-50 px-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  isActive ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 
                  isCompleted ? 'bg-blue-600 text-white' : 'bg-white border-2 border-slate-200 text-slate-400'
                }`}>
                  {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
                </div>
                <span className={`text-xs font-medium hidden md:block ${isActive ? 'text-blue-900' : 'text-slate-400'}`}>
                  {title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm p-6 overflow-y-auto">
        {renderStepContent()}
      </div>

      {/* Footer Navigation */}
      {currentStep < 9 && (
        <div className="mt-6 flex items-center justify-between">
          <button 
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          
          <button 
            onClick={nextStep}
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 flex items-center"
          >
            {currentStep === 8 ? "Proceed to Publish" : "Next Step"}
            {currentStep !== 8 && <ChevronRight className="w-4 h-4 ml-1" />}
          </button>
        </div>
      )}

      {/* Usage Limit Modal */}
      <UsageLimitModal
        isOpen={isLimitModalOpen}
        featureName="Active Campaigns"
        currentPlan={usageStatus?.planName || "Free"}
        currentCount={usageStatus?.current || 1}
        limit={usageStatus?.limit || 1}
        recommendedPlanName={usageStatus?.recommendedUpgrade?.name || "Starter"}
        recommendedFeatures={[
          "5 active campaigns",
          "50 creatives/month",
          "100 AI generations/month",
          "Automated daily budgeting",
        ]}
        onClose={() => setIsLimitModalOpen(false)}
      />
    </div>
  );
}
