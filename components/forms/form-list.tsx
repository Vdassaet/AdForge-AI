"use client";

import { useState } from "react";
import { ExternalLink, Settings, Plus, Code, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function FormList() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const MOCK_FORMS = [
    {
      id: "f8c3de3d-1fea-4d7c-a8b0-29f63c4c34a1",
      name: "Main Website Lead Form",
      views: 1250,
      submissions: 45,
      conversionRate: "3.6%",
      is_active: true
    },
    {
      id: "d9e2a1b5-6f1c-4b5a-9d2e-3f8c5a4b1d2e",
      name: "Landing Page - Fencing Promo",
      views: 850,
      submissions: 62,
      conversionRate: "7.2%",
      is_active: true
    }
  ];

  const copyEmbedCode = (id: string) => {
    // In production, base URL would be dynamic
    const embedCode = `<iframe src="https://app.contractoraiads.com/f/${id}" width="100%" height="600" frameborder="0" style="border:none; border-radius: 12px; overflow: hidden;"></iframe>`;
    navigator.clipboard.writeText(embedCode);
    setCopiedId(id);
    toast.success("Embed code copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Active Forms</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage and embed your lead generation forms.</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> Create Form
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_FORMS.map((form) => (
          <Card key={form.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold leading-none">{form.name}</CardTitle>
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-semibold rounded-full border border-green-500/20">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                Active
              </span>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="grid grid-cols-3 gap-4 rounded-lg bg-muted/50 p-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Views</p>
                  <p className="text-xl font-bold text-foreground">{form.views}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Submissions</p>
                  <p className="text-xl font-bold text-foreground">{form.submissions}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Conv. Rate</p>
                  <p className="text-xl font-bold text-foreground">{form.conversionRate}</p>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="bg-muted/30 border-t p-4 flex items-center justify-between mt-auto">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/f/${form.id}`} target="_blank">
                    <ExternalLink className="w-4 h-4 mr-2" /> Preview
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyEmbedCode(form.id)}
                  className={copiedId === form.id ? "text-green-600 border-green-200 bg-green-50 hover:bg-green-100 hover:text-green-700 dark:bg-green-950 dark:border-green-900" : ""}
                >
                  {copiedId === form.id ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Code className="w-4 h-4 mr-2" />}
                  {copiedId === form.id ? "Copied" : "Embed"}
                </Button>
              </div>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Settings className="w-5 h-5" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
