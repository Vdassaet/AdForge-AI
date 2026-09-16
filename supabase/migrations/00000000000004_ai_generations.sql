-- ============================================================
-- Migration 04: AI Ad Generations History
-- ============================================================

CREATE TABLE IF NOT EXISTS ai_generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    service TEXT NOT NULL,
    location TEXT NOT NULL,
    offer TEXT NOT NULL,
    target_audience TEXT,
    tone TEXT NOT NULL DEFAULT 'Professional',
    cta TEXT NOT NULL DEFAULT 'Call Now',
    additional_instructions TEXT,
    output_data JSONB NOT NULL, -- headlines, primary_texts, descriptions, ctas, concepts
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_generations_org ON ai_generations(organization_id);
CREATE INDEX IF NOT EXISTS idx_ai_generations_created ON ai_generations(created_at);

ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their AI generations"
    ON ai_generations FOR ALL
    USING (organization_id IN (SELECT organization_id FROM user_roles WHERE user_id = auth.uid()));
