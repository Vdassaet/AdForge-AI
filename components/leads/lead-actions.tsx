"use client";

import { Phone, Mail, Copy, Check } from "lucide-react";
import { useState } from "react";

interface LeadActionsProps {
  phone: string;
  email: string;
}

export function LeadActions({ phone, email }: LeadActionsProps) {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopy = (text: string, type: 'phone' | 'email') => {
    navigator.clipboard.writeText(text);
    if (type === 'phone') {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } else {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex items-center">
        <a 
          href={`tel:${phone}`}
          className="flex-1 sm:flex-none flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-l-md font-medium text-sm transition-colors border border-transparent"
        >
          <Phone className="w-4 h-4 mr-2" />
          Call
        </a>
        <button 
          onClick={() => handleCopy(phone, 'phone')}
          className="flex items-center justify-center bg-white hover:bg-slate-50 text-slate-600 px-3 py-2 rounded-r-md border-y border-r border-slate-300 font-medium text-sm transition-colors"
          title="Copy Phone"
        >
          {copiedPhone ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex items-center">
        <a 
          href={`mailto:${email}`}
          className="flex-1 sm:flex-none flex items-center justify-center bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-l-md font-medium text-sm transition-colors border-y border-l border-slate-300"
        >
          <Mail className="w-4 h-4 mr-2" />
          Email
        </a>
        <button 
          onClick={() => handleCopy(email, 'email')}
          className="flex items-center justify-center bg-white hover:bg-slate-50 text-slate-600 px-3 py-2 rounded-r-md border border-slate-300 font-medium text-sm transition-colors"
          title="Copy Email"
        >
          {copiedEmail ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
