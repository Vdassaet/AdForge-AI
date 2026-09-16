/**
 * Unit Tests for Server-Side Authorization Context
 *
 * Tests cover:
 *  1. Unauthenticated access → AuthError (UNAUTHENTICATED)
 *  2. Authenticated user with no org → AuthError (NO_ORGANIZATION)
 *  3. Member role → can use standard actions, blocked from admin actions
 *  4. Owner/Admin role → can use all actions including admin
 *  5. Demo mode bypass via ADFORGE_DEMO_MODE env var
 *  6. assertRole guard
 *
 * These tests mock the Supabase client to avoid needing a real database.
 */

import { test, describe, beforeEach, afterEach, mock } from "node:test";
import assert from "node:assert/strict";

// ---------------------------------------------------------------------------
// Mock setup — must be defined before importing the module under test
// ---------------------------------------------------------------------------

// We store mock return values here so each test can configure them
let mockUser: { id: string } | null = null;
let mockMembership: { organization_id: string; role: string } | null = null;
let mockMembershipError: Error | null = null;
let mockSubscription: { plan_id: string } | null = null;

// Build a chainable query builder mock
function createQueryBuilder(data: unknown, error: unknown = null) {
  const builder = {
    select: () => builder,
    eq: () => builder,
    limit: () => builder,
    single: () => Promise.resolve({ data, error }),
  };
  return builder;
}

// Mock the Supabase createClient function
const mockSupabaseClient = {
  auth: {
    getUser: async () => ({
      data: { user: mockUser },
      error: mockUser ? null : new Error("No session"),
    }),
  },
  from: (table: string) => {
    if (table === "user_roles") {
      return createQueryBuilder(mockMembership, mockMembershipError);
    }
    if (table === "subscriptions") {
      return createQueryBuilder(mockSubscription);
    }
    return createQueryBuilder(null);
  },
};

// Register the mock BEFORE importing the module under test
mock.module("@/lib/supabase/server", {
  namedExports: {
    createClient: () => mockSupabaseClient,
  },
});

// Now import the module under test (it will pick up the mock)
const { getAuthContext, assertRole, AuthError } = await import(
  "../../lib/auth/auth-context"
);

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("getAuthContext()", () => {
  beforeEach(() => {
    // Reset mocks to unauthenticated state
    mockUser = null;
    mockMembership = null;
    mockMembershipError = null;
    mockSubscription = null;
    // Ensure demo mode is off
    delete process.env.ADFORGE_DEMO_MODE;
  });

  afterEach(() => {
    delete process.env.ADFORGE_DEMO_MODE;
  });

  // ---- 1. Unauthenticated access ----

  test("throws UNAUTHENTICATED when no user session exists", async () => {
    mockUser = null;

    await assert.rejects(() => getAuthContext(), (err: unknown) => {
      assert.ok(err instanceof AuthError);
      assert.equal((err as InstanceType<typeof AuthError>).code, "UNAUTHENTICATED");
      assert.ok((err as InstanceType<typeof AuthError>).message.includes("logged in"));
      return true;
    });
  });

  // ---- 2. No organization ----

  test("throws NO_ORGANIZATION when user has no org membership", async () => {
    mockUser = { id: "user-123" };
    mockMembership = null;
    mockMembershipError = new Error("No rows");

    await assert.rejects(() => getAuthContext(), (err: unknown) => {
      assert.ok(err instanceof AuthError);
      assert.equal((err as InstanceType<typeof AuthError>).code, "NO_ORGANIZATION");
      return true;
    });
  });

  // ---- 3. Member access ----

  test("returns context with member role and free plan (no subscription)", async () => {
    mockUser = { id: "user-456" };
    mockMembership = { organization_id: "org-abc", role: "member" };
    mockSubscription = null; // no active subscription → defaults to "free"

    const ctx = await getAuthContext();

    assert.equal(ctx.userId, "user-456");
    assert.equal(ctx.organizationId, "org-abc");
    assert.equal(ctx.planId, "free");
    assert.equal(ctx.role, "member");
  });

  // ---- 4. Owner access with active subscription ----

  test("returns context with owner role and active plan", async () => {
    mockUser = { id: "user-789" };
    mockMembership = { organization_id: "org-xyz", role: "owner" };
    mockSubscription = { plan_id: "pro" };

    const ctx = await getAuthContext();

    assert.equal(ctx.userId, "user-789");
    assert.equal(ctx.organizationId, "org-xyz");
    assert.equal(ctx.planId, "pro");
    assert.equal(ctx.role, "owner");
  });

  // ---- 5. Admin access ----

  test("returns context with admin role", async () => {
    mockUser = { id: "user-admin" };
    mockMembership = { organization_id: "org-123", role: "admin" };
    mockSubscription = { plan_id: "starter" };

    const ctx = await getAuthContext();

    assert.equal(ctx.role, "admin");
    assert.equal(ctx.planId, "starter");
  });

  // ---- 6. Demo mode bypass ----

  test("returns demo context when ADFORGE_DEMO_MODE is true", async () => {
    process.env.ADFORGE_DEMO_MODE = "true";
    mockUser = null; // Not authenticated — but demo mode should bypass

    const ctx = await getAuthContext();

    assert.equal(ctx.userId, "demo-user");
    assert.equal(ctx.organizationId, "00000000-0000-0000-0000-000000000000");
    assert.equal(ctx.planId, "free");
    assert.equal(ctx.role, "owner");
  });

  test("does NOT use demo mode when ADFORGE_DEMO_MODE is false", async () => {
    process.env.ADFORGE_DEMO_MODE = "false";
    mockUser = null;

    await assert.rejects(() => getAuthContext(), (err: unknown) => {
      assert.ok(err instanceof AuthError);
      assert.equal((err as InstanceType<typeof AuthError>).code, "UNAUTHENTICATED");
      return true;
    });
  });
});

describe("assertRole()", () => {
  test("does not throw when role is in allowed list", () => {
    const ctx = {
      userId: "u1",
      organizationId: "o1",
      planId: "free",
      role: "owner" as const,
    };

    // Should not throw
    assertRole(ctx, ["owner", "admin"]);
  });

  test("throws FORBIDDEN when role is not in allowed list", () => {
    const ctx = {
      userId: "u1",
      organizationId: "o1",
      planId: "free",
      role: "member" as const,
    };

    assert.throws(
      () => assertRole(ctx, ["owner", "admin"]),
      (err: unknown) => {
        assert.ok(err instanceof AuthError);
        assert.equal((err as InstanceType<typeof AuthError>).code, "FORBIDDEN");
        assert.ok((err as InstanceType<typeof AuthError>).message.includes("member"));
        return true;
      }
    );
  });

  test("admin can access owner+admin guarded actions", () => {
    const ctx = {
      userId: "u2",
      organizationId: "o2",
      planId: "pro",
      role: "admin" as const,
    };

    // Should not throw
    assertRole(ctx, ["owner", "admin"]);
  });

  test("member cannot access owner-only actions", () => {
    const ctx = {
      userId: "u3",
      organizationId: "o3",
      planId: "free",
      role: "member" as const,
    };

    assert.throws(
      () => assertRole(ctx, ["owner"]),
      (err: unknown) => {
        assert.ok(err instanceof AuthError);
        assert.equal((err as InstanceType<typeof AuthError>).code, "FORBIDDEN");
        return true;
      }
    );
  });
});
