-- ============================================================
-- Migration 19: Atomic, server-only public lead submission
-- ============================================================
-- This function is intentionally not executable by anon/authenticated roles.
-- The Next.js server action invokes it with the Supabase service-role key after
-- applying request-level anti-abuse checks.

CREATE OR REPLACE FUNCTION public.record_public_lead(
    _form_id UUID,
    _name TEXT,
    _phone TEXT,
    _email TEXT,
    _service TEXT,
    _message TEXT,
    _address TEXT,
    _preferred_date TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    _organization_id UUID;
    _lead_id UUID;
BEGIN
    SELECT organization_id
      INTO _organization_id
      FROM public.lead_forms
     WHERE id = _form_id
       AND is_active = TRUE;

    IF _organization_id IS NULL THEN
        RAISE EXCEPTION 'Active lead form not found';
    END IF;

    INSERT INTO public.leads (
        organization_id, name, phone, email, source, service, location, message, status, notes
    ) VALUES (
        _organization_id, _name, NULLIF(_phone, ''), NULLIF(_email, ''), 'Website',
        NULLIF(_service, ''), NULLIF(_address, ''), NULLIF(_message, ''), 'new',
        CASE WHEN NULLIF(_preferred_date, '') IS NULL THEN NULL
             ELSE 'Preferred date: ' || _preferred_date END
    ) RETURNING id INTO _lead_id;

    INSERT INTO public.lead_events (lead_id, event_type, description, metadata)
    VALUES (_lead_id, 'created', 'Lead submitted through a public form',
            jsonb_build_object('form_id', _form_id));

    UPDATE public.lead_forms
       SET submissions_count = submissions_count + 1,
           updated_at = NOW()
     WHERE id = _form_id;

    RETURN _lead_id;
END;
$$;

REVOKE ALL ON FUNCTION public.record_public_lead(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_public_lead(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO service_role;

COMMENT ON FUNCTION public.record_public_lead IS
    'Atomically records an active public form submission. Callable only by the server service role.';
