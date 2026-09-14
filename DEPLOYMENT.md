# Contractor AI Ads — Production Deployment Guide

This guide provides step-by-step instructions for deploying **Contractor AI Ads** to production with high availability, tenant isolation, and enterprise-grade security.

---

## Architecture Overview

```
                        ┌────────────────────────┐
                        │      Custom Domain     │
                        │ (https://yourdomain.com)│
                        └───────────┬────────────┘
                                    │
                                    ▼
                         ┌───────────────────────┐
                         │   Vercel Edge & SSR   │
                         │      (Next.js 14)     │
                         └───────┬───────┬───────┘
                                 │       │
          ┌──────────────────────┘       └───────────────────────┐
          ▼                                                      ▼
┌────────────────────────┐                             ┌───────────────────┐
│     Supabase Cloud     │                             │  Third-Party APIs │
│ ├── PostgreSQL (RLS)   │                             │ ├── Meta Graph API│
│ ├── Auth (OAuth / JWT) │                             │ ├── Stripe (Webhk)│
│ └── Storage (S3/CDN)   │                             │ ├── Gemini / AI   │
└────────────────────────┘                             │ └── Twilio (Voice)│
                                                       └───────────────────┘
```

---

## 1. Supabase Setup

1. Log in to [Supabase Dashboard](https://supabase.com/dashboard) and click **New Project**.
2. **Project Name**: `contractor-ai-ads-prod`
3. **Database Password**: Generate a secure, 32-character password and store it in a password manager.
4. **Region**: Select the region closest to your target contractor customer base (e.g. `US East (N. Virginia)`).
5. **Compute Size**: Minimum `Small` or `Medium` compute recommended for production concurrency and pooling.
6. Once provisioned, navigate to **Project Settings -> API** to retrieve:
   - `Project URL`
   - `anon public key`
   - `service_role key` (keep secret!)

---

## 2. Database Migration

The repository contains 16 ordered SQL migrations located in `supabase/migrations/`:

| Migration | Purpose | Key Tables Created |
| :--- | :--- | :--- |
| `00000000000000_initial_schema.sql` | Organizations & User Roles | `organizations`, `user_roles` |
| `00000000000001_auth_triggers.sql` | Auto-organization creation trigger | Trigger `on_auth_user_created` |
| `00000000000002_business_profile_expansion.sql` | Business profile & service areas | `business_profiles`, `business_services`, `business_service_areas` |
| `00000000000003_asset_manager_expansion.sql` | Image & video assets metadata | `assets` |
| `00000000000004_ai_generations.sql` | AI copy generation history | `ai_generations` |
| `00000000000005_ad_creatives.sql` | Formatted ad creatives & layouts | `ad_creatives` |
| `00000000000006_campaigns.sql` | Campaign configurations & states | `campaigns` |
| `00000000000007_meta_integration.sql` | Encrypted Meta OAuth connections | `meta_connections` |
| `00000000000008_leads_crm.sql` | CRM leads & audit timeline | `leads`, `lead_events` |
| `00000000000009_analytics.sql` | Daily metrics aggregations | `analytics_daily` |
| `00000000000010_ai_recommendations.sql` | Autonomous optimization suggestions | `ai_recommendations` |
| `00000000000011_ab_experiments.sql` | A/B testing & significance math | `ab_experiments` |
| `00000000000012_lead_forms.sql` | Embeddable public lead forms | `lead_forms` |
| `00000000000013_calls.sql` | Call tracking records & status | `calls` |
| `00000000000014_billing_usage_notifications.sql` | Subscriptions, usage, alerts | `subscriptions`, `usage_events`, `notifications` |
| `00000000000015_plan_limits_configuration.sql` | Admin-controlled plan limits | `plan_configurations` |

### Applying Migrations

#### Option A: Supabase CLI (Recommended)
```bash
# Link project
supabase link --project-ref <your-project-id>

# Push all migrations
supabase db push
```

#### Option B: SQL Editor in Dashboard
Open `supabase/migrations/` in sequential order and execute each file inside the Supabase SQL Editor. Verify each script reports `Success`.

---

## 3. Storage Setup

1. In Supabase Dashboard, navigate to **Storage -> Buckets**.
2. Click **New Bucket**:
   - **Name**: `contractor-assets`
   - **Public**: `true` (Allows CDN delivery of optimized ad image assets)
   - **File size limit**: `50MB`
   - **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`, `video/mp4`
3. Configure Storage Row-Level Security (RLS) policies:
   ```sql
   -- Allow authenticated users to upload to their organization folder
   CREATE POLICY "Authenticated users can upload assets"
   ON storage.objects FOR INSERT TO authenticated
   WITH CHECK (bucket_id = 'contractor-assets');

   -- Allow public read access to active assets
   CREATE POLICY "Public read access for contractor assets"
   ON storage.objects FOR SELECT TO public
   USING (bucket_id = 'contractor-assets');
   ```

---

## 4. Auth Setup

1. Navigate to **Authentication -> Providers -> Email**:
   - Enable Email Signup: `true`
   - Confirm email: `true` for production (or `false` if using magic link onboarding)
   - Password minimum length: `8`
2. Navigate to **URL Configuration**:
   - **Site URL**: `https://yourdomain.com`
   - **Redirect URLs**:
     - `https://yourdomain.com/**`
     - `https://yourdomain.com/api/auth/callback`
     - `https://yourdomain.com/login`
3. Optional: Configure Custom SMTP in **Project Settings -> Authentication** (e.g. via Resend or AWS SES) to send emails from your own domain instead of default Supabase limits.

---

## 5. Vercel Setup

1. Import your GitHub repository into [Vercel](https://vercel.com).
2. **Framework Preset**: Next.js (automatically detected).
3. **Build Command**: `npm run build`
4. **Output Directory**: `.next`
5. **Install Command**: `npm install`
6. Add Environment Variables (from your completed `.env.example`):
   - `NEXT_PUBLIC_APP_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_STORAGE_BUCKET`
   - `AI_PROVIDER`
   - `GEMINI_API_KEY` (or `OPENAI_API_KEY`)
   - `META_APP_ID`
   - `META_APP_SECRET`
   - `META_REDIRECT_URI`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `STRIPE_PRICE_STARTER`
   - `STRIPE_PRICE_PRO`
   - `STRIPE_PRICE_AGENCY`
7. Click **Deploy**.

---

## 6. Domain Setup

1. In Vercel, navigate to **Settings -> Domains**.
2. Add your apex domain (`yourdomain.com`) and www subdomain (`www.yourdomain.com`).
3. Add DNS records at your registrar:
   - `A` record: `@` -> `76.76.21.21`
   - `CNAME` record: `www` -> `cname.vercel-dns.com`
4. Vercel will automatically provision SSL certificates with zero downtime.

---

## 7. Meta App Setup (Facebook & Instagram Ads)

1. Go to [Meta for Developers](https://developers.facebook.com/) and click **Create App**.
2. **App Type**: Business.
3. Add Products:
   - **Marketing API**
   - **Facebook Login for Business**
4. Configure OAuth Redirect URI under **Facebook Login -> Settings**:
   - `https://yourdomain.com/api/auth/meta/callback`
5. Request Marketing API permissions:
   - `ads_management`
   - `ads_read`
   - `pages_read_engagement`
   - `pages_show_list`
6. Switch App Mode from **Development** to **Live** once business verification is complete.

---

## 8. Stripe Setup

1. In the [Stripe Dashboard](https://dashboard.stripe.com/), create products matching the application tiers:
   - **Starter**: `$49.00 / month` -> Copy Price ID to `STRIPE_PRICE_STARTER`
   - **Pro**: `$149.00 / month` -> Copy Price ID to `STRIPE_PRICE_PRO`
   - **Agency**: `$499.00 / month` -> Copy Price ID to `STRIPE_PRICE_AGENCY`
2. Go to **Developers -> Webhooks -> Add endpoint**:
   - **Endpoint URL**: `https://yourdomain.com/api/webhooks/stripe`
   - **Events to send**:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
3. Copy the **Signing secret** (`whsec_...`) to `STRIPE_WEBHOOK_SECRET`.
4. In **Settings -> Customer portal**, enable:
   - Switch plans (Upgrade / Downgrade)
   - Cancel subscriptions at period end
   - Update payment methods and invoice history

---

## 9. AI Provider Setup

### Google Gemini (Recommended)
1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Create an API key in your Google Cloud Project.
3. Set `AI_PROVIDER=gemini` and `GEMINI_API_KEY=<your-key>`.
4. Set usage quotas in Google Cloud Console to prevent runaway costs.

### OpenAI (Alternative)
1. In OpenAI platform dashboard, create a restricted key with `Model Capabilities: Write`.
2. Set `AI_PROVIDER=openai` and `OPENAI_API_KEY=<your-key>`.

---

## 10. Production Testing & Verification Checklist

Before announcing general availability, run this end-to-end verification:

- [ ] **Automated CI Validation**:
  ```bash
  npm run lint
  npm run typecheck
  npm test
  npm run build
  ```
- [ ] **Authentication**:
  - Sign up with a new contractor test account.
  - Verify email confirmation and auto-provisioning of organization.
  - Test login, logout, and session restoration on refresh.
- [ ] **Tenant Isolation (RLS)**:
  - Create Organization A and Organization B.
  - Verify Organization A cannot read or modify Organization B's campaigns, leads, or media.
- [ ] **AI Ad Generation**:
  - Run an AI generation for a test service (e.g. "Aluminum Railing").
  - Confirm generated copy formats correctly into headlines, primary copy, and CTAs.
- [ ] **Stripe Webhook E2E**:
  - Run Stripe CLI test trigger:
    ```bash
    stripe trigger customer.subscription.created
    ```
  - Verify webhook returns HTTP 200 with signature validation.
- [ ] **Public Lead Forms**:
  - Open `/f/<formId>` in an incognito window.
  - Submit a test lead.
  - Verify lead appears instantly in the `/leads` CRM dashboard.
- [ ] **Demo Mode Fallback**:
  - Unset API credentials in staging to confirm UI renders clean setup/demo states instead of crashing.
