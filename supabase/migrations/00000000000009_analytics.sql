-- ============================================================
-- Migration 09: Analytics Daily Aggregations
-- ============================================================

CREATE TABLE IF NOT EXISTS analytics_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    source TEXT NOT NULL DEFAULT 'Meta', -- Meta, Google, Website, Phone, Manual
    spend NUMERIC(10, 2) NOT NULL DEFAULT 0,
    impressions INTEGER NOT NULL DEFAULT 0,
    reach INTEGER NOT NULL DEFAULT 0,
    clicks INTEGER NOT NULL DEFAULT 0,
    leads INTEGER NOT NULL DEFAULT 0,
    calls INTEGER NOT NULL DEFAULT 0,
    conversions INTEGER NOT NULL DEFAULT 0,
    estimated_revenue NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(organization_id, campaign_id, date, source)
);

CREATE INDEX IF NOT EXISTS idx_analytics_org_date ON analytics_daily(organization_id, date);
CREATE INDEX IF NOT EXISTS idx_analytics_campaign ON analytics_daily(campaign_id);

ALTER TABLE analytics_daily ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view organization analytics"
    ON analytics_daily FOR ALL
    USING (organization_id IN (SELECT organization_id FROM user_roles WHERE user_id = auth.uid()));
