import { AIProvider } from "./types";
import { MockAIProvider } from "./providers/mock";
import { GeminiProvider } from "./providers/gemini";
import { OpenAIProvider } from "./providers/openai";

export function getAIProvider(): AIProvider {

  const providerType = process.env.AI_PROVIDER || "mock";

  switch (providerType.toLowerCase()) {
    case "gemini":
      return new GeminiProvider();
    case "openai":
      return new OpenAIProvider();
    case "mock":
    default:
      return new MockAIProvider();
  }
}

export * from "./types";
export * from "./schema";
