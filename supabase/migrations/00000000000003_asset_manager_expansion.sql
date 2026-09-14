-- ============================================================
-- Migration 03: Asset Manager (Media Storage)
-- ============================================================

CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL, -- image/jpeg, video/mp4, etc.
    file_size BIGINT NOT NULL, -- bytes
    dimensions TEXT, -- e.g. 1920x1080
    category TEXT NOT NULL CHECK (category IN ('Logo', 'Project', 'Before & After', 'Service', 'Team', 'Vehicle', 'Other')),
    description TEXT,
    tags TEXT[] DEFAULT '{}',
    is_favorite BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assets_org ON assets(organization_id);
CREATE INDEX IF NOT EXISTS idx_assets_category ON assets(category);
CREATE INDEX IF NOT EXISTS idx_assets_fav ON assets(is_favorite);

ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their organization assets"
    ON assets FOR ALL
    USING (organization_id IN (SELECT organization_id FROM user_roles WHERE user_id = auth.uid()));
