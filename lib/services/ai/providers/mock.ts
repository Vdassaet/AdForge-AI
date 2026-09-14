import { AIProvider } from "../types";
import { PromptInput, AdGenerationOutput } from "../schema";

export class MockAIProvider implements AIProvider {
  get modelName(): string {
    return "mock-provider-local";
  }

  async generateAdCopy(params: PromptInput): Promise<AdGenerationOutput> {
    // Dynamic delay: instantaneous in test runs, snappy yet realistic (800ms) in interactive dev
    const delay = process.env.NODE_ENV === "test" ? 10 : 800;
    await new Promise((resolve) => setTimeout(resolve, delay));

    return {
      headlines: [
        `Top Rated ${params.service} in ${params.location}`,
        `Affordable ${params.service} - Get a Free Quote`,
        `${params.business}: Your Trusted Local Experts`,
        `Transform Your Property with our ${params.service}`,
        `Fast & Reliable ${params.service} Services`,
      ],
      primaryTexts: [
        `Looking for the best ${params.service} in ${params.location}? ${params.business} provides top-notch quality and service. ${params.offer ? `Take advantage of our ${params.offer} today.` : ''}`,
        `Don't settle for less. Our experienced team guarantees satisfaction for all your ${params.service} needs. ${params.cta}!`,
        `We are ${params.location}'s premier choice for ${params.service}. Our focus on quality sets us apart from the rest.`,
        `Upgrade your home with our professional ${params.service}. We make the process simple and stress-free.`,
        `Need ${params.service}? We've got you covered. Trusted by hundreds of homeowners in ${params.location}.`,
      ],
      descriptions: [
        "Quality you can trust. Fully licensed & insured.",
        "Serving the local community for over 10 years.",
        "Expert craftsmanship with premium materials.",
        "Quick turnaround times and transparent pricing.",
        "Your satisfaction is our number one priority.",
      ],
      ctas: [
        params.cta,
        "Get Your Free Estimate",
        "Contact Us Today",
        "Learn More",
        "Book Now",
      ],
      campaignConcepts: [
        {
          name: "Local Authority",
          rationale: `Focuses on establishing ${params.business} as the go-to neighborhood expert in ${params.location}. Highlights trust and proximity.`,
        },
        {
          name: "Value & Offer Driven",
          rationale: `Centers the ad entirely around the "${params.offer}" to drive immediate conversions from price-conscious buyers.`,
        },
        {
          name: "Premium Transformation",
          rationale: `Uses high-quality visuals of past ${params.service} projects to sell the emotional benefit of a beautiful home upgrade.`,
        },
      ],
    };
  }
}
