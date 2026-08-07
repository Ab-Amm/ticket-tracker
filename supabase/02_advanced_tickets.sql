-- Add metrics_reset_at to app_state
ALTER TABLE public.app_state ADD COLUMN metrics_reset_at TIMESTAMPTZ DEFAULT NOW();

-- Create tickets table for lifecycle tracking
CREATE TABLE public.tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    engineer_id UUID REFERENCES public.engineers(id) NOT NULL,
    short_id TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'suspended', 'escalated', 'closed')) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS and Realtime
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations for tickets" ON public.tickets FOR ALL USING (true);
ALTER PUBLICATION supabase_realtime ADD TABLE public.tickets;

-- Update all engineers to 'available' since we are removing the 'busy' blocker
UPDATE public.engineers SET status = 'available';