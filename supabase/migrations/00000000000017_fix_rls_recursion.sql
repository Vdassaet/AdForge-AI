-- ============================================================
-- Migration 17: Fix RLS infinite-recursion on user_roles
-- ============================================================
--
-- PROBLEM
-- -------
-- The original policies on `user_roles` (migration 00) contain
-- sub-queries like:
--
--   USING (organization_id IN (
--     SELECT organization_id FROM user_roles WHERE user_id = auth.uid()
--   ))
--
-- When Postgres evaluates a SELECT/UPDATE/DELETE on `user_roles`,
-- it must first check the RLS policy.  But the policy itself does a
-- SELECT on `user_roles`, which triggers the *same* policy again →
-- infinite recursion → "infinite recursion detected in policy for
-- relation user_roles".
--
-- FIX
-- ---
-- 1. Create a SECURITY DEFINER helper function that reads
--    `user_roles` **bypassing RLS** (safe because it is owned by
--    the `postgres` superuser role and only returns organisation IDs
--    for the calling user – never for other users).
--
-- 2. Create a second helper that also checks the caller's role
--    within an organisation (owner / admin) for write operations.
--
-- 3. Drop the four old self-referencing policies on `user_roles`.
--
-- 4. Re-create safe, non-recursive replacement policies that call
--    the helper functions.
--
-- 5. Replace policies on the `organizations` table so they also
--    benefit from the helper (consistency).
--
-- 6. Add WITH CHECK clauses where writes are allowed.
--
-- AUTHORISATION MODEL (summary)
-- ─────────────────────────────
--  • Every authenticated user may SELECT rows in `user_roles` that
--    belong to any organisation the user is a member of.
--  • Only owners may INSERT / UPDATE / DELETE rows in `user_roles`
--    for organisations they own.
--  • Every authenticated user may SELECT organisations they belong to.
--  • Only owners / admins may UPDATE their organisation row.
--  • New user_roles rows can only be inserted for organisations
--    where the inserting user is already an owner (WITH CHECK).
-- ============================================================


-- ────────────────────────────────────────────────────────────────
-- 1. SECURITY DEFINER helper: get the current user's org IDs
-- ────────────────────────────────────────────────────────────────
-- This function runs as the DB owner, so it is NOT subject to RLS
-- on `user_roles`.  It only ever returns rows belonging to the
-- calling user (auth.uid()), so no privilege escalation is possible.

CREATE OR REPLACE FUNCTION public.get_user_org_ids()
RETURNS SETOF UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id
  FROM   public.user_roles
  WHERE  user_id = auth.uid();
$$;

-- Revoke EXECUTE from public; only authenticated users need it.
REVOKE ALL ON FUNCTION public.get_user_org_ids() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_user_org_ids() TO authenticated;

COMMENT ON FUNCTION public.get_user_org_ids() IS
  'Returns organisation IDs the current user belongs to. '
  'SECURITY DEFINER – bypasses RLS on user_roles to prevent infinite recursion.';


-- ────────────────────────────────────────────────────────────────
-- 2. SECURITY DEFINER helper: check role within an organisation
-- ────────────────────────────────────────────────────────────────
-- Returns TRUE when the calling user holds one of the supplied
-- roles in the given organisation.

CREATE OR REPLACE FUNCTION public.user_has_org_role(
  _org_id UUID,
  _roles  TEXT[]
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM   public.user_roles
    WHERE  user_id         = auth.uid()
      AND  organization_id = _org_id
      AND  role            = ANY(_roles)
  );
$$;

REVOKE ALL ON FUNCTION public.user_has_org_role(UUID, TEXT[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.user_has_org_role(UUID, TEXT[]) TO authenticated;

COMMENT ON FUNCTION public.user_has_org_role(UUID, TEXT[]) IS
  'Returns TRUE if the current user holds any of the given roles in the '
  'specified organisation.  SECURITY DEFINER – bypasses RLS to avoid recursion.';


-- ────────────────────────────────────────────────────────────────
-- 3. Drop old self-referencing policies on user_roles
-- ────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users can view roles for their organizations"   ON user_roles;
DROP POLICY IF EXISTS "Owners can manage organization roles"           ON user_roles;


-- ────────────────────────────────────────────────────────────────
-- 4. Create safe replacement policies on user_roles
-- ────────────────────────────────────────────────────────────────

-- SELECT: members can see all roles within their organisations.
CREATE POLICY "user_roles_select"
  ON user_roles FOR SELECT
  TO authenticated
  USING (
    organization_id IN (SELECT public.get_user_org_ids())
  );

-- INSERT: only owners can add members to their organisations.
CREATE POLICY "user_roles_insert"
  ON user_roles FOR INSERT
  TO authenticated
  WITH CHECK (
    public.user_has_org_role(organization_id, ARRAY['owner'])
  );

-- UPDATE: only owners can change roles within their organisations.
CREATE POLICY "user_roles_update"
  ON user_roles FOR UPDATE
  TO authenticated
  USING (
    public.user_has_org_role(organization_id, ARRAY['owner'])
  )
  WITH CHECK (
    public.user_has_org_role(organization_id, ARRAY['owner'])
  );

-- DELETE: only owners can remove members from their organisations.
CREATE POLICY "user_roles_delete"
  ON user_roles FOR DELETE
  TO authenticated
  USING (
    public.user_has_org_role(organization_id, ARRAY['owner'])
  );


-- ────────────────────────────────────────────────────────────────
-- 5. Replace policies on organizations (use helper for consistency)
-- ────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users can view their organizations"    ON organizations;
DROP POLICY IF EXISTS "Owners can update their organizations" ON organizations;

-- SELECT: users can see organisations they belong to.
CREATE POLICY "organizations_select"
  ON organizations FOR SELECT
  TO authenticated
  USING (
    id IN (SELECT public.get_user_org_ids())
  );

-- UPDATE: only owners/admins can modify the organisation row.
CREATE POLICY "organizations_update"
  ON organizations FOR UPDATE
  TO authenticated
  USING (
    public.user_has_org_role(id, ARRAY['owner', 'admin'])
  )
  WITH CHECK (
    public.user_has_org_role(id, ARRAY['owner', 'admin'])
  );
