-- ============================================================
-- Migration 13: Call Tracking Architecture
-- ============================================================

CREATE TABLE IF NOT EXISTS calls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    phone_number TEXT NOT NULL,
    direction TEXT NOT NULL CHECK (direction IN ('incoming', 'outgoing')),
    status TEXT NOT NULL CHECK (status IN ('answered', 'missed', 'failed', 'busy')),
    duration INTEGER NOT NULL DEFAULT 0, -- in seconds
    recording_url TEXT,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_calls_org ON calls(organization_id);
CREATE INDEX IF NOT EXISTS idx_calls_lead ON calls(lead_id);
CREATE INDEX IF NOT EXISTS idx_calls_campaign ON calls(campaign_id);
CREATE INDEX IF NOT EXISTS idx_calls_started_at ON calls(started_at);

ALTER TABLE calls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage calls"
    ON calls FOR ALL
    USING (organization_id IN (SELECT organization_id FROM user_roles WHERE user_id = auth.uid()));
