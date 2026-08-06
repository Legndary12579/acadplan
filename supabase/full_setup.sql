-- ═══════════════════════════════════════════════════════════
-- AcadPlan — Fresh Supabase Project Setup
-- Run this entire file in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════

-- ── Table: student_plans ─────────────────────────────────────
-- Stores every generated academic plan. user_id is nullable since
-- the app allows generating a plan without an account (anonymous),
-- but only logged-in users can retrieve their saved plans later.
create table if not exists student_plans (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  student_name text not null,
  student_email text,
  grade_level text,
  gpa text,
  intended_major text,
  college_type text,
  extracurriculars text,
  career_goals text,
  challenges text,
  sat_score text,
  act_score text,
  location text,
  ai_plan text not null,
  user_id uuid references auth.users(id) on delete cascade
);

create index if not exists idx_student_plans_user_id on student_plans (user_id);
create index if not exists idx_student_plans_created_at on student_plans (created_at);

alter table student_plans enable row level security;

-- Anyone (logged in or anonymous) can insert a plan.
-- If they ARE logged in, the user_id must match their own auth id
-- (prevents someone from saving a plan under someone else's account).
-- If they're anonymous, user_id must be null.
create policy "Anyone can insert their own or anonymous plan"
  on student_plans for insert
  to anon, authenticated
  with check (
    user_id is null
    or user_id = auth.uid()
  );

-- Logged-in users can only see their own saved plans.
create policy "Users can view their own plans"
  on student_plans for select
  to authenticated
  using (user_id = auth.uid());

-- Logged-in users can only fetch a single plan by ID if it's theirs.
-- (Same policy as above technically covers this via .eq("id", id) + select,
-- but included for clarity — Postgres RLS applies to all reads.)


-- ── Table: api_rate_limits ────────────────────────────────────
-- Tracks one row per API request, per client IP, per route.
-- Used to enforce hourly rate limits on the expensive AI routes.
create table if not exists api_rate_limits (
  id uuid primary key default gen_random_uuid(),
  identifier text not null,
  route text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_rate_limits_lookup
  on api_rate_limits (identifier, route, created_at);

alter table api_rate_limits enable row level security;

-- These routes are called with no user auth (anonymous visitors),
-- so the anon key needs insert/select access. This table only
-- stores IP + route + timestamp — nothing sensitive.
create policy "Allow public insert on rate limits"
  on api_rate_limits for insert
  to anon, authenticated
  with check (true);

create policy "Allow public select on rate limits"
  on api_rate_limits for select
  to anon, authenticated
  using (true);

-- Optional housekeeping — run occasionally (or set up a Supabase
-- cron job under Database → Cron Jobs) to keep this table small:
-- delete from api_rate_limits where created_at < now() - interval '7 days';


-- ═══════════════════════════════════════════════════════════
-- Done. After running this, go to:
-- Project Settings → API → copy "Project URL" and "anon public" key
-- into Vercel → Settings → Environment Variables as:
--   NEXT_PUBLIC_SUPABASE_URL
--   NEXT_PUBLIC_SUPABASE_ANON_KEY
-- Then redeploy.
-- ═══════════════════════════════════════════════════════════
