create table if not exists public.profiles (
  id uuid primary key,
  full_name text,
  stripe_customer_id text unique,
  created_at timestamptz not null default now()
);

create table if not exists public.donations (
  id bigserial primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount_cents integer not null,
  currency text not null default 'usd',
  source text not null default 'donation',
  stripe_session_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id bigserial primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  stripe_session_id text unique,
  amount_cents integer not null,
  currency text not null default 'usd',
  status text not null default 'paid',
  created_at timestamptz not null default now()
);

create table if not exists public.stripe_events (
  id bigserial primary key,
  stripe_event_id text not null unique,
  event_type text not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.impact_summaries (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  donation_pets_helped integer not null default 0,
  shop_pets_helped integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.donations enable row level security;
alter table public.orders enable row level security;
alter table public.impact_summaries enable row level security;

create policy if not exists "profiles self read"
on public.profiles for select
using (auth.uid() = id);

create policy if not exists "donations self read"
on public.donations for select
using (auth.uid() = user_id);

create policy if not exists "orders self read"
on public.orders for select
using (auth.uid() = user_id);

create policy if not exists "impact self read"
on public.impact_summaries for select
using (auth.uid() = user_id);
