/**
 * Demo Mode Controller & Utilities
 *
 * Verifies credential-less operation and manages safe demo sandbox state.
 */

import { demoStore } from "./demo-data";
import { revalidatePath } from "next/cache";

export * from "./demo-data";

export interface CredentialsStatus {
  hasSupabase: boolean;
  hasMeta: boolean;
  hasStripe: boolean;
  hasAI: boolean;
  isDemoMode: boolean;
}

/**
 * Returns true if running in Demo Mode.
 * Activates automatically when external production credentials are absent,
 * or when NEXT_PUBLIC_DEMO_MODE is set to 'true'.
 */
export function isDemoMode(): boolean {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "false") {
    return false;
  }

  // If any core production key is missing, automatically run in Demo Mode
  const hasSupabase = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "your_supabase_project_url" &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    process.env.SUPABASE_SERVICE_ROLE_KEY !== "your_supabase_service_role_key"
  );

  const hasMeta = Boolean(
    process.env.META_APP_ID &&
    process.env.META_APP_SECRET
  );

  const hasStripe = Boolean(
    process.env.STRIPE_SECRET_KEY &&
    process.env.STRIPE_WEBHOOK_SECRET
  );

  const hasAI = Boolean(
    process.env.OPENAI_API_KEY ||
    process.env.GEMINI_API_KEY
  );

  // If credentials are not fully configured, default to Demo Mode for a seamless experience
  return !hasSupabase || !hasMeta || !hasStripe || !hasAI || process.env.NEXT_PUBLIC_DEMO_MODE === "true";
}

/**
 * Diagnostic breakdown of which services are active or simulated.
 */
export function getCredentialsStatus(): CredentialsStatus {
  const hasSupabase = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "your_supabase_project_url" &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    process.env.SUPABASE_SERVICE_ROLE_KEY !== "your_supabase_service_role_key"
  );

  const hasMeta = Boolean(process.env.META_APP_ID && process.env.META_APP_SECRET);
  const hasStripe = Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET);
  const hasAI = Boolean(process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY);

  return {
    hasSupabase,
    hasMeta,
    hasStripe,
    hasAI,
    isDemoMode: isDemoMode(),
  };
}

/**
 * Server action to reset demo data back to clean factory state
 */
export async function resetDemoDataAction(): Promise<{ success: boolean; message: string }> {
  demoStore.reset();
  try {
    revalidatePath("/");
    revalidatePath("/campaigns");
    revalidatePath("/leads");
    revalidatePath("/analytics");
    revalidatePath("/recommendations");
    revalidatePath("/creatives");
    revalidatePath("/business");
    revalidatePath("/business/services");
  } catch {
    // Ignore outside Next.js request context
  }
  return {
    success: true,
    message: "Demo dataset for NJ Fence and Railing has been reset.",
  };
}
