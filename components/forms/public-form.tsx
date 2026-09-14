"use client";

import { useState } from "react";
import { submitPublicLeadForm } from "@/lib/services/forms/actions";
import { CheckCircle2, Loader2 } from "lucide-react";

interface PublicFormProps {
  formId: string;
}

export function PublicForm({ formId }: PublicFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("formId", formId);

    const result = await submitPublicLeadForm(formData);

    if (result.success) {
      setIsSuccess(true);
    } else {
      setError(result.error || "An error occurred");
    }
    
    setIsSubmitting(false);
  };

  if (isSuccess) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 max-w-md w-full mx-auto text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Request Received</h2>
        <p className="text-slate-600 mb-6">
          Thank you! We have received your request and will be in touch shortly to provide your estimate.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 max-w-md w-full mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Get a Free Estimate</h2>
        <p className="text-slate-500 text-sm mt-1">Fill out the form below and we&apos;ll get back to you within 24 hours.</p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Honeypot Field - Hidden from real users */}
        <div className="absolute opacity-0 -z-50 pointer-events-none" aria-hidden="true">
          <label htmlFor="website_url">Website</label>
          <input type="text" id="website_url" name="website_url" tabIndex={-1} autoComplete="off" />
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            required 
            className="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-10 px-3 border"
            placeholder="John Doe"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              required 
              className="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-10 px-3 border"
              placeholder="(555) 123-4567"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              className="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-10 px-3 border"
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="service" className="block text-sm font-medium text-slate-700 mb-1">Service Needed</label>
          <select 
            id="service" 
            name="service"
            className="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-10 px-3 border bg-white"
          >
            <option value="">Select a service...</option>
            <option value="Aluminum Fencing">Aluminum Fencing</option>
            <option value="Vinyl Railing">Vinyl Railing</option>
            <option value="Wood Repair">Wood Repair</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Project Details</label>
          <textarea 
            id="message" 
            name="message" 
            rows={4}
            className="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border resize-none"
            placeholder="Tell us a little bit about your project..."
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
              Submitting...
            </>
          ) : 'Get Free Estimate'}
        </button>
        <p className="text-center text-xs text-slate-400 mt-4">
          Your information is secure and will never be shared.
        </p>
      </form>
    </div>
  );
}
