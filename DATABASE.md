# Contractor AI Ads - Database Schema

The platform relies on a normalized PostgreSQL database managed via Supabase. Every resource table includes an `organization_id` foreign key.

## Core Tables

- `profiles`: Extension of auth.users containing user details.
- `organizations`: Multi-tenant boundary. Represents a contractor business.
- `organization_members`: Maps profiles to organizations with RBAC roles (owner, admin, manager, member).

## Application Tables

- `business_profiles`: Business details (logo, contact info).
- `services`: Services offered by the contractor.
- `service_areas`: Zip codes, cities, or radiuses.
- `assets`: Uploaded media files.

## Ads & Campaigns

- `campaigns`: Advertising campaigns mapping to Meta campaigns.
- `ad_sets`: Ad Sets / Targeting within campaigns.
- `ads`: Individual ads.
- `ad_creatives`: AI-generated or uploaded creative concepts.

## CRM & Analytics

- `leads`: CRM leads generated from forms.
- `lead_events`: Timeline for lead lifecycle.
- `calls`: Tracked calls.
- `websites`: Linked landing pages/sites.
- `analytics_daily`: Aggregated metrics.

## AI & Billing

- `ai_generations`: History of AI usage.
- `ai_recommendations`: Suggestions provided by the AI optimization agent.
- `integrations`: Connected external systems.
- `oauth_connections`: OAuth tokens securely stored (encrypted).
- `subscriptions`: Stripe billing state.
- `usage_events`: Usage tracking for billing.
- `audit_logs`: Activity history.
- `notifications`: User notifications.
