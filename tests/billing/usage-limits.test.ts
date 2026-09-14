import { test, describe, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_PLANS,
  getPlan,
  PLANS,
  USAGE_FEATURE_CONFIG,
  PlanId,
} from "../../lib/services/billing/plans";
import {
  usageService,
  UsageLimitExceededError,
  RateLimitExceededError,
} from "../../lib/services/billing/usage";
import { generateAdAction } from "../../app/(dashboard)/ai-ad-generator/actions";
import { saveCreativeAction } from "../../app/(dashboard)/creatives/actions";
import { publishCampaignAction } from "../../app/(dashboard)/campaigns/actions";
import {
  getPlanConfigurationsAction,
  updatePlanLimitsAction,
  resetPlanLimitsAction,
} from "../../app/(dashboard)/settings/plan-limits/actions";

describe("SaaS Plan Configuration & Limits", () => {
  beforeEach(() => {
    usageService.resetStateForTesting();
  });

  test("Centralized default plans match the required SaaS specification", () => {
    // FREE Plan: 10 AI generations, 5 creatives, 1 campaign
    const free = DEFAULT_PLANS.free;
    assert.equal(free.limits.ai_generations, 10, "Free plan must have 10 AI generations/month");
    assert.equal(free.limits.creatives, 5, "Free plan must have 5 creatives/month");
    assert.equal(free.limits.campaigns, 1, "Free plan must have 1 campaign");
    assert.equal(free.price, 0);

    // STARTER Plan: 100 AI generations, 50 creatives, 5 campaigns
    const starter = DEFAULT_PLANS.starter;
    assert.equal(starter.limits.ai_generations, 100, "Starter plan must have 100 AI generations/month");
    assert.equal(starter.limits.creatives, 50, "Starter plan must have 50 creatives/month");
    assert.equal(starter.limits.campaigns, 5, "Starter plan must have 5 campaigns");
    assert.equal(starter.price, 49);

    // PRO Plan: 500 AI generations, 250 creatives, 25 campaigns
    const pro = DEFAULT_PLANS.pro;
    assert.equal(pro.limits.ai_generations, 500, "Pro plan must have 500 AI generations/month");
    assert.equal(pro.limits.creatives, 250, "Pro plan must have 250 creatives/month");
    assert.equal(pro.limits.campaigns, 25, "Pro plan must have 25 campaigns");
    assert.equal(pro.price, 149);

    // AGENCY Plan: Custom (default -1 / unlimited)
    const agency = DEFAULT_PLANS.agency;
    assert.equal(agency.limits.ai_generations, -1, "Agency plan is custom/unlimited");
    assert.equal(agency.limits.creatives, -1, "Agency plan is custom/unlimited");
    assert.equal(agency.limits.campaigns, -1, "Agency plan is custom/unlimited");
    assert.equal(agency.isCustom, true);
  });

  test("getPlan returns default Free plan for unrecognized or empty plan IDs", () => {
    const fallback = getPlan("unknown_tier");
    assert.equal(fallback.id, "free");
    assert.equal(fallback.limits.ai_generations, 10);
  });

  test("USAGE_FEATURE_CONFIG maps all event types to appropriate plan limits and units", () => {
    assert.equal(USAGE_FEATURE_CONFIG.ai_generation.limitKey, "ai_generations");
    assert.equal(USAGE_FEATURE_CONFIG.creative.limitKey, "creatives");
    assert.equal(USAGE_FEATURE_CONFIG.campaign.limitKey, "campaigns");
    assert.equal(USAGE_FEATURE_CONFIG.ad_account.limitKey, "ad_accounts");
    assert.equal(USAGE_FEATURE_CONFIG.lead.limitKey, "leads");
  });
});

describe("Usage Status Calculation", () => {
  beforeEach(() => {
    usageService.resetStateForTesting();
  });

  test("Correctly computes usage when comfortably under plan limit", () => {
    const status = usageService.checkUsage("free", "ai_generation", 3);
    assert.equal(status.current, 3);
    assert.equal(status.limit, 10);
    assert.equal(status.remaining, 7);
    assert.equal(status.isAtLimit, false);
    assert.equal(status.percentUsed, 30);
    assert.equal(status.planName, "Free");
    assert.equal(status.recommendedUpgrade?.name, "Starter");
  });

  test("Correctly identifies when organization reaches exact limit", () => {
    const status = usageService.checkUsage("free", "ai_generation", 10);
    assert.equal(status.current, 10);
    assert.equal(status.limit, 10);
    assert.equal(status.remaining, 0);
    assert.equal(status.isAtLimit, true);
    assert.equal(status.percentUsed, 100);
  });

  test("Correctly clamps values when organization exceeds limit", () => {
    const status = usageService.checkUsage("free", "ai_generation", 15);
    assert.equal(status.current, 15);
    assert.equal(status.limit, 10);
    assert.equal(status.remaining, 0);
    assert.equal(status.isAtLimit, true);
    assert.equal(status.percentUsed, 100);
  });

  test("Handles unlimited custom agency plan without hitting limits", () => {
    const status = usageService.checkUsage("agency", "ai_generation", 12000);
    assert.equal(status.limit, -1);
    assert.equal(status.remaining, Infinity);
    assert.equal(status.isAtLimit, false);
    assert.equal(status.percentUsed, 0);
  });
});

