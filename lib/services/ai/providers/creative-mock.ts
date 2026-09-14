import { CreativeProvider, CreativeInput, CreativeConcept } from "../creative";

export class MockCreativeProvider implements CreativeProvider {
  get modelName(): string {
    return "mock-creative-local";
  }

  async generateCreativeConcept(params: CreativeInput): Promise<CreativeConcept> {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return {
      headline: params.aiGeneratedCopy.headline,
      primaryText: params.aiGeneratedCopy.primaryText,
      description: params.aiGeneratedCopy.description,
      cta: params.cta,
      imageInstructions: "Use a high-contrast image of the completed project. Apply a subtle vignette to draw attention to the center. Overlay the logo in the top right corner.",
      layoutInstructions: "Place the headline at the bottom third of the image with a semi-transparent dark gradient behind it for readability. CTA should be a bright, contrasting color.",
    };
  }
}
