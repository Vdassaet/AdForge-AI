"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";

const FormSubmissionSchema = z.object({
  formId: z.string().uuid(),
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email is required").optional().or(z.literal("")),
  service: z.string().optional(),
  message: z.string().optional(),
  address: z.string().optional(),
  preferred_date: z.string().optional(),
  // Honeypot field for spam bots
  website_url: z.string().max(0, "Invalid submission").optional(),
});

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_SUBMISSIONS = 5;
const requestTimestamps = new Map<string, number[]>();

function isRateLimited(requestKey: string): boolean {
  const now = Date.now();
  const timestamps = (requestTimestamps.get(requestKey) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  );

  if (timestamps.length >= RATE_LIMIT_MAX_SUBMISSIONS) {
    requestTimestamps.set(requestKey, timestamps);
    return true;
  }

  timestamps.push(now);
  requestTimestamps.set(requestKey, timestamps);
  return false;
}

export async function submitPublicLeadForm(formData: FormData) {
  try {
    const rawData = {
      formId: formData.get("formId"),
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      service: formData.get("service"),
      message: formData.get("message"),
      address: formData.get("address"),
      preferred_date: formData.get("preferred_date"),
      website_url: formData.get("website_url"), // honeypot
    };

    const validated = FormSubmissionSchema.parse(rawData);

    // Spam Protection: Honeypot check
    if (validated.website_url && validated.website_url.length > 0) {
      return { success: true }; // Fake success for bots
    }

    const forwardedFor = headers().get("x-forwarded-for");
    const ipAddress = forwardedFor?.split(",")[0]?.trim() || headers().get("x-real-ip") || "unknown";
    if (isRateLimited(`${validated.formId}:${ipAddress}`)) {
      return { success: false, error: "Too many submissions. Please try again later." };
    }

    const supabaseAdmin = createAdminClient();
    const { error } = await supabaseAdmin.rpc("record_public_lead", {
      _form_id: validated.formId,
      _name: validated.name,
      _phone: validated.phone,
      _email: validated.email || "",
      _service: validated.service || "",
      _message: validated.message || "",
      _address: validated.address || "",
      _preferred_date: validated.preferred_date || "",
    });

    if (error) {
      console.error("Public lead submission failed", { code: error.code });
      return { success: false, error: "We could not submit your request. Please try again." };
    }
    
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message ?? "Invalid form data." };
    }
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}
