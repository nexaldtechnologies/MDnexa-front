create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text default 'user',
  accepted_terms_at timestamptz,
  logo_url text,
  ref_source text,
  stripe_customer_id text,
  preferences jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan_id text,
  status text,
  current_period_end timestamptz,
  created_at timestamptz default now()
);

create table if not exists blogs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text,
  slug text,
  content text,
  status text default 'draft',
  created_at timestamptz default now()
);

create table if not exists crm_contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  email text,
  name text,
  source text,
  notes text,
  stage text,
  created_at timestamptz default now()
);
