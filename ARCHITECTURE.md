# Contractor AI Ads - Architecture

## High-Level Architecture

- **Frontend/Backend**: Next.js 14 App Router (TypeScript, React)
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth (Email/Password, RBAC)
- **File Storage**: Supabase Storage
- **Validation**: Zod + React Hook Form

## Multi-Tenancy Strategy

Every user belongs to an `Organization`. All data associated with an account (campaigns, leads, profiles) must contain an `organization_id` column.
Row Level Security (RLS) ensures that users can only read/write rows where `organization_id` matches one of their active organization memberships.

## Key Directories

- `/app`: Next.js App Router routes (Dashboard, Auth, API).
- `/components`: Reusable UI components.
- `/lib`: Utility functions, Supabase clients, and constants.
- `/types`: Global TypeScript types, including Supabase generated database types.
- `/supabase`: Supabase migrations, seed files, and Edge Functions.
- `/hooks`: Custom React hooks.
- `/services`: Abstractions for external APIs (Meta, AI providers).
