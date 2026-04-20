-- Run this in your Supabase project's SQL editor
-- Table: subscribers — tracks active PayPal subscriptions

create table if not exists subscribers (
  id                    uuid primary key default gen_random_uuid(),
  paypal_email          text unique not null,
  paypal_subscription_id text,
  status                text default 'active',  -- 'active' | 'cancelled' | 'suspended'
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

-- Index for fast email lookups
create index if not exists idx_subscribers_email on subscribers (paypal_email);

-- Auto-update updated_at on row changes
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger subscribers_updated_at
  before update on subscribers
  for each row execute function update_updated_at_column();
