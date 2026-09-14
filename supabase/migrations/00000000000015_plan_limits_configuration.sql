-- ============================================================
-- Migration 15: Configurable Plan Limits & Administration
-- ============================================================

CREATE TABLE IF NOT EXISTS plan_configurations (
    id TEXT PRIMARY KEY, -- 'free', 'starter', 'pro', 'agency'
    name TEXT NOT NULL,
    price INTEGER NOT NULL DEFAULT 0,
    ai_generations_limit INTEGER NOT NULL, -- -1 for unlimited
    creatives_limit INTEGER NOT NULL,
    campaigns_limit INTEGER NOT NULL,
    ad_accounts_limit INTEGER NOT NULL DEFAULT 1,
    leads_limit INTEGER NOT NULL DEFAULT 50,
    is_custom BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Seed initial default plan limits
INSERT INTO plan_configurations (id, name, price, ai_generations_limit, creatives_limit, campaigns_limit, ad_accounts_limit, leads_limit, is_custom)
VALUES
    ('free', 'Free', 0, 10, 5, 1, 1, 50, false),
    ('starter', 'Starter', 49, 100, 50, 5, 2, 500, false),
    ('pro', 'Pro', 149, 500, 250, 25, 5, 5000, false),
    ('agency', 'Agency', 499, -1, -1, -1, -1, -1, true)
ON CONFLICT (id) DO UPDATE SET
    ai_generations_limit = EXCLUDED.ai_generations_limit,
    creatives_limit = EXCLUDED.creatives_limit,
    campaigns_limit = EXCLUDED.campaigns_limit,
    ad_accounts_limit = EXCLUDED.ad_accounts_limit,
    leads_limit = EXCLUDED.leads_limit,
    is_custom = EXCLUDED.is_custom;

ALTER TABLE plan_configurations ENABLE ROW LEVEL SECURITY;

-- Everyone can view plan configurations
CREATE POLICY "Plan configurations are viewable by all authenticated users"
    ON plan_configurations FOR SELECT
    TO authenticated, anon
    USING (true);

-- Only platform owners/admins can update plan configurations
CREATE POLICY "Only admins can update plan configurations"
    ON plan_configurations FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
        )
    );
