"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  { id: "companyName", title: "Company Name", desc: "What is your company name?" },
  { id: "category", title: "Category", desc: "What is your business category?" },
  { id: "services", title: "Services", desc: "What services do you offer? (Comma separated)" },
  { id: "serviceAreas", title: "Service Areas", desc: "What are your primary service areas?" },
  { id: "phone", title: "Phone", desc: "What is your business phone number?" },
  { id: "website", title: "Website", desc: "What is your website URL? (Optional)" },
  { id: "logo", title: "Logo", desc: "Upload your company logo (URL)" },
  { id: "photos", title: "Photos", desc: "Provide links to project photos" },
  { id: "finish", title: "Finish", desc: "Ready to launch" },
];

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: "",
    category: "",
    services: "",
    serviceAreas: "",
    phone: "",
    website: "",
    logoUrl: "",
    photos: "",
  });

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      toast.success("Onboarding complete! Preparing your workspace...");
      router.push("/dashboard");
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const currentStepData = STEPS[currentStep];

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-muted/50 overflow-hidden">
      <div className="bg-muted/30 px-6 py-4 border-b">
        <div className="flex justify-between text-sm font-medium text-muted-foreground mb-3">
          <span>Step {currentStep + 1} of {STEPS.length}</span>
          <span className="text-foreground">{currentStepData.title}</span>
        </div>
        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-500 ease-in-out"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <CardContent className="p-8 min-h-[300px] flex flex-col justify-center relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6 w-full max-w-md mx-auto"
          >
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {currentStepData.desc}
              </h2>
            </div>
            
            {currentStep === 0 && (
              <Input
                autoFocus
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="e.g. NJ Fence and Railing"
                className="text-lg py-6"
              />
            )}
            {currentStep === 1 && (
              <Input
                autoFocus
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. Fence Contractor"
                className="text-lg py-6"
              />
            )}
            {currentStep === 2 && (
              <Input
                autoFocus
                value={formData.services}
                onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                placeholder="e.g. Wood Fencing, Vinyl Fencing"
                className="text-lg py-6"
              />
            )}
            {currentStep === 3 && (
              <Input
                autoFocus
                value={formData.serviceAreas}
                onChange={(e) => setFormData({ ...formData, serviceAreas: e.target.value })}
                placeholder="e.g. Newark, Jersey City"
                className="text-lg py-6"
              />
            )}
            {currentStep === 4 && (
              <Input
                autoFocus
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. (555) 123-4567"
                className="text-lg py-6"
              />
            )}
            {currentStep === 5 && (
              <Input
                autoFocus
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://www.example.com"
                className="text-lg py-6"
              />
            )}
            {currentStep === 6 && (
              <Input
                autoFocus
                type="url"
                value={formData.logoUrl}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                placeholder="https://..."
                className="text-lg py-6"
              />
            )}
            {currentStep === 7 && (
              <Input
                autoFocus
                value={formData.photos}
                onChange={(e) => setFormData({ ...formData, photos: e.target.value })}
                placeholder="https://..., https://..."
                className="text-lg py-6"
              />
            )}
            {currentStep === 8 && (
              <div className="text-center space-y-4">
                <div className="size-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground">You&apos;re all set!</h3>
                <p className="text-muted-foreground text-sm">
                  We have all the information we need to start generating high-converting AI ads for {formData.companyName || "your business"}.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </CardContent>

      <CardFooter className="flex justify-between p-6 bg-muted/10 border-t">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
          className="w-24"
        >
          Back
        </Button>
        <Button onClick={nextStep} className="w-32">
          {currentStep === STEPS.length - 1 ? "Complete Setup" : "Next"}
        </Button>
      </CardFooter>
    </Card>
  );
}
