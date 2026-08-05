-- Rate limiting table: tracks one row per request, per IP, per route
create table if not exists api_rate_limits (
  id uuid primary key default gen_random_uuid(),
  identifier text not null,       -- client IP address
  route text not null,            -- e.g. 'plan', 'colleges', 'chat'
  created_at timestamptz not null default now()
);

-- Speeds up the "how many requests in the last N minutes" lookup
create index if not exists idx_rate_limits_lookup
  on api_rate_limits (identifier, route, created_at);

-- Allow the anon key to insert/select rows (needed since these routes
-- are called with no user auth). This table only stores IP + route +
-- timestamp, nothing sensitive.
alter table api_rate_limits enable row level security;

create policy "Allow public insert" on api_rate_limits
  for insert to anon with check (true);

create policy "Allow public select" on api_rate_limits
  for select to anon using (true);

-- Optional: automatically clean up old rows so the table doesn't grow
-- forever. Run this occasionally, or set up a Supabase cron job for it.
-- delete from api_rate_limits where created_at < now() - interval '7 days';
