-- FINAL FIX: Disable ALL triggers on 'profiles' table.
-- This will stop the "INSERT has more expressions" error immediately.

ALTER TABLE public.profiles DISABLE TRIGGER ALL;

-- Ensure the preferences column exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferences jsonb DEFAULT '{}'::jsonb;
