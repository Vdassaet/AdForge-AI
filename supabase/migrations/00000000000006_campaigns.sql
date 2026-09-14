-- ============================================================
-- Migration 06: Campaign Builder & Management
-- ============================================================

CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    creative_id UUID REFERENCES ad_creatives(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    objective TEXT NOT NULL CHECK (objective IN ('Leads', 'Website Traffic', 'Calls', 'Messages', 'Awareness')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'ready', 'publishing', 'active', 'paused', 'completed', 'failed')),
    daily_budget NUMERIC(10, 2),
    lifetime_budget NUMERIC(10, 2),
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    service TEXT,
    location TEXT,
    audience TEXT,
    cta TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaigns_org ON campaigns(organization_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage campaigns"
    ON campaigns FOR ALL
    USING (organization_id IN (SELECT organization_id FROM user_roles WHERE user_id = auth.uid()));
