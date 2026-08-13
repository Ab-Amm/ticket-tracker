import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isPlaceholder = supabaseUrl === 'https://placeholder-project.supabase.co';
export const supabase = createClient(supabaseUrl, supabaseKey);

export type Engineer = {
  id: string;
  name: string;
  status: 'available' | 'busy' | 'offline' | 'retreat';
  last_ticket_assigned_at: string;
};

export type AppState = {
  id: number;
  updated_at: string;
  metrics_reset_at: string;
};

export type ActivityLog = {
  id: string;
  engineer_id: string;
  activity_type: 'ticket';
  started_at: string;
  ended_at: string | null;
};

export type Ticket = {
  id: string;
  engineer_id: string;
  short_id: string;
  status: 'active' | 'suspended' | 'escalated' | 'closed';
  created_at: string;
  updated_at: string;
};

export type Note = {
  id: string;
  engineer_id: string;
  content: string;
  created_at: string;
};
