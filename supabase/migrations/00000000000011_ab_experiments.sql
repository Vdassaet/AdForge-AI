-- ============================================================
-- Migration 11: A/B Testing & Experiments
-- ============================================================

CREATE TABLE IF NOT EXISTS ab_experiments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    variable TEXT NOT NULL CHECK (variable IN ('headline', 'primary_text', 'creative', 'cta')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'running', 'completed', 'paused')),
    variant_a JSONB NOT NULL,
    variant_b JSONB NOT NULL,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    winner TEXT CHECK (winner IN ('variant_a', 'variant_b', 'inconclusive')),
    confidence NUMERIC(5, 2), -- e.g. 95.4%
    sample_size INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ab_experiments_org ON ab_experiments(organization_id);
CREATE INDEX IF NOT EXISTS idx_ab_experiments_campaign ON ab_experiments(campaign_id);

ALTER TABLE ab_experiments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage A/B experiments"
    ON ab_experiments FOR ALL
    USING (organization_id IN (SELECT organization_id FROM user_roles WHERE user_id = auth.uid()));
