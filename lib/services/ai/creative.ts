export interface CreativeInput {
  businessProfile: string;
  service: string;
  location: string;
  offer: string;
  cta: string;
  selectedPhotoUrl?: string;
  aiGeneratedCopy: {
    headline: string;
    primaryText: string;
    description: string;
  };
}

export interface CreativeConcept {
  headline: string;
  primaryText: string;
  description: string;
  cta: string;
  imageInstructions: string;
  layoutInstructions: string;
}

export interface CreativeProvider {
  get modelName(): string;
  generateCreativeConcept(params: CreativeInput): Promise<CreativeConcept>;
}
