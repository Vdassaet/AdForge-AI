import { NextResponse } from "next/server";
import { getAuthContext } from "@/lib/auth/auth-context";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const context = await getAuthContext();
    const configured = Boolean(
      process.env.META_APP_ID && process.env.META_APP_SECRET &&
      process.env.META_REDIRECT_URI && process.env.TOKEN_ENCRYPTION_KEY
    );
    if (!configured) return NextResponse.json({ configured: false, connected: false });

    const { data } = await createAdminClient()
      .from("meta_connections")
      .select("is_active, facebook_page_name, ad_account_id, ad_account_name")
      .eq("organization_id", context.organizationId)
      .maybeSingle();

    return NextResponse.json({
      configured: true,
      connected: Boolean(data?.is_active),
      pageName: data?.facebook_page_name ?? null,
      adAccountId: data?.ad_account_id ?? null,
      adAccountName: data?.ad_account_name ?? null,
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
