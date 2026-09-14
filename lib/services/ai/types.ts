import { PromptInput, AdGenerationOutput } from "./schema";

export interface AIProvider {
  /**
   * Identifies the provider and model being used.
   */
  get modelName(): string;

  /**
   * Generates structured ad copy based on the given prompt input.
   */
  generateAdCopy(params: PromptInput): Promise<AdGenerationOutput>;
}
