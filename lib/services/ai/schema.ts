import { z } from "zod";

export const adGenerationSchema = z.object({
  headlines: z.array(z.string()).length(5),
  primaryTexts: z.array(z.string()).length(5),
  descriptions: z.array(z.string()).length(5),
  ctas: z.array(z.string()).length(5),
  campaignConcepts: z.array(
    z.object({
      name: z.string(),
      rationale: z.string(),
    })
  ).length(3),
});

export type AdGenerationOutput = z.infer<typeof adGenerationSchema>;

export const promptInputSchema = z.object({
  business: z.string().trim().min(1).max(160),
  service: z.string().trim().min(1).max(300),
  location: z.string().trim().min(1).max(160),
  offer: z.string().trim().max(300).optional(),
  targetCustomer: z.string().trim().max(300).optional(),
  cta: z.string().trim().min(1).max(80),
  tone: z.enum(["Professional", "Friendly", "Urgent", "Premium", "Local", "Direct"]),
  additionalInstructions: z.string().trim().max(1000).optional(),
});

export type PromptInput = z.infer<typeof promptInputSchema>;
