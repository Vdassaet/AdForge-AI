"use client";

import { useState } from "react";
import { Check, ChevronRight, Settings, Loader2 } from "lucide-react";
import { publishCampaignAction } from "@/app/(dashboard)/campaigns/actions";
import { UsageLimitModal } from "@/components/billing/usage-limit-modal";
import { UsageStatus } from "@/lib/services/billing/usage";
import { toast } from "sonner";

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export function CampaignWizard() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [publishStatus, setPublishStatus] = useState<"draft" | "publishing" | "review" | "failed">("draft");
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
    dailyBudget: 10,
    totalBudget: 100,
    currency: "USD",
    spendAcknowledged: false,
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
        totalBudget: formData.totalBudget,
        currency: formData.currency,
        spendAcknowledged: formData.spendAcknowledged,
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
        setPublishStatus("review");
        toast.success(response.simulated ? "Campaign validated and saved for review." : "Campaign published successfully!");
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
      case 6:
        return (
          <div className="space-y-5 max-w-lg">
            <div>
              <h2 className="text-xl font-semibold">Low-cost budget guardrails</h2>
              <p className="mt-1 text-sm text-slate-500">These are caps, not estimates or guarantees. Your advertising platform may enforce additional limits.</p>
            </div>
            <label className="block text-sm font-medium text-slate-700">
              Daily budget ({formData.currency})
              <input
                type="number"
                min="1"
                max="50"
                step="1"
                value={formData.dailyBudget}
                onChange={(event) => setFormData({ ...formData, dailyBudget: Number(event.target.value) })}
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Maximum total campaign budget ({formData.currency})
              <input
                type="number"
                min={formData.dailyBudget || 1}
                max="300"
                step="1"
                value={formData.totalBudget}
                onChange={(event) => setFormData({ ...formData, totalBudget: Number(event.target.value) })}
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2"
              />
            </label>
            <p className="rounded-md bg-amber-50 p-3 text-sm text-amber-900">Ads are paid directly to the advertising platform. This application cannot provide free ads or guarantee leads.</p>
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
                <div><span className="text-slate-500">Maximum total:</span> <p className="font-medium">{formData.currency} {formData.totalBudget}</p></div>
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
                <h2 className="text-2xl font-semibold text-slate-900">Review your budget</h2>
                <p className="text-slate-500 max-w-md">No ad will be sent or charged until a real advertising-network connection is implemented and you confirm publication there.</p>
                <label className="mt-4 flex max-w-md items-start gap-3 text-left text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.spendAcknowledged}
                    onChange={(event) => setFormData({ ...formData, spendAcknowledged: event.target.checked })}
                    className="mt-1"
                  />
                  I confirm a daily cap of {formData.currency} {formData.dailyBudget} and a total cap of {formData.currency} {formData.totalBudget}.
                </label>
                <button 
                  onClick={handleSimulatedPublish}
                  disabled={!formData.spendAcknowledged}
                  className="mt-6 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Validate campaign for review
                </button>
              </>
            )}
            
            {publishStatus === "publishing" && (
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <h2 className="text-xl font-semibold text-slate-900">Validating campaign safeguards...</h2>
                <p className="text-slate-500">No ad is being sent to Meta or Google.</p>
              </div>
            )}

            {publishStatus === "review" && (
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-900">Campaign ready for review</h2>
                <p className="text-slate-500">Budget safeguards passed. No ad has been published and no advertising spend has occurred.</p>
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
