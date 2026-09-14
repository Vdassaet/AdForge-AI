import { test, describe, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  demoStore,
  NJ_FENCE_SERVICES,
  NJ_FENCE_CAMPAIGNS,
  DEMO_BUSINESS_PROFILE,
} from "../../lib/demo/demo-data";
import {
  isDemoMode,
  getCredentialsStatus,
  resetDemoDataAction,
} from "../../lib/demo/index";

describe("PROMPT 20 — Modo Demo Specification", () => {
  beforeEach(() => {
    demoStore.reset();
  });

  describe("Zero External Credentials Requirement", () => {
    test("Demo mode is safely active when external credentials are absent", () => {
      // In testing/development without prod keys, isDemoMode must return true
      const active = isDemoMode();
      assert.equal(active, true, "Demo mode must be active when credentials are absent");
    });

    test("Credentials audit inspects all 4 critical external services without throwing", () => {
      const status = getCredentialsStatus();
      
      assert.ok("hasSupabase" in status, "Must audit Supabase credentials");
      assert.ok("hasMeta" in status, "Must audit Meta credentials");
      assert.ok("hasStripe" in status, "Must audit Stripe credentials");
      assert.ok("hasAI" in status, "Must audit AI credentials");

      assert.equal(typeof status.hasSupabase, "boolean");
      assert.equal(typeof status.hasMeta, "boolean");
      assert.equal(typeof status.hasStripe, "boolean");
      assert.equal(typeof status.hasAI, "boolean");
    });
  });

  describe("Business Profile: NJ Fence and Railing", () => {
    test("Business profile strictly matches NJ Fence and Railing", () => {
      const profile = demoStore.getBusinessProfile();

      assert.equal(profile.name, "NJ Fence and Railing");
      assert.equal(profile.industry, "Home Improvement & Construction");
      assert.equal(profile.state, "NJ");
      assert.equal(profile.isDemo, true);
      assert.ok(profile.tagline.includes("New Jersey"), "Tagline must highlight NJ coverage");
      assert.ok(profile.phone.startsWith("(201)"), "Phone number must be realistic North NJ area code");
    });
  });

  describe("Services Requirement (4 Specified Services)", () => {
    test("Contains all 4 required services", () => {
      const services = demoStore.getServices();
      const serviceNames = services.map((s) => s.name);

      assert.equal(services.length, 4, "Must contain exactly 4 demo services");
      assert.ok(serviceNames.includes("Aluminum Railing"), "Must include 'Aluminum Railing'");
      assert.ok(serviceNames.includes("Fence Installation"), "Must include 'Fence Installation'");
      assert.ok(serviceNames.includes("Railing Repair"), "Must include 'Railing Repair'");
      assert.ok(serviceNames.includes("Metal Fabrication"), "Must include 'Metal Fabrication'");
    });

    test("All services are active, priced, and tagged as demo records", () => {
      const services = demoStore.getServices();
      for (const service of services) {
        assert.equal(service.isActive, true, `${service.name} must be active`);
        assert.ok(service.startingPrice.length > 0, `${service.name} must have starting price`);
        assert.equal(service.isDemo, true, `${service.name} must be tagged as demo`);
        assert.ok(service.id.startsWith("demo_srv_"), `${service.id} must have demo prefix`);
      }
    });
  });

  describe("Campaigns Requirement (3 Specified Campaigns)", () => {
    test("Contains the 3 required active campaigns", () => {
      const campaigns = demoStore.getCampaigns();
      const campaignNames = campaigns.map((c) => c.name);

      assert.equal(campaigns.length, 3, "Must contain exactly 3 demo campaigns");
      assert.ok(campaignNames.includes("Aluminum Railing"), "Must include 'Aluminum Railing' campaign");
      assert.ok(campaignNames.includes("Fence Installation"), "Must include 'Fence Installation' campaign");
      assert.ok(campaignNames.includes("Railing Repair"), "Must include 'Railing Repair' campaign");
    });

    test("Campaign metrics are realistic, non-zero, and isolated", () => {
      const campaigns = demoStore.getCampaigns();
      for (const campaign of campaigns) {
        assert.equal(campaign.status, "ACTIVE");
        assert.ok(campaign.dailyBudget > 0, "Daily budget must be > 0");
        assert.ok(campaign.totalSpend > 0, "Total spend must be > 0");
        assert.ok(campaign.leadsCount > 0, "Leads count must be > 0");
        assert.ok(campaign.cpl > 0, "Cost per lead must be > 0");
        assert.ok(campaign.impressions > 1000, "Impressions must be realistic");
        assert.equal(campaign.isDemo, true, "Campaign must be tagged isDemo: true");
        assert.ok(campaign.id.startsWith("demo_camp_"), "Campaign ID must have demo prefix");
      }
    });
  });

  describe("Realistic Leads Dataset", () => {
    test("Leads contain realistic local homeowner inquiries with NJ locations", () => {
      const leads = demoStore.getLeads();
      assert.ok(leads.length >= 8, "Must provide at least 8 realistic demo leads");

      for (const lead of leads) {
        assert.ok(lead.name.length > 3, "Lead must have a full name");
        assert.ok(lead.phone.includes("201") || lead.phone.includes("555"), "Lead phone must be realistic");
        assert.ok(lead.email.includes("@"), "Lead must have valid email format");
        assert.ok(lead.location.includes("NJ"), "Lead location must be in New Jersey");
        assert.ok(lead.estimatedValue >= 450, "Lead estimated project value must be realistic");
        assert.equal(lead.isDemo, true, "Lead must be tagged isDemo: true");
        assert.ok(lead.id.startsWith("demo_lead_"), "Lead ID must have demo prefix");
      }
    });

    test("Lead service distribution covers the primary business services", () => {
      const leads = demoStore.getLeads();
      const servicesCovered = new Set(leads.map((l) => l.service));

      assert.ok(servicesCovered.has("Aluminum Railing"));
      assert.ok(servicesCovered.has("Fence Installation"));
      assert.ok(servicesCovered.has("Railing Repair"));
      assert.ok(servicesCovered.has("Metal Fabrication"));
    });
  });

  describe("Realistic Creatives & Multi-Format Readiness", () => {
    test("Creatives cover key aspect ratios and include realistic scores", () => {
      const creatives = demoStore.getCreatives();
      assert.equal(creatives.length, 4, "Must provide 4 demo creatives");

      const ratios = creatives.map((c) => c.aspectRatio);
      assert.ok(ratios.includes("1:1"), "Must include 1:1 Feed ratio");
      assert.ok(ratios.includes("4:5"), "Must include 4:5 Portrait ratio");
      assert.ok(ratios.includes("9:16"), "Must include 9:16 Story/Reel ratio");
      assert.ok(ratios.includes("16:9"), "Must include 16:9 Landscape ratio");

      for (const creative of creatives) {
        assert.ok(creative.performanceScore >= 80, "AI score must reflect high performance");
        assert.ok(creative.headline.length > 10, "Must have compelling headline");
        assert.ok(creative.imageUrl.startsWith("https://"), "Must have reliable CDN image URL");
        assert.equal(creative.isDemo, true);
        assert.ok(creative.id.startsWith("demo_creat_"));
      }
    });
  });

  describe("Realistic Recommendations & Analytics", () => {
    test("Recommendations provide actionable insights referencing NJ Fence campaigns", () => {
      const recs = demoStore.getRecommendations();
      assert.ok(recs.length >= 3, "Must provide at least 3 actionable recommendations");

      for (const rec of recs) {
        assert.ok(rec.confidence >= 80, "Confidence must be >= 80%");
        assert.ok(rec.title.length > 5);
        assert.ok(rec.explanation.length > 20);
        assert.ok(rec.impact_value.length > 0);
        assert.equal(rec.isDemo, true);
        assert.ok(rec.id.startsWith("demo_rec_"));
      }
    });

    test("Analytics summarize high-level business performance", () => {
      const analytics = demoStore.getAnalytics();

      assert.ok(analytics.totalSpend > 2000, "Total spend must be realistic");
      assert.ok(analytics.totalLeads > 50, "Total leads must be realistic");
      assert.ok(analytics.avgCpl > 20, "Average CPL must be calculated");
      assert.ok(analytics.impressions > 50000, "Must have realistic impression scale");
      assert.equal(analytics.isDemo, true);
    });
  });

  describe("Data Isolation & Reset Integrity", () => {
    test("Never mixes demo data with production data", () => {
      const allEntities = [
        ...demoStore.getServices(),
        ...demoStore.getCampaigns(),
        ...demoStore.getLeads(),
        ...demoStore.getCreatives(),
        ...demoStore.getRecommendations(),
      ];

      // 1. Every single demo entity must have isDemo === true
      const nonDemo = allEntities.filter((e) => (e as { isDemo?: boolean }).isDemo !== true);
      assert.equal(nonDemo.length, 0, "All demo items must have isDemo: true");

      // 2. All IDs must begin with demo_ to avoid collision with production UUIDs
      const invalidIds = allEntities.filter((e) => !(e as { id: string }).id.startsWith("demo_"));
      assert.equal(invalidIds.length, 0, "All demo IDs must start with 'demo_' prefix");
    });

    test("resetDemoDataAction restores pristine demo state", async () => {
      // Simulate user adding a custom campaign or mutating state
      demoStore.addCampaign({
        name: "Temporary Campaign",
        service: "Fence Installation",
        objective: "Leads",
        status: "PAUSED",
        dailyBudget: 10,
        totalSpend: 0,
        leadsCount: 0,
        callsCount: 0,
        cpl: 0,
        ctr: "0%",
        impressions: 0,
        clicks: 0,
        location: "Test",
        startDate: "2026-09-01",
      });

      assert.equal(demoStore.getCampaigns().length, 4);

      // Execute reset server action
      const result = await resetDemoDataAction();
      assert.equal(result.success, true);

      // State is back to 3
      assert.equal(demoStore.getCampaigns().length, 3);
      assert.equal(demoStore.getServices().length, 4);
    });
  });
});
