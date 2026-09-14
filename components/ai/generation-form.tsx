"use client";

import { useState } from "react";
import { PromptInput } from "@/lib/services/ai/schema";
import { Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GenerationFormProps {
  onGenerate: (data: PromptInput) => Promise<void>;
  isLoading: boolean;
}

export function GenerationForm({ onGenerate, isLoading }: GenerationFormProps) {
  const [formData, setFormData] = useState<PromptInput>({
    business: "NJ Fence and Railing",
    service: "Aluminum Railing Installation",
    location: "New Jersey and Rockland County",
    offer: "Free Estimate",
    targetCustomer: "Homeowners looking to upgrade exterior safety and aesthetics",
    cta: "Call Now",
    tone: "Professional",
    additionalInstructions: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="business">Business Name</Label>
        <Input 
          id="business"
          name="business" 
          value={formData.business} 
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="service">Service / Product</Label>
        <Input 
          id="service"
          name="service" 
          value={formData.service} 
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Target Location</Label>
        <Input 
          id="location"
          name="location" 
          value={formData.location} 
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="offer">Offer / Promotion (Optional)</Label>
        <Input 
          id="offer"
          name="offer" 
          value={formData.offer} 
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cta">Call to Action (CTA)</Label>
          <Input 
            id="cta"
            name="cta" 
            value={formData.cta} 
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tone">Brand Tone</Label>
          <select 
            id="tone"
            name="tone" 
            value={formData.tone} 
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="Professional">Professional</option>
            <option value="Friendly">Friendly</option>
            <option value="Urgent">Urgent</option>
            <option value="Premium">Premium</option>
            <option value="Local">Local</option>
            <option value="Direct">Direct</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="additionalInstructions">Additional Instructions (Optional)</Label>
        <textarea 
          id="additionalInstructions"
          name="additionalInstructions" 
          value={formData.additionalInstructions} 
          onChange={handleChange}
          rows={3}
          placeholder="e.g. Focus on our 10-year warranty..."
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full gap-2"
        size="lg"
      >
        <Wand2 className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        {isLoading ? "Generating Magic..." : "Generate Ad Concepts"}
      </Button>
    </form>
  );
}
