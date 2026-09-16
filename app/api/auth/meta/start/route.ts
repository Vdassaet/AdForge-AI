import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getAuthContext, assertRole } from "@/lib/auth/auth-context";
import { getMetaService } from "@/lib/services/meta";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const context = await getAuthContext();
    assertRole(context, ["owner", "admin"]);
    const state = randomBytes(32).toString("base64url");
    const authorizationUrl = getMetaService().oauth.getAuthorizationUrl(state);
    const response = NextResponse.redirect(authorizationUrl);
    response.cookies.set("adforge_meta_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 10 * 60,
      path: "/api/auth/meta",
    });
    return response;
  } catch {
    return NextResponse.redirect(new URL("/integrations/meta?error=configuration_or_authorization", request.url));
  }
}
