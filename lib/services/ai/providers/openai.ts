import { AIProvider } from "../types";
import { AdGenerationOutput } from "../schema";

export class OpenAIProvider implements AIProvider {
  get modelName(): string {
    return "gpt-4o";
  }

  async generateAdCopy(): Promise<AdGenerationOutput> {
    throw new Error("OpenAI Provider is not implemented yet. Add openai and implement generateAdCopy.");
  }
}
