import { CampaignWizard } from "@/components/campaigns/campaign-wizard";

export default function NewCampaignPage() {
  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Create Campaign</h1>
        <p className="mt-1 text-sm text-slate-500">
          Build a new ad campaign step by step to launch on Meta platforms.
        </p>
      </div>
      
      <CampaignWizard />
    </div>
  );
}
