-- ============================================================
-- Migration 02: Business Profiles, Services & Service Areas
-- ============================================================

CREATE TABLE IF NOT EXISTS business_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL UNIQUE REFERENCES organizations(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    industry TEXT NOT NULL DEFAULT 'Contractor',
    website_url TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    postal_code TEXT,
    years_in_business INTEGER DEFAULT 1,
    tone_of_voice TEXT DEFAULT 'Professional',
    unique_selling_proposition TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS business_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    estimated_price_range TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS business_service_areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    radius_miles INTEGER DEFAULT 25,
    postal_codes TEXT[] DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_business_profiles_org ON business_profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_business_services_org ON business_services(organization_id);
CREATE INDEX IF NOT EXISTS idx_business_areas_org ON business_service_areas(organization_id);

ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_service_areas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage business profile"
    ON business_profiles FOR ALL
    USING (organization_id IN (SELECT organization_id FROM user_roles WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage business services"
    ON business_services FOR ALL
    USING (organization_id IN (SELECT organization_id FROM user_roles WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage service areas"
    ON business_service_areas FOR ALL
    USING (organization_id IN (SELECT organization_id FROM user_roles WHERE user_id = auth.uid()));
