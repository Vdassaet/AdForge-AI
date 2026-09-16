import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { timingSafeEqual } from "crypto";
import { getMetaService } from "@/lib/services/meta";
import { getAuthContext, assertRole } from "@/lib/auth/auth-context";
import { createAdminClient } from "@/lib/supabase/admin";
import { encryptToken } from "@/lib/security/token-encryption";

export const runtime = "nodejs";

function statesMatch(actual: string | null, expected: string | undefined): boolean {
  if (!actual || !expected) return false;
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  const savedState = cookies().get("adforge_meta_oauth_state")?.value;
  if (!statesMatch(state, savedState)) {
    return NextResponse.redirect(new URL("/integrations/meta?error=invalid_state", request.url));
  }

  if (error) {
    console.error("Meta OAuth Error:", error, errorDescription);
    return NextResponse.redirect(new URL(`/integrations/meta?error=${error}`, request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/integrations/meta?error=missing_code", request.url));
  }

  try {
    const context = await getAuthContext();
    assertRole(context, ["owner", "admin"]);
    const metaService = getMetaService();
    
    // Exchange code for token
    const tokenData = await metaService.oauth.exchangeCodeForToken(code, process.env.META_REDIRECT_URI || "");
    
    const expiresAt = tokenData.expiresIn > 0
      ? new Date(Date.now() + tokenData.expiresIn * 1000).toISOString()
      : null;
    const { error: persistenceError } = await createAdminClient()
      .from("meta_connections")
      .upsert({
        organization_id: context.organizationId,
        access_token: encryptToken(tokenData.accessToken),
        token_expires_at: expiresAt,
        is_active: true,
        updated_at: new Date().toISOString(),
      }, { onConflict: "organization_id" });
    if (persistenceError) throw new Error("Could not save the Meta connection.");

    const response = NextResponse.redirect(new URL("/integrations/meta?success=true", request.url));
    response.cookies.set("adforge_meta_oauth_state", "", { maxAge: 0, path: "/api/auth/meta" });
    return response;
  } catch (err) {
    console.error("Meta OAuth connection failed", { message: err instanceof Error ? err.message : "unknown" });
    return NextResponse.redirect(new URL("/integrations/meta?error=exchange_failed", request.url));
  }
}