describe("Event Recording Audit Trail", () => {
  beforeEach(() => {
    usageService.resetStateForTesting();
  });

  test("Records every single usage event with timestamp and metadata", async () => {
    const orgId = "org_test_audit";
    const event = await usageService.recordUsage(orgId, "ai_generation", {
      service: "Plumbing Repair",
      promptLength: 42,
      modelUsed: "mock-llm-v1",
    });

    assert.ok(event.id, "Event must have a generated unique ID");
    assert.equal(event.organizationId, orgId);
    assert.equal(event.eventType, "ai_generation");
    assert.equal(event.metadata.service, "Plumbing Repair");
    assert.equal(event.metadata.modelUsed, "mock-llm-v1");
    assert.ok(event.createdAt, "Event must record timestamp");

    // Verify event is tallied in the current period count
    const count = usageService.getUsageCount(orgId, "ai_generation");
    assert.equal(count, 1);
  });

  test("Maintains accurate counts across multiple different event types", async () => {
    const orgId = "org_multi_events";
    await usageService.recordUsage(orgId, "ai_generation");
    await usageService.recordUsage(orgId, "ai_generation");
    await usageService.recordUsage(orgId, "creative");
    await usageService.recordUsage(orgId, "campaign");

    assert.equal(usageService.getUsageCount(orgId, "ai_generation"), 2);
    assert.equal(usageService.getUsageCount(orgId, "creative"), 1);
    assert.equal(usageService.getUsageCount(orgId, "campaign"), 1);
    assert.equal(usageService.getUsageCount(orgId, "lead"), 0);

    const summary = usageService.getUsageSummary(orgId, "free");
    assert.equal(summary.ai_generation.current, 2);
    assert.equal(summary.creative.current, 1);
    assert.equal(summary.campaign.current, 1);
  });
});

describe("Usage Enforcement & Abuse Prevention", () => {
  beforeEach(() => {
    usageService.resetStateForTesting();
  });

  test("Allows actions when under quota", async () => {
    const orgId = "org_under_limit";
    const status = await usageService.assertCanPerformAction(orgId, "ai_generation", "free");
    assert.equal(status.isAtLimit, false);
    assert.equal(status.current, 0);
  });

  test("Throws UsageLimitExceededError when limit is reached (Does not silently fail)", async () => {
    const orgId = "org_at_limit";

    // Simulate exhausting all 10 free AI generations
    for (let i = 0; i < 10; i++) {
      await usageService.recordUsage(orgId, "ai_generation");
    }

    assert.equal(usageService.getUsageCount(orgId, "ai_generation"), 10);

    await assert.rejects(
      async () => {
        await usageService.assertCanPerformAction(orgId, "ai_generation", "free");
      },
      (err: Error) => {
        assert.ok(err instanceof UsageLimitExceededError, "Should throw UsageLimitExceededError");
        assert.equal((err as UsageLimitExceededError).usage.isAtLimit, true);
        assert.equal((err as UsageLimitExceededError).upgradeRequired, true);
        assert.match(err.message, /Usage limit reached for AI Generations/);
        return true;
      }
    );
  });

  test("Prevents burst abuse with RateLimitExceededError", async () => {
    const orgId = "org_spammer";

    // Rate limiter is configured for 20 requests per 10 seconds.
    // Triggering 20 calls will succeed, 21st must trigger rate limit.
    for (let i = 0; i < 20; i++) {
      await usageService.assertCanPerformAction(orgId, "creative", "pro");
    }

    await assert.rejects(
      async () => {
        await usageService.assertCanPerformAction(orgId, "creative", "pro");
      },
      (err: Error) => {
        assert.ok(err instanceof RateLimitExceededError, "Should throw RateLimitExceededError");
        assert.match(err.message, /Too many/);
        return true;
      }
    );
  });
});

