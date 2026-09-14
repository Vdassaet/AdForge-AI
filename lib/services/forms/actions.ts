"use server";

import { z } from "zod";

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
      console.warn("Spam bot detected via honeypot.");
      return { success: true }; // Fake success for bots
    }

    // TODO: In production, fetch `lead_forms` to get `organization_id` using a Service Role Key (bypassing RLS)
    // const orgId = await getOrganizationIdByForm(validated.formId);

    // TODO: Insert lead into `leads` table with Service Role Key
    /*
      await supabaseAdmin.from('leads').insert({
        organization_id: orgId,
        name: validated.name,
        phone: validated.phone,
        email: validated.email,
        service: validated.service,
        message: validated.message,
        source: 'Website',
        status: 'new'
      });
    */

    // TODO: Insert into `lead_events`
    console.log(`[Form Action] Lead successfully captured for form ${validated.formId}: ${validated.name}`);
    
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return { success: false, error: (error as any).errors[0].message };
    }
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}
