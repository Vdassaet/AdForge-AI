-- ============================================================
-- Migration 01: Auth Triggers & User Onboarding
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    org_id UUID;
BEGIN
    -- Create personal organization for new user
    INSERT INTO public.organizations (name, slug)
    VALUES (
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)) || '''s Org',
        LOWER(REGEXP_REPLACE(split_part(NEW.email, '@', 1) || '-' || SUBSTRING(NEW.id::text, 1, 8), '[^a-zA-Z0-9-]', '-', 'g'))
    )
    RETURNING id INTO org_id;

    -- Assign user as owner of the organization
    INSERT INTO public.user_roles (user_id, organization_id, role)
    VALUES (NEW.id, org_id, 'owner');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
