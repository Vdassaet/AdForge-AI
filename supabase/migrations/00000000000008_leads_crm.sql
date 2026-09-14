-- ============================================================
-- Migration 08: Leads CRM & Activity Timeline
-- ============================================================

CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    source TEXT NOT NULL DEFAULT 'Website', -- Meta, Website, Google, Call, Manual
    service TEXT,
    location TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'estimate', 'won', 'lost', 'spam')),
    assigned_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lead_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- created, status_changed, note_added, contacted, assigned
    description TEXT NOT NULL,
    performed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_org ON leads(organization_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_lead_events_lead ON lead_events(lead_id);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage leads"
    ON leads FOR ALL
    USING (organization_id IN (SELECT organization_id FROM user_roles WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage lead events"
    ON lead_events FOR ALL
    USING (lead_id IN (SELECT id FROM leads WHERE organization_id IN (SELECT organization_id FROM user_roles WHERE user_id = auth.uid())));
