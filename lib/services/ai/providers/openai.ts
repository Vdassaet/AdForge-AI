import { AIProvider } from "../types";
import { PromptInput, AdGenerationOutput } from "../schema";
import { adCopyJsonSchema, buildAdCopyPrompt, fetchWithTimeout, parseAdCopy } from "./shared";

export class OpenAIProvider implements AIProvider {
  get modelName(): string {
    return process.env.OPENAI_MODEL || "gpt-4o-mini";
  }

  async generateAdCopy(params: PromptInput): Promise<AdGenerationOutput> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");
    const response = await fetchWithTimeout("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: this.modelName,
        input: buildAdCopyPrompt(params),
        max_output_tokens: 1800,
        text: { format: { type: "json_schema", name: "ad_copy", strict: true, schema: adCopyJsonSchema } },
      }),
      cache: "no-store",
    });
    const payload = (await response.json()) as { output_text?: string; error?: { message?: string } };
    if (!response.ok || !payload.output_text) throw new Error(payload.error?.message || "OpenAI did not return ad copy.");
    return parseAdCopy(JSON.parse(payload.output_text));
  }
}
