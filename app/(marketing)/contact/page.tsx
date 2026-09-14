"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call for the marketing site
    setTimeout(() => {
      toast.success("Message sent successfully. We will get back to you shortly.");
      setIsSubmitting(false);
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-6">Contact Us</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Have questions about Contractor AI Ads? Our team is here to help.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Get in touch</h2>
          <p className="text-slate-600 mb-8">
            Fill out the form and our support team will respond within 24 business hours. Whether you need help setting up your first campaign or have questions about our enterprise agency plans, we are ready to assist.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Mail className="h-6 w-6 text-blue-600 shrink-0" />
              <div>
                <h3 className="font-semibold text-slate-900">Email</h3>
                <p className="text-slate-600">support@contractoraiads.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MessageSquare className="h-6 w-6 text-blue-600 shrink-0" />
              <div>
                <h3 className="font-semibold text-slate-900">Live Chat</h3>
                <p className="text-slate-600">Available Monday - Friday, 9am - 5pm EST within the dashboard.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="h-6 w-6 text-blue-600 shrink-0" />
              <div>
                <h3 className="font-semibold text-slate-900">Office</h3>
                <p className="text-slate-600">123 Software Ave, Suite 100<br/>San Francisco, CA 94107</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium text-slate-900">First Name</label>
                <Input id="firstName" required placeholder="John" />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium text-slate-900">Last Name</label>
                <Input id="lastName" required placeholder="Doe" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-900">Email Address</label>
              <Input id="email" type="email" required placeholder="john@example.com" />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-slate-900">Message</label>
              <Textarea 
                id="message" 
                required 
                placeholder="How can we help you?" 
                rows={5} 
                className="resize-none"
              />
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
