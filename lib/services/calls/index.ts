import { CallTrackingProvider } from "./provider";

class CallService {
  private provider: CallTrackingProvider | null = null;

  /**
   * Registers the active provider (e.g., TwilioProvider).
   * In a real system, this would be injected or loaded based on organization config.
   */
  setProvider(provider: CallTrackingProvider) {
    this.provider = provider;
  }

  /**
   * Check if a provider is configured for the organization.
   */
  isConfigured(): boolean {
    // Hardcoded to false to trigger the setup screen (no fake data)
    return false;
  }

  async getCalls() {
    if (!this.isConfigured()) {
      throw new Error("Call provider not configured");
    }
    // Return DB calls
    return [];
  }
}

export const callService = new CallService();
export * from "./provider";
