/**
 * Server-Side Authorization Context
 *
 * This module provides a single entry point for all Server Actions to resolve
 * the authenticated user's identity, organization, plan, and role.
 *
 * SECURITY: organizationId and planId are NEVER accepted from client arguments.
 * They are always resolved server-side from the authenticated Supabase session.
 *
 * DEMO MODE: Controlled exclusively by the server-only env var ADFORGE_DEMO_MODE.
 * When enabled, a safe demo context is returned without touching the database.
 */

import { createClient } from "@/lib/supabase/server";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AuthContext {
  userId: string;
  organizationId: string;
  planId: string;
  role: "owner" | "admin" | "member";
}

export class AuthError extends Error {
  public readonly code: "UNAUTHENTICATED" | "NO_ORGANIZATION" | "FORBIDDEN";

  constructor(
    message: string,
    code: "UNAUTHENTICATED" | "NO_ORGANIZATION" | "FORBIDDEN"
  ) {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
}

// ---------------------------------------------------------------------------
// Demo mode context (server-only env var — never exposed to the browser)
// ---------------------------------------------------------------------------

const DEMO_ORG_ID = "00000000-0000-0000-0000-000000000000";

function isDemoMode(): boolean {
  return process.env.ADFORGE_DEMO_MODE === "true";
}

function getDemoContext(): AuthContext {
  return {
    userId: "demo-user",
    organizationId: DEMO_ORG_ID,
    planId: "free",
    role: "owner",
  };
}

// ---------------------------------------------------------------------------
// Main helper — called at the top of every Server Action
// ---------------------------------------------------------------------------

/**
 * Resolves the current user's auth context from the Supabase session.
 *
 * 1. Validates the JWT via supabase.auth.getUser() (not getSession — getUser
 *    hits the Supabase Auth server and cannot be spoofed with a tampered JWT).
 * 2. Looks up the user's organization membership and role in `user_roles`.
 * 3. Looks up the organization's active plan from `subscriptions` (falls back
 *    to "free" if no subscription row exists).
 *
 * @throws {AuthError} if the user is not authenticated or has no organization.
 */
export async function getAuthContext(): Promise<AuthContext> {
  // --- Demo bypass (server-only) ---
  if (isDemoMode()) {
    return getDemoContext();
  }

  const supabase = createClient();

  // 1. Authenticate — getUser() validates the JWT server-side
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new AuthError(
      "You must be logged in to perform this action.",
      "UNAUTHENTICATED"
    );
  }

  // 2. Resolve organization membership & role
  const { data: membership, error: membershipError } = await supabase
    .from("user_roles")
    .select("organization_id, role")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (membershipError || !membership) {
    throw new AuthError(
      "You are not a member of any organization. Please complete onboarding.",
      "NO_ORGANIZATION"
    );
  }

  // 3. Resolve the organization's active plan (default to "free")
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan")
    .eq("organization_id", membership.organization_id)
    .eq("status", "active")
    .limit(1)
    .single();

  const planId = subscription?.plan ?? "free";

  return {
    userId: user.id,
    organizationId: membership.organization_id,
    planId,
    role: membership.role as "owner" | "admin" | "member",
  };
}

// ---------------------------------------------------------------------------
// Role guard helpers
// ---------------------------------------------------------------------------

/**
 * Asserts that the authenticated user holds one of the required roles.
 * Use for admin-only operations like updating plan limits.
 *
 * @throws {AuthError} with code "FORBIDDEN" if the role check fails.
 */
export function assertRole(
  ctx: AuthContext,
  allowedRoles: Array<"owner" | "admin" | "member">
): void {
  if (!allowedRoles.includes(ctx.role)) {
    throw new AuthError(
      `This action requires one of these roles: ${allowedRoles.join(", ")}. Your role: ${ctx.role}.`,
      "FORBIDDEN"
    );
  }
}
