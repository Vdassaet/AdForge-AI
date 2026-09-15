"use client";

import { useState, useEffect } from "react";
import { Users, Phone, Mail, CheckCircle2, XCircle, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Lead {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  status: string;
  service?: string;
  created_at: string;
}

export default function LeadsPage() {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function loadLeads() {
      const { data } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        setLeads(data);
      }
      setLoading(false);
    }
    loadLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-lg mx-auto text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-primary/10 p-6 rounded-full mb-2">
          <Users className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          No leads yet.
        </h1>
        <p className="text-lg text-muted-foreground">
          Once customers respond to your ads, their contact information will appear right here.
        </p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "new": return "bg-blue-100 text-blue-800 border-blue-200";
      case "contacted": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "qualified": return "bg-purple-100 text-purple-800 border-purple-200";
      case "won": return "bg-green-100 text-green-800 border-green-200";
      case "lost": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "new": return <Clock className="h-3.5 w-3.5 mr-1" />;
      case "won": return <CheckCircle2 className="h-3.5 w-3.5 mr-1" />;
      case "lost": return <XCircle className="h-3.5 w-3.5 mr-1" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Your Leads</h1>
        <p className="text-muted-foreground mt-1">Manage customers who contacted you through your ads.</p>
      </div>

      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        {/* Desktop View (Table) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 border-b text-muted-foreground uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Interest</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {leads.map(lead => (
                <tr key={lead.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-base">{lead.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-muted-foreground">
                      {lead.phone && (
                        <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 hover:text-foreground">
                          <Phone className="h-3.5 w-3.5" /> {lead.phone}
                        </a>
                      )}
                      {lead.email && (
                        <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 hover:text-foreground">
                          <Mail className="h-3.5 w-3.5" /> {lead.email}
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">{lead.service || "General Inquiry"}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${getStatusColor(lead.status)}`}>
                      {getStatusIcon(lead.status)}
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-muted-foreground">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View (Cards) */}
        <div className="md:hidden divide-y">
          {leads.map(lead => (
            <div key={lead.id} className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{lead.name}</h3>
                  <p className="text-sm text-muted-foreground">{lead.service || "General Inquiry"}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${getStatusColor(lead.status)}`}>
                  {lead.status}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-3 pt-2">
                {lead.phone && (
                  <a href={`tel:${lead.phone}`} className="flex-1 flex items-center justify-center gap-2 bg-secondary text-secondary-foreground py-2 rounded-lg font-medium text-sm">
                    <Phone className="h-4 w-4" /> Call
                  </a>
                )}
                {lead.email && (
                  <a href={`mailto:${lead.email}`} className="flex-1 flex items-center justify-center gap-2 border py-2 rounded-lg font-medium text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" /> Email
                  </a>
                )}
              </div>
              <p className="text-xs text-right text-muted-foreground pt-1">
                {new Date(lead.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
