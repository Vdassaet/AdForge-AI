import { MetaService } from "./types";
import { LiveMetaService, MetaConfigurationError } from "./live";

export function getMetaService(): MetaService {
  if (!process.env.META_APP_ID || !process.env.META_APP_SECRET) {
    throw new MetaConfigurationError();
  }
  return new LiveMetaService();
}

export * from "./types";
export { MetaConfigurationError } from "./live";
