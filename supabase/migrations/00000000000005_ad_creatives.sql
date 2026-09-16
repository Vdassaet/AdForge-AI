-- ============================================================
-- Migration 05: Ad Creatives
-- ============================================================

CREATE TABLE IF NOT EXISTS ad_creatives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    format TEXT NOT NULL DEFAULT '1:1' CHECK (format IN ('1:1', '4:5', '9:16', '16:9')),
    headline TEXT NOT NULL,
    primary_text TEXT NOT NULL,
    description TEXT,
    cta TEXT NOT NULL DEFAULT 'Learn More',
    image_instructions TEXT,
    visual_layout_instructions TEXT,
    preview_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ad_creatives_org ON ad_creatives(organization_id);
CREATE INDEX IF NOT EXISTS idx_ad_creatives_asset ON ad_creatives(asset_id);

ALTER TABLE ad_creatives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage ad creatives"
    ON ad_creatives FOR ALL
    USING (organization_id IN (SELECT organization_id FROM user_roles WHERE user_id = auth.uid()));
