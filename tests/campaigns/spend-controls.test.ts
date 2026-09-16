import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { validateCampaignSpend } from "../../lib/services/campaigns/spend-controls";

const validSpend = {
  dailyBudget: 10,
  totalBudget: 100,
  currency: "USD",
  spendAcknowledged: true as const,
};

describe("campaign spend controls", () => {
  test("accepts an acknowledged budget below both safety limits", () => {
    assert.deepEqual(validateCampaignSpend(validSpend), { ok: true });
  });

  test("rejects a budget without explicit acknowledgement", () => {
    const result = validateCampaignSpend({ ...validSpend, spendAcknowledged: false as boolean });
    assert.equal(result.ok, false);
  });

  test("rejects a daily budget above the organization limit", () => {
    const result = validateCampaignSpend({ ...validSpend, dailyBudget: 51 });
    assert.equal(result.ok, false);
    if (!result.ok) assert.match(result.error, /daily budget exceeds/);
  });

  test("rejects a total budget below the daily budget", () => {
    const result = validateCampaignSpend({ ...validSpend, totalBudget: 5 });
    assert.equal(result.ok, false);
  });
});
