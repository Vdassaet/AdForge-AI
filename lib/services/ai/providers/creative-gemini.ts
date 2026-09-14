import { CreativeProvider, CreativeConcept } from "../creative";

export class GeminiCreativeProvider implements CreativeProvider {
  get modelName(): string {
    return "gemini-imagen";
  }

  async generateCreativeConcept(): Promise<CreativeConcept> {
    throw new Error("Gemini Image API is not implemented yet.");
  }
}
