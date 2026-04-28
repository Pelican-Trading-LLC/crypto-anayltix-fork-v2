-- Stripe webhook idempotency and audit log.
-- Apply before deploying the webhook handler changes.

create table if not exists public.stripe_events (
  id text primary key,
  type text not null,
  livemode boolean not null default false,
  api_version text,
  status text not null default 'processing'
    check (status in ('processing', 'succeeded', 'failed')),
  error_message text,
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists stripe_events_type_idx
  on public.stripe_events (type);

create index if not exists stripe_events_status_created_at_idx
  on public.stripe_events (status, created_at desc);

create or replace function public.set_stripe_events_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists stripe_events_set_updated_at on public.stripe_events;
create trigger stripe_events_set_updated_at
before update on public.stripe_events
for each row
execute function public.set_stripe_events_updated_at();

alter table public.stripe_events enable row level security;

drop policy if exists "Service role manages stripe events" on public.stripe_events;
create policy "Service role manages stripe events"
on public.stripe_events
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

-- Backfill/reconciliation helpers to run manually after deploy:
--
-- 1) Potential duplicate referral activations. Adjust column names if your
-- referrals table uses a different shape.
-- select user_id, referrer_id, count(*) as row_count, min(created_at), max(created_at)
-- from public.referrals
-- group by user_id, referrer_id
-- having count(*) > 1;
--
-- 2) Potential duplicate subscription rows. user_credits should normally be
-- one row per user, but this catches duplicated Stripe subscription bindings.
-- select stripe_subscription_id, count(*) as row_count, array_agg(user_id) as user_ids
-- from public.user_credits
-- where stripe_subscription_id is not null
-- group by stripe_subscription_id
-- having count(*) > 1;
