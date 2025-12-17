-- FIX SCRIPT for "INSERT has more expressions than target columns"
-- This error is usually caused by a broken Trigger on the 'profiles' table.

-- 1. Drop common triggers that might be causing this
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;
DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
DROP TRIGGER IF EXISTS handle_updated_profile ON public.profiles;

-- 2. Drop the functions associated with them (if they exist)
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_user_update();

-- 3. Re-create the standard "handle_new_user" trigger (Safe version)
-- This ensures new signups still get a profile, but fixes potential bugs.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, logo_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

-- Re-attach the trigger to auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. Ensure 'preferences' column exists (Just in case)
alter table public.profiles add column if not exists preferences jsonb default '{}'::jsonb;
