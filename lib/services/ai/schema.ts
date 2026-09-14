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
  business: z.string(),
  service: z.string(),
  location: z.string(),
  offer: z.string().optional(),
  targetCustomer: z.string().optional(),
  cta: z.string(),
  tone: z.enum(["Professional", "Friendly", "Urgent", "Premium", "Local", "Direct"]),
  additionalInstructions: z.string().optional(),
});

export type PromptInput = z.infer<typeof promptInputSchema>;
