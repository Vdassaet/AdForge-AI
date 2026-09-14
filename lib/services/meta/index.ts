import { MetaService } from "./types";
import { MockMetaService } from "./mock";

// Normally we would have a LiveMetaService here that implements the actual Axios/fetch calls
// For architecture setup, we return the mock or throw an error if real credentials exist but aren't implemented.

export function getMetaService(): MetaService {
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;

  if (appId && appSecret) {
    // Return live implementation when built. 
    // For now, we return mock to allow testing the UI flows even if keys are set.
    return new MockMetaService();
  }

  return new MockMetaService();
}

export * from "./types";
