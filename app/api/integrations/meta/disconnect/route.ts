import { NextResponse } from "next/server";
import { getAuthContext, assertRole } from "@/lib/auth/auth-context";
import { createAdminClient } from "@/lib/supabase/admin";

export async function DELETE() {
  try {
    const context = await getAuthContext();
    assertRole(context, ["owner", "admin"]);
    const { error } = await createAdminClient()
      .from("meta_connections")
      .update({ is_active: false, access_token: "", updated_at: new Date().toISOString() })
      .eq("organization_id", context.organizationId);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to disconnect Meta." }, { status: 403 });
  }
}
