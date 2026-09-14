-- ============================================================
-- Migration 12: Embeddable Lead Forms
-- ============================================================

CREATE TABLE IF NOT EXISTS lead_forms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    title TEXT NOT NULL DEFAULT 'Get a Free Estimate',
    subtitle TEXT DEFAULT 'Fill out the form below and we will get back to you promptly.',
    fields_config JSONB NOT NULL DEFAULT '{"name": true, "phone": true, "email": true, "service": true, "message": true, "address": false, "preferred_date": false, "photo_upload": false}'::jsonb,
    theme_config JSONB NOT NULL DEFAULT '{"primary_color": "#2563eb", "button_text": "Request Quote"}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    views_count INTEGER NOT NULL DEFAULT 0,
    submissions_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lead_forms_org ON lead_forms(organization_id);

ALTER TABLE lead_forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage lead forms"
    ON lead_forms FOR ALL
    USING (organization_id IN (SELECT organization_id FROM user_roles WHERE user_id = auth.uid()));

-- Public policy for viewing active forms
CREATE POLICY "Public can view active lead forms"
    ON lead_forms FOR SELECT
    TO anon, authenticated
    USING (is_active = true);