describe("Admin Plan Limits Dynamic Configuration", () => {
  beforeEach(() => {
    usageService.resetStateForTesting();
  });

  test("Admins can view and update plan limits dynamically", async () => {
    const initialPlans = await getPlanConfigurationsAction();
    assert.equal(initialPlans.free.limits.ai_generations, 10);

    // Admin increases Free plan AI generations limit from 10 to 25
    const updateRes = await updatePlanLimitsAction("free", {
      ai_generations: 25,
      creatives: 12,
    });

    assert.equal(updateRes.success, true);
    assert.equal(updateRes.plan?.limits.ai_generations, 25);
    assert.equal(updateRes.plan?.limits.creatives, 12);

    // Verify usage service immediately enforces the new limit
    const updatedStatus = usageService.checkUsage("free", "ai_generation", 15);
    assert.equal(updatedStatus.limit, 25);
    assert.equal(updatedStatus.remaining, 10);
    assert.equal(updatedStatus.isAtLimit, false);
  });

  test("Admins can reset plan limits back to system defaults", async () => {
    // Admin modifies Starter plan
    await updatePlanLimitsAction("starter", { campaigns: 50 });
    assert.equal(PLANS.starter.limits.campaigns, 50);

    // Reset to defaults
    const resetRes = await resetPlanLimitsAction();
    assert.equal(resetRes.success, true);
    assert.equal(resetRes.plans.starter.limits.campaigns, 5);
    assert.equal(PLANS.starter.limits.campaigns, 5);
  });
});

describe("Server Actions Usage Enforcement Integration", () => {
  beforeEach(() => {
    usageService.resetStateForTesting();
  });

  test("generateAdAction enforces Free limit (10) and provides upgrade payload", async () => {
    const orgId = "org_action_ai";

    // 1st generation succeeds
    const res1 = await generateAdAction(
      {
        business: "Apex HVAC Services",
        service: "HVAC Repair",
        location: "Clifton, NJ",
        targetCustomer: "Homeowners",
        cta: "Call Now",
        tone: "Professional",
      },
      orgId,
      "free"
    );
    assert.ok(res1.data);
    assert.equal(res1.limitReached, undefined);

    // Fill up to limit of 10
    for (let i = 1; i < 10; i++) {
      await usageService.recordUsage(orgId, "ai_generation");
    }

    // 11th attempt hits limit
    const resBlocked = await generateAdAction(
      {
        business: "Apex HVAC Services",
        service: "HVAC Repair",
        location: "Clifton, NJ",
        targetCustomer: "Homeowners",
        cta: "Call Now",
        tone: "Professional",
      },
      orgId,
      "free"
    );

    assert.equal(resBlocked.limitReached, true, "Should flag limitReached");
    assert.equal(resBlocked.upgradeRequired, true, "Should flag upgradeRequired");
    assert.ok(resBlocked.usage, "Must return usage breakdown");
    assert.equal(resBlocked.usage?.isAtLimit, true);
    assert.match(resBlocked.error || "", /Usage limit reached/);
  });

  test("saveCreativeAction enforces Free limit (5) and records creative usage", async () => {
    const orgId = "org_action_creative";

    // 1st creative succeeds and records event
    const res1 = await saveCreativeAction(
      {
        businessName: "Test Roofing",
        headline: "Roof Repair Deals",
        primaryText: "Call us today",
        description: "test.com",
        cta: "Get Quote",
        imageUrl: "https://example.com/roof.jpg",
        aspectRatio: "1:1",
      },
      orgId,
      "free"
    );
    assert.equal(res1.success, true);
    assert.equal(usageService.getUsageCount(orgId, "creative"), 1);

    // Fill up remaining 4
    for (let i = 1; i < 5; i++) {
      await usageService.recordUsage(orgId, "creative");
    }

    // 6th attempt is blocked
    const resBlocked = await saveCreativeAction(
      {
        businessName: "Test Roofing",
        headline: "Roof Repair Deals",
        primaryText: "Call us today",
        description: "test.com",
        cta: "Get Quote",
        imageUrl: "https://example.com/roof.jpg",
        aspectRatio: "1:1",
      },
      orgId,
      "free"
    );

    assert.equal(resBlocked.limitReached, true);
    assert.equal(resBlocked.upgradeRequired, true);
    assert.equal(resBlocked.usage?.limit, 5);
  });

  test("publishCampaignAction enforces Free limit (1) and records campaign publication", async () => {
    const orgId = "org_action_campaign";

    // 1st campaign succeeds
    const res1 = await publishCampaignAction(
      {
        name: "Spring Roofing Blitz",
        objective: "Leads",
        service: "Roofing",
        location: "Paramus, NJ",
        dailyBudget: 25,
        startDate: "2026-09-15",
      },
      orgId,
      "free"
    );
    assert.equal(res1.success, true);
    assert.equal(usageService.getUsageCount(orgId, "campaign"), 1);

    // 2nd campaign exceeds Free campaign limit of 1
    const resBlocked = await publishCampaignAction(
      {
        name: "Gutter Cleaning Blitz",
        objective: "Leads",
        service: "Gutters",
        location: "Paramus, NJ",
        dailyBudget: 15,
        startDate: "2026-09-16",
      },
      orgId,
      "free"
    );

    assert.equal(resBlocked.limitReached, true);
    assert.equal(resBlocked.upgradeRequired, true);
    assert.equal(resBlocked.usage?.limit, 1);
    assert.equal(resBlocked.usage?.current, 1);
  });
});
