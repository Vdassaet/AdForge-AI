export interface VariantMetrics {
  variant_id: string;
  name: string;
  impressions: number;
  clicks: number;
  leads: number;
  spend: number;
}

export interface ABExperiment {
  id: string;
  organization_id: string;
  campaign_id: string;
  name: string;
  variable: 'Headline' | 'Primary Text' | 'Creative' | 'CTA';
  status: 'running' | 'completed' | 'stopped';
  start_date: string;
  end_date?: string;
  winner_variant_id?: string;
  confidence_level?: number;
  variant_a: VariantMetrics;
  variant_b: VariantMetrics;
}

export class ExperimentService {
  /**
   * Calculates the statistical significance between two variants using a simple
   * frequentist two-proportion Z-test approach (mocked for simplicity).
   * In a real application, a library like `jstat` would be used.
   */
  calculateSignificance(variantA: VariantMetrics, variantB: VariantMetrics) {
    const totalA = variantA.impressions;
    const totalB = variantB.impressions;
    const convA = variantA.leads;
    const convB = variantB.leads;

    // Guardrail: Do not claim significance without sufficient data
    if (totalA < 1000 || totalB < 1000 || (convA + convB) < 15) {
      return {
        hasEnoughData: false,
        confidence: 0,
        winner: null,
      };
    }

    const rateA = convA / totalA;
    const rateB = convB / totalB;

    // Simple mock logic for demonstration
    const diff = Math.abs(rateA - rateB);
    const confidence = Math.min(99.9, Math.max(0, 50 + (diff * 10000)));

    let winner = null;
    if (confidence > 95) {
      winner = rateA > rateB ? variantA.variant_id : variantB.variant_id;
    }

    return {
      hasEnoughData: true,
      confidence,
      winner,
    };
  }

  /**
   * Architecture prepared for future automatic winner selection
   * run by a cron job or background worker.
   */
  async autoSelectWinner(experimentId: string): Promise<boolean> {
    console.log(`[ExperimentService] Checking experiment ${experimentId} for auto-selection...`);
    // 1. Fetch metrics from DB / Meta
    // 2. run calculateSignificance()
    // 3. If confidence > 95% and hasEnoughData, pause loser and update DB
    return false; // Not implemented in V1
  }

  async declareManualWinner(experimentId: string, winnerId: string): Promise<boolean> {
    console.log(`[ExperimentService] Manually declaring ${winnerId} as winner for ${experimentId}`);
    // Update DB
    return true;
  }
}

export const experimentService = new ExperimentService();
