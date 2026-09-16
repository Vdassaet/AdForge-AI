import { adGenerationSchema, AdGenerationOutput, PromptInput } from "../schema";

export const adCopyJsonSchema = {
  type: "object", additionalProperties: false,
  properties: {
    headlines: { type: "array", items: { type: "string" }, minItems: 5, maxItems: 5 },
    primaryTexts: { type: "array", items: { type: "string" }, minItems: 5, maxItems: 5 },
    descriptions: { type: "array", items: { type: "string" }, minItems: 5, maxItems: 5 },
    ctas: { type: "array", items: { type: "string" }, minItems: 5, maxItems: 5 },
    campaignConcepts: { type: "array", minItems: 3, maxItems: 3, items: { type: "object", additionalProperties: false, properties: { name: { type: "string" }, rationale: { type: "string" } }, required: ["name", "rationale"] } },
  },
  required: ["headlines", "primaryTexts", "descriptions", "ctas", "campaignConcepts"],
} as const;

export function buildAdCopyPrompt(params: PromptInput): string {
  return `Create compliant advertising copy for a local business. Return JSON only matching the requested schema.
Business: ${params.business}
Service: ${params.service}
Location: ${params.location}
Offer: ${params.offer || "None supplied"}
Target customer: ${params.targetCustomer || "General local audience"}
Preferred CTA: ${params.cta}
Tone: ${params.tone}
Additional instructions: ${params.additionalInstructions || "None"}
Do not invent certifications, prices, discounts, guarantees, outcomes, or time-sensitive claims. Avoid discriminatory targeting and comply with Meta and Google advertising policies.`;
}

export function parseAdCopy(value: unknown): AdGenerationOutput {
  return adGenerationSchema.parse(value);
}

export async function fetchWithTimeout(input: RequestInfo | URL, init: RequestInit, timeoutMs = 20_000): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try { return await fetch(input, { ...init, signal: controller.signal }); }
  finally { clearTimeout(timeout); }
}
