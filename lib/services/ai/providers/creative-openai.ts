import { CreativeProvider, CreativeConcept } from "../creative";

export class OpenAICreativeProvider implements CreativeProvider {
  get modelName(): string {
    return "dalle-3";
  }

  async generateCreativeConcept(): Promise<CreativeConcept> {
    throw new Error("OpenAI DALL-E API is not implemented yet.");
  }
}
