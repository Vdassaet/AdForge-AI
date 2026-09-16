import { AIProvider } from "../types";
import { PromptInput, AdGenerationOutput } from "../schema";
import { adCopyJsonSchema, buildAdCopyPrompt, fetchWithTimeout, parseAdCopy } from "./shared";

export class GeminiProvider implements AIProvider {
  get modelName(): string {
    return process.env.GEMINI_MODEL || "gemini-2.5-flash";
  }

  async generateAdCopy(params: PromptInput): Promise<AdGenerationOutput> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");
    const response = await fetchWithTimeout(
      `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: buildAdCopyPrompt(params) }] }],
          generationConfig: { responseMimeType: "application/json", responseSchema: adCopyJsonSchema },
        }),
        cache: "no-store",
      }
    );
    const payload = (await response.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>; error?: { message?: string } };
    const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("");
    if (!response.ok || !text) throw new Error(payload.error?.message || "Gemini did not return ad copy.");
    return parseAdCopy(JSON.parse(text));
  }
}
