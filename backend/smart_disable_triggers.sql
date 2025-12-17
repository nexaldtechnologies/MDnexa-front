-- SMART FIX: Disable only USER-defined triggers on 'profiles'.
-- This avoids the "permission denied" error for system triggers (ConstraintTrigger).

ALTER TABLE public.profiles DISABLE TRIGGER USER;

-- Verify preferences column exists again, just to be safe
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferences jsonb DEFAULT '{}'::jsonb;
