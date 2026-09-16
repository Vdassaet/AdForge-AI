-- ============================================================
-- Migration 18: Organization Spend Controls
-- ============================================================
-- These limits are application safety rails. They do not replace the limits
-- configured directly in Meta Ads Manager or Google Ads.

CREATE TABLE IF NOT EXISTS organization_spend_limits (
    organization_id UUID PRIMARY KEY REFERENCES organizations(id) ON DELETE CASCADE,
    currency CHAR(3) NOT NULL DEFAULT 'USD' CHECK (currency ~ '^[A-Z]{3}$'),
    max_daily_budget NUMERIC(12, 2) NOT NULL DEFAULT 50.00 CHECK (max_daily_budget >= 1),
    max_campaign_budget NUMERIC(12, 2) NOT NULL DEFAULT 300.00 CHECK (max_campaign_budget >= 1),
    monthly_budget_cap NUMERIC(12, 2) NOT NULL DEFAULT 1000.00 CHECK (monthly_budget_cap >= 1),
    max_cost_per_lead NUMERIC(12, 2) CHECK (max_cost_per_lead > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE campaigns
    ADD COLUMN IF NOT EXISTS currency CHAR(3) NOT NULL DEFAULT 'USD' CHECK (currency ~ '^[A-Z]{3}$'),
    ADD COLUMN IF NOT EXISTS budget_confirmed_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS spend_guard_status TEXT NOT NULL DEFAULT 'not_configured'
        CHECK (spend_guard_status IN ('not_configured', 'within_limit', 'paused_budget_cap', 'paused_cpl_cap'));

ALTER TABLE organization_spend_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their organization spend controls"
    ON organization_spend_limits FOR SELECT
    USING (organization_id IN (SELECT public.get_user_org_ids()));

CREATE POLICY "Owners and admins can update organization spend controls"
    ON organization_spend_limits FOR UPDATE
    USING (public.user_has_org_role(organization_id, ARRAY['owner', 'admin']))
    WITH CHECK (public.user_has_org_role(organization_id, ARRAY['owner', 'admin']));

CREATE POLICY "Owners and admins can create organization spend controls"
    ON organization_spend_limits FOR INSERT
    WITH CHECK (public.user_has_org_role(organization_id, ARRAY['owner', 'admin']));

COMMENT ON TABLE organization_spend_limits IS
    'Safety limits selected by each organization. Platform-level limits must also be configured in the ad network.';
