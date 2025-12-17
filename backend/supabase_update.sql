-- Run these commands in your Supabase SQL Editor

-- 1. Add preferences column to profiles (if profile table exists)
alter table profiles add column if not exists preferences jsonb default '{}'::jsonb;

-- 2. Create Chat Sessions Table
create table if not exists chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text,
  region text,
  country text,
  is_favorite boolean default false,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

-- 3. Create Chat Messages Table
create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references chat_sessions(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text not null, -- 'user' or 'model'
  content text not null,
  created_at timestamptz default now()
);

-- 4. Enable RLS (Row Level Security)
alter table chat_sessions enable row level security;
alter table chat_messages enable row level security;

-- 5. Create Policies (Idempotent: Drop first)

-- chat_sessions policies
drop policy if exists "Users can view their own sessions" on chat_sessions;
create policy "Users can view their own sessions"
  on chat_sessions for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own sessions" on chat_sessions;
create policy "Users can insert their own sessions"
  on chat_sessions for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own sessions" on chat_sessions;
create policy "Users can update their own sessions"
  on chat_sessions for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete their own sessions" on chat_sessions;
create policy "Users can delete their own sessions"
  on chat_sessions for delete
  using (auth.uid() = user_id);

-- chat_messages policies
drop policy if exists "Users can view messages from their sessions" on chat_messages;
create policy "Users can view messages from their sessions"
  on chat_messages for select
  using (exists (
    select 1 from chat_sessions
    where chat_sessions.id = chat_messages.session_id
    and chat_sessions.user_id = auth.uid()
  ));

drop policy if exists "Users can insert messages to their sessions" on chat_messages;
create policy "Users can insert messages to their sessions"
  on chat_messages for insert
  with check (exists (
    select 1 from chat_sessions
    where chat_sessions.id = chat_messages.session_id
    and chat_sessions.user_id = auth.uid()
  ));
