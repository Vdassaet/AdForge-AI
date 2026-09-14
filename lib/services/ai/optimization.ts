export type ActionType = 
  | 'increase_budget'
  | 'decrease_budget'
  | 'pause_ad'
  | 'enable_ad'
  | 'change_creative'
  | 'change_audience';

export interface AIRecommendation {
  id: string;
  organization_id: string;
  campaign_id?: string;
  title: string;
  explanation: string;
  evidence: string;
  confidence: number;
  action_type: ActionType;
  action_payload: Record<string, unknown>;
  impact_metric: string;
  impact_value: string;
  status: 'pending' | 'applied' | 'dismissed' | 'failed';
  created_at: string;
}

/**
 * Optimization Engine interface for AI-driven campaign analysis.
 */
export interface IOptimizationEngine {
  /**
   * Analyzes current campaign performance metrics and generates recommendations.
   * This would typically call Gemini/OpenAI under the hood.
   */
  generateRecommendations(organizationId: string): Promise<AIRecommendation[]>;

  /**
   * Applies a specific recommendation safely.
   */
  applyRecommendation(recommendationId: string): Promise<boolean>;

  /**
   * Dismisses a recommendation without applying.
   */
  dismissRecommendation(recommendationId: string): Promise<boolean>;
}

export class OptimizationEngine implements IOptimizationEngine {
  async generateRecommendations(organizationId: string): Promise<AIRecommendation[]> {
    // Mock implementation for development
    // In production, this gathers data from `analytics_daily` and sends it to the AI LLM
    console.log(`[AI Engine] Analyzing performance for org ${organizationId}...`);
    
    return [
      {
        id: "mock-rec-1",
        organization_id: organizationId,
        title: "Pause Underperforming Creative",
        explanation: "The 'Vinyl Fencing' creative has a significantly lower Click-Through Rate (CTR) compared to the historical average for this audience.",
        evidence: "Creative 2 CTR: 0.8% (Avg is 2.1%). Cost per Lead is $45 (Avg is $25).",
        confidence: 92,
        action_type: "pause_ad",
        action_payload: { ad_id: "ad_12345" },
        impact_metric: "Cost per Lead",
        impact_value: "-$20.00",
        status: "pending",
        created_at: new Date().toISOString(),
      },
      {
        id: "mock-rec-2",
        organization_id: organizationId,
        title: "Scale Winning Campaign",
        explanation: "Campaign 'Fall 2026 Promo' is generating leads at an exceptionally low cost. Scaling the budget by 20% is recommended.",
        evidence: "CPL is $18.50 with a Conversion Rate of 4.2%. High ROAS potential.",
        confidence: 85,
        action_type: "increase_budget",
        action_payload: { campaign_id: "camp_889", increase_percentage: 20 },
        impact_metric: "Lead Volume",
        impact_value: "+12 Leads/mo",
        status: "pending",
        created_at: new Date().toISOString(),
      }
    ];
  }

  async applyRecommendation(recommendationId: string): Promise<boolean> {
    console.log(`[AI Engine] Applying recommendation ${recommendationId}...`);
    // 1. Fetch recommendation from DB
    // 2. Map `action_type` to MetaService or GoogleService execution
    // 3. Wait for confirmation
    // 4. Update DB status to 'applied' and write to audit log
    return true;
  }

  async dismissRecommendation(recommendationId: string): Promise<boolean> {
    console.log(`[AI Engine] Dismissing recommendation ${recommendationId}...`);
    // Update DB status to 'dismissed'
    return true;
  }
}

export const optimizationEngine = new OptimizationEngine();
