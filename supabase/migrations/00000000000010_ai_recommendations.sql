-- ============================================================
-- Migration 10: AI Campaign Recommendations
-- ============================================================

CREATE TABLE IF NOT EXISTS ai_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    explanation TEXT NOT NULL,
    evidence TEXT NOT NULL,
    confidence NUMERIC(3, 2) NOT NULL DEFAULT 0.85, -- e.g. 0.92 = 92%
    recommended_action TEXT NOT NULL,
    potential_impact TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'applied', 'dismissed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_recommendations_org ON ai_recommendations(organization_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_status ON ai_recommendations(status);

ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage AI recommendations"
    ON ai_recommendations FOR ALL
    USING (organization_id IN (SELECT organization_id FROM user_roles WHERE user_id = auth.uid()));
