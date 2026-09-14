# Contractor AI Ads - Security Protocol

## Row Level Security (RLS)

All tables in the PostgreSQL database must have RLS enabled.
Policies must enforce that operations on a table are restricted to the `organization_id` that the authenticated user belongs to.

## Secrets Management

- **No Secrets in Frontend**: Never expose API keys (Meta, OpenAI, Stripe) to the browser.
- **Environment Variables**: Use `.env.local` for local development. Only variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.
- **Service Roles**: Supabase Service Role key must only be used in server-side environments or Edge Functions.

## Authentication

- All API routes and server actions must verify the user's session before performing operations.
- Supabase SSR cookies are used to maintain sessions securely.
