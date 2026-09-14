import { NextResponse } from "next/server";
import { getMetaService } from "@/lib/services/meta";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // In a real application, we would validate the state parameter against a stored cookie/session
  // to prevent CSRF attacks.

  if (error) {
    console.error("Meta OAuth Error:", error, errorDescription);
    return NextResponse.redirect(new URL(`/integrations/meta?error=${error}`, request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/integrations/meta?error=missing_code", request.url));
  }

  try {
    const metaService = getMetaService();
    
    // Exchange code for token
    const tokenData = await metaService.oauth.exchangeCodeForToken(code, process.env.META_REDIRECT_URI || "");
    
    // TODO: Update database (meta_connections) with the new access token and log to audit_logs
    console.log("[Audit Log] Meta connected successfully. Token:", tokenData.accessToken.substring(0, 5) + "...");
    
    return NextResponse.redirect(new URL("/integrations/meta?success=true", request.url));
  } catch (err) {
    console.error("Failed to exchange Meta code", err);
    return NextResponse.redirect(new URL("/integrations/meta?error=exchange_failed", request.url));
  }
}
