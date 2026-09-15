"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, Phone, MessageSquare, Users, Globe, Image as ImageIcon, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function CreateAdWizard() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    service: "",
    location: "",
    goal: "",
  });
  const [adCopy, setAdCopy] = useState({ headline: "", primaryText: "", cta: "", image: "" });

  const handleNext = async () => {
    if (step === 2) {
      // Simulate AI generating ad copy when moving to step 3
      setLoading(true);
      await new Promise(r => setTimeout(r, 1500));
      setAdCopy({
        headline: `Expert ${formData.service || "Services"} in ${formData.location || "Your Area"}`,
        primaryText: `Looking for reliable ${formData.service || "services"}? ${formData.businessName || "We"} offer top-rated solutions tailored to your needs. Contact us today to get started!`,
        cta: formData.goal === "calls" ? "Call Now" : formData.goal === "messages" ? "Send Message" : formData.goal === "leads" ? "Get Quote" : "Learn More",
        image: "Professional photo of your service"
      });
      setLoading(false);
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    } else if (step === 4) {
      await handleLaunch();
    } else {
      setStep(step + 1);
    }
  };

  const handleLaunch = async () => {
    setLoading(true);
    // Insert campaign into Supabase
    const { data: userData } = await supabase.auth.getUser();
    if (userData.user) {
      await supabase.from("campaigns").insert({
        name: `${formData.service} Campaign`,
        status: "active",
        daily_budget: 20,
        location: formData.location,
        user_id: userData.user.id
      });
    }
    
    // Fallback delay to show loading state
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    router.push("/dashboard");
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Progress */}
      <div className="flex items-center justify-between mb-12 relative">
        <div className="absolute left-0 top-1/2 w-full h-1 bg-muted -z-10 -translate-y-1/2"></div>
        <div className="absolute left-0 top-1/2 h-1 bg-primary -z-10 -translate-y-1/2 transition-all" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
        {[
          { num: 1, label: "Business" },
          { num: 2, label: "Goal" },
          { num: 3, label: "Your Ad" },
          { num: 4, label: "Launch" },
        ].map(s => (
          <div key={s.num} className="flex flex-col items-center bg-background px-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= s.num ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {step > s.num ? <Check className="h-4 w-4" /> : s.num}
            </div>
            <span className={`text-xs font-medium mt-2 ${step >= s.num ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-card border rounded-2xl shadow-sm p-6 md:p-10 min-h-[400px] flex flex-col">
        {step === 1 && (
          <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-3xl font-bold mb-2">What are you advertising?</h2>
            <p className="text-muted-foreground mb-8">Tell us a bit about your business. We&apos;ll use this to create your ad.</p>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Business name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Acme Roofing" 
                  value={formData.businessName}
                  onChange={e => setFormData({...formData, businessName: e.target.value})}
                  className="w-full h-12 px-4 rounded-lg border bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">What do you sell? (Service/Product)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Roof repair and installation" 
                  value={formData.service}
                  onChange={e => setFormData({...formData, service: e.target.value})}
                  className="w-full h-12 px-4 rounded-lg border bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Service area</label>
                <input 
                  type="text" 
                  placeholder="e.g. Austin, Texas" 
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  className="w-full h-12 px-4 rounded-lg border bg-background"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-3xl font-bold mb-2">What do you want customers to do?</h2>
            <p className="text-muted-foreground mb-8">Choose your main goal for this ad.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: "calls", icon: Phone, label: "Get more calls", desc: "Customers call your business directly" },
                { id: "messages", icon: MessageSquare, label: "Get more messages", desc: "Customers message you on Messenger/WhatsApp" },
                { id: "leads", icon: Users, label: "Get more leads", desc: "Collect customer info using a form" },
                { id: "website", icon: Globe, label: "Get website visitors", desc: "Send customers to your website" },
              ].map(goal => (
                <button
                  key={goal.id}
                  onClick={() => setFormData({...formData, goal: goal.id})}
                  className={`flex items-start gap-4 p-5 rounded-xl border-2 text-left transition-all ${formData.goal === goal.id ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/30'}`}
                >
                  <div className={`p-3 rounded-full ${formData.goal === goal.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    <goal.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{goal.label}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{goal.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-3xl font-bold mb-2">Your ad is ready</h2>
            <p className="text-muted-foreground mb-8">Here is what your customers will see. We used AI to write this for you.</p>
            
            <div className="bg-muted/30 border rounded-xl overflow-hidden max-w-sm mx-auto shadow-sm">
              <div className="p-4 border-b bg-background flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center font-bold text-primary">
                  {formData.businessName ? formData.businessName.charAt(0) : "B"}
                </div>
                <div>
                  <p className="font-bold text-sm leading-none">{formData.businessName || "Your Business"}</p>
                  <p className="text-xs text-muted-foreground mt-1">Sponsored</p>
                </div>
              </div>
              <div className="p-4 bg-background text-sm">
                {adCopy.primaryText}
              </div>
              <div className="aspect-square bg-muted flex flex-col items-center justify-center text-muted-foreground border-y relative">
                <ImageIcon className="h-10 w-10 mb-2 opacity-50" />
                <span className="text-xs font-medium px-4 text-center">AI Suggestion: {adCopy.image}</span>
              </div>
              <div className="p-4 bg-muted/10 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-bold mb-1">Local Business</p>
                  <p className="font-bold">{adCopy.headline}</p>
                </div>
                <div className="px-4 py-2 bg-secondary text-secondary-foreground font-bold text-sm rounded-lg border shadow-sm">
                  {adCopy.cta}
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-6 gap-3">
              <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-secondary text-secondary-foreground">Regenerate copy</button>
              <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-secondary text-secondary-foreground">Edit manually</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-3xl font-bold mb-2">Ready to launch</h2>
            <p className="text-muted-foreground mb-8">Review your campaign details before connecting your Facebook account.</p>
            
            <div className="bg-muted/20 border rounded-xl p-6 space-y-4 max-w-lg mx-auto">
              <div className="flex justify-between items-center border-b pb-4">
                <span className="text-muted-foreground font-medium">Business</span>
                <span className="font-bold">{formData.businessName}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-4">
                <span className="text-muted-foreground font-medium">Goal</span>
                <span className="font-bold capitalize">{formData.goal || "Get Calls"}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-4">
                <span className="text-muted-foreground font-medium">Location</span>
                <span className="font-bold">{formData.location}</span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="text-muted-foreground font-medium">Daily Budget</span>
                <span className="font-bold text-primary">$20.00 / day</span>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <p className="text-sm text-muted-foreground mb-4">You will need to connect your Facebook & Instagram account to launch.</p>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-8 pt-6 border-t flex justify-between">
          <button 
            onClick={() => setStep(step - 1)} 
            className={`px-6 py-2.5 font-semibold rounded-lg ${step === 1 ? 'invisible' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
          >
            Back
          </button>
          
          <button 
            onClick={handleNext}
            disabled={loading || (step === 1 && (!formData.businessName || !formData.service || !formData.location)) || (step === 2 && !formData.goal)}
            className="px-8 py-2.5 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {step === 3 ? "Looks good" : step === 4 ? "Connect Facebook & Launch" : "Continue"}
            {step < 3 && !loading && <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
