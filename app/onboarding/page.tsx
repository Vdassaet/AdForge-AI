import { OnboardingWizard } from "@/components/onboarding-wizard";

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-sm border">
        <OnboardingWizard />
      </div>
    </div>
  );
}
