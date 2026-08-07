-- Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Engineers Table
CREATE TABLE public.engineers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('available', 'busy', 'offline')) DEFAULT 'available',
    last_ticket_assigned_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. App State Table (Singleton for global variables like phone)
CREATE TABLE public.app_state (
    id INT PRIMARY KEY CHECK (id = 1),
    phone_occupied_by UUID REFERENCES public.engineers(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initialize the singleton row
INSERT INTO public.app_state (id, phone_occupied_by) VALUES (1, NULL);

-- 3. Activity Logs Table (For Daily Analytics)
CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    engineer_id UUID REFERENCES public.engineers(id) NOT NULL,
    activity_type TEXT NOT NULL CHECK (activity_type IN ('ticket', 'phone')),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ
);

-- 4. Enable Row Level Security (RLS)
-- For MVP, we will allow all operations, but it's good practice to enable RLS.
ALTER TABLE public.engineers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for engineers" ON public.engineers FOR ALL USING (true);
CREATE POLICY "Allow all operations for app_state" ON public.app_state FOR ALL USING (true);
CREATE POLICY "Allow all operations for activity_logs" ON public.activity_logs FOR ALL USING (true);


-- 5. Seed Initial Data (5 Engineers)
INSERT INTO public.engineers (name) VALUES
    ('Alice (Network)'),
    ('Bob (Sysadmin)'),
    ('Charlie (Helpdesk)'),
    ('Diana (Security)'),
    ('Evan (Database)');

-- 6. Supabase Realtime Setup
-- Enable realtime for all three tables
alter publication supabase_realtime add table public.engineers;
alter publication supabase_realtime add table public.app_state;
alter publication supabase_realtime add table public.activity_logs;
