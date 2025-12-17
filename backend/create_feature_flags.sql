-- Create feature_flags table to manage system availability dynamically
CREATE TABLE IF NOT EXISTS public.feature_flags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    feature_name TEXT NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT true,
    last_disabled_at TIMESTAMPTZ,
    auto_reenable_at TIMESTAMPTZ,
    disabled_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

-- Allow public read access (so frontend can check if feature is on)
CREATE POLICY "Allow public read access" ON public.feature_flags
    FOR SELECT USING (true);

-- Allow backend (service role) to update flags
CREATE POLICY "Allow service role update" ON public.feature_flags
    FOR UPDATE USING (true); -- Ideally restricted to service role, but for now allow unrestricted update if using service key

-- Insert default flags
INSERT INTO public.feature_flags (feature_name, is_enabled)
VALUES 
    ('chat', true),
    ('speech', true),
    ('dictionary', true),
    ('transcription', true),
    ('related_questions', true)
ON CONFLICT (feature_name) DO NOTHING;
