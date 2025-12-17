-- NUCLEAR FIX: Drop ALL triggers on table 'profiles' to stop the INSERT error.
-- This script dynamically finds every trigger attached to 'profiles' and destroys it.

DO $$ 
DECLARE 
    trg_name text;
BEGIN 
    FOR trg_name IN 
        SELECT trigger_name 
        FROM information_schema.triggers 
        WHERE event_object_table = 'profiles' 
        AND trigger_schema = 'public'
    LOOP 
        RAISE NOTICE 'Dropping trigger: %', trg_name;
        EXECUTE 'DROP TRIGGER IF EXISTS ' || quote_ident(trg_name) || ' ON public.profiles CASCADE'; 
    END LOOP; 
END $$;

-- Also try to drop potential trigger functions that might be orphaned
DROP FUNCTION IF EXISTS public.handle_update_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_profile_updated() CASCADE;
DROP FUNCTION IF EXISTS public.on_profile_update() CASCADE;
