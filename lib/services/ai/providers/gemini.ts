import { AIProvider } from "../types";
import { AdGenerationOutput } from "../schema";

export class GeminiProvider implements AIProvider {
  get modelName(): string {
    return "gemini-1.5-pro";
  }

  async generateAdCopy(): Promise<AdGenerationOutput> {
    throw new Error("Gemini Provider is not implemented yet. Add @google/generative-ai and implement generateAdCopy.");
  }
}
