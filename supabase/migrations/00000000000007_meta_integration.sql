-- ============================================================
-- Migration 07: Meta / Facebook / Instagram Integration
-- ============================================================

CREATE TABLE IF NOT EXISTS meta_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL UNIQUE REFERENCES organizations(id) ON DELETE CASCADE,
    access_token TEXT NOT NULL, -- Encrypted at application layer
    token_expires_at TIMESTAMPTZ,
    facebook_page_id TEXT,
    facebook_page_name TEXT,
    instagram_actor_id TEXT,
    ad_account_id TEXT,
    ad_account_name TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_meta_connections_org ON meta_connections(organization_id);

ALTER TABLE meta_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage Meta connection"
    ON meta_connections FOR ALL
    USING (organization_id IN (SELECT organization_id FROM user_roles WHERE user_id = auth.uid()));
