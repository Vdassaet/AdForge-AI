-- ============================================================
-- Migration 16: Scaling & Performance Optimizations
-- ============================================================
-- Designed for scaling from 10 to 10,000+ customers.
-- Adds composite indexes for hot query paths, optimized RLS helpers,
-- and webhook idempotency tracking.

-- 1. High-Performance Composite Indexes for High-Frequency Reads
-- Leads: Filter by org + sort by recency or filter by status
CREATE INDEX IF NOT EXISTS idx_leads_org_created 
    ON leads(organization_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_leads_org_status 
    ON leads(organization_id, status);

-- Usage Events: Monthly quota checks require filtering by org, event_type, and created_at
CREATE INDEX IF NOT EXISTS idx_usage_events_org_period 
    ON usage_events(organization_id, event_type, created_at DESC);

-- Campaigns: Filter by org and status with recency ordering
CREATE INDEX IF NOT EXISTS idx_campaigns_org_status_created 
    ON campaigns(organization_id, status, created_at DESC);

-- Notifications: Filter unread alerts for notification bell and active feeds
CREATE INDEX IF NOT EXISTS idx_notifications_org_unread 
    ON notifications(organization_id, is_read, created_at DESC);

-- Daily Analytics: Campaign breakdown queries over date ranges
CREATE INDEX IF NOT EXISTS idx_analytics_daily_org_camp_date 
    ON analytics_daily(organization_id, campaign_id, date DESC);

-- Lead Timeline Events: Fetch chronologically for a specific lead
CREATE INDEX IF NOT EXISTS idx_lead_events_lead_created 
    ON lead_events(lead_id, created_at DESC);

-- User Roles: Speed up permission checks in RLS policies
CREATE INDEX IF NOT EXISTS idx_user_roles_lookup 
    ON user_roles(user_id, organization_id, role);

-- 2. Webhook Idempotency & Deduplication Store
-- Prevents duplicate billing mutations, double credits, and race conditions
CREATE TABLE IF NOT EXISTS webhook_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider TEXT NOT NULL CHECK (provider IN ('stripe', 'meta', 'sendgrid', 'twilio', 'custom')),
    event_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'processed', 'failed', 'ignored')),
    payload JSONB DEFAULT '{}'::jsonb,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    CONSTRAINT uq_webhook_provider_event UNIQUE (provider, event_id)
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_lookup 
    ON webhook_events(provider, event_id);

CREATE INDEX IF NOT EXISTS idx_webhook_events_created 
    ON webhook_events(created_at DESC);

-- 3. High-Efficiency RLS Helper Functions
-- PostgreSQL query planner caches STABLE SECURITY DEFINER functions per query/statement,
-- eliminating repeated row-by-row subquery evaluation across thousands of rows.

CREATE OR REPLACE FUNCTION get_auth_user_organizations()
RETURNS SETOF UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT organization_id 
    FROM user_roles 
    WHERE user_id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION is_org_member(check_org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM user_roles 
        WHERE user_id = auth.uid() 
          AND organization_id = check_org_id
    );
$$;

CREATE OR REPLACE FUNCTION is_org_admin(check_org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM user_roles 
        WHERE user_id = auth.uid() 
          AND organization_id = check_org_id 
          AND role IN ('owner', 'admin')
    );
$$;
