"use client";

import { AdGenerationOutput } from "@/lib/services/ai/schema";
import { Copy, Save, Megaphone, Edit3, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface GenerationResultsProps {
  results: AdGenerationOutput | null;
}

export function GenerationResults({ results }: GenerationResultsProps) {
  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] border-2 border-dashed border-border rounded-xl bg-muted/20 text-muted-foreground transition-colors hover:bg-muted/50">
        <div className="size-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-muted-foreground/60" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-1">No concepts generated yet</h3>
        <p className="text-sm max-w-sm text-center">Fill out the form and click Generate to see AI-powered concepts tailored to your business.</p>
      </div>
    );
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const renderCard = (title: string, text: string) => (
    <Card className="group overflow-hidden transition-all hover:shadow-md hover:border-primary/20">
      <CardContent className="p-5">
        <p className="text-sm text-foreground leading-relaxed">{text}</p>
        <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-primary" onClick={() => handleCopy(text)}>
            <Copy className="w-3 h-3 mr-1.5" /> Copy
          </Button>
          <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-primary" onClick={() => toast.info("Edit mode not implemented yet")}>
            <Edit3 className="w-3 h-3 mr-1.5" /> Edit
          </Button>
          <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-primary" onClick={() => toast.success("Saved to your library!")}>
            <Save className="w-3 h-3 mr-1.5" /> Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Campaign Concepts */}
      <section>
        <h3 className="text-lg font-bold tracking-tight text-foreground mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Campaign Concepts
        </h3>
        <div className="space-y-4">
          {results.campaignConcepts.map((concept, i) => (
            <Card key={i} className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-primary">{concept.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80 mb-4">{concept.rationale}</p>
                <Button variant="default" size="sm" onClick={() => toast.success("Campaign template applied!")}>
                  <Megaphone className="w-4 h-4 mr-2" /> Use this concept
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Headlines */}
      <section>
        <h3 className="text-lg font-bold tracking-tight text-foreground mb-4">Headlines</h3>
        <div className="grid gap-3">
          {results.headlines.map((headline, i) => renderCard(`Headline ${i + 1}`, headline))}
        </div>
      </section>

      {/* Primary Texts */}
      <section>
        <h3 className="text-lg font-bold tracking-tight text-foreground mb-4">Primary Texts</h3>
        <div className="grid gap-3">
          {results.primaryTexts.map((text, i) => renderCard(`Primary Text ${i + 1}`, text))}
        </div>
      </section>

      {/* CTAs */}
      <section>
        <h3 className="text-lg font-bold tracking-tight text-foreground mb-4">Call to Action (CTAs)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {results.ctas.map((cta, i) => renderCard(`CTA ${i + 1}`, cta))}
        </div>
      </section>
    </motion.div>
  );
}
