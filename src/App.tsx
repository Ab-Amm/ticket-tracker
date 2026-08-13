import { useState, useEffect } from 'react';
import { supabase, isPlaceholder } from './lib/supabase';
import type { Engineer, AppState, Ticket, Note } from './lib/supabase';
import { useTheme } from './lib/useTheme';

// Components
import { AuthScreen } from './components/auth/AuthScreen';
import { Header } from './components/dashboard/Header';
import { SystemStatusCard } from './components/dashboard/SystemStatusCard';
import { OperationalActionCard } from './components/dashboard/OperationalActionCard';
import { AgentRoster } from './components/dashboard/AgentRoster';
import { DailyMetrics } from './components/dashboard/DailyMetrics';
import { WeeklyPlanning } from './components/dashboard/WeeklyPlanning';
import { SuiviTab } from './components/suivi/SuiviTab';
import { SharedNotesTab } from './components/notes/SharedNotesTab';

const MOCK_ENGINEERS: Engineer[] = [
  { id: '1', name: 'Abderrahmane', status: 'available', last_ticket_assigned_at: new Date(Date.now() - 10000).toISOString() },
  { id: '2', name: 'Otmane', status: 'available', last_ticket_assigned_at: new Date().toISOString() },
  { id: '3', name: 'Aimad', status: 'available', last_ticket_assigned_at: new Date(Date.now() - 50000).toISOString() },
  { id: '4', name: 'Salma K', status: 'available', last_ticket_assigned_at: new Date(Date.now() - 2000).toISOString() },
  { id: '5', name: 'Salma M', status: 'offline', last_ticket_assigned_at: new Date().toISOString() },
];

function App() {
  const { theme, toggleTheme } = useTheme();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'suivi' | 'notes'>('dashboard');
  
  const [currentUser, setCurrentUser] = useState<Engineer | null>(null);
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [appState, setAppState] = useState<AppState | null>(null);
  const [allTickets, setAllTickets] = useState<Ticket[]>([]); // ALL tickets for the day
  const [notes, setNotes] = useState<Note[]>([]); // ALL notes
  const [isDemoMode, setIsDemoMode] = useState(false);

  const fetchAllTickets = async (currentAppState?: AppState) => {
    if (isPlaceholder) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stateToUse = currentAppState || appState;
    const resetTime = stateToUse?.metrics_reset_at ? new Date(stateToUse.metrics_reset_at) : today;
    const effectiveStartTime = resetTime > today ? resetTime : today;

    const { data } = await supabase
      .from('tickets')
      .select('*')
      .gte('created_at', effectiveStartTime.toISOString())
      .order('created_at', { ascending: false });

    if (data) {
      setAllTickets(data);
    }
  };

  const fetchNotes = async () => {
    if (isPlaceholder) return;
    const { data } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setNotes(data);
  };

  useEffect(() => {
    const savedUserId = localStorage.getItem('currentUserId');
    
    const fetchInitialData = async () => {
      try {
        const { data: engData, error: engError } = await supabase.from('engineers').select('*').order('last_ticket_assigned_at', { ascending: true });
        if (engError) throw engError;
        
        const { data: stateData, error: stateError } = await supabase.from('app_state').select('*').eq('id', 1).single();
        if (stateError) throw stateError;

        await fetchAllTickets(stateData);
        await fetchNotes();

        setEngineers(engData || []);
        setAppState(stateData);

        if (savedUserId && engData) {
          const user = engData.find(e => e.id === savedUserId);
          if (user) setCurrentUser(user);
        }
      } catch (error) {
        console.warn("Supabase not configured or failed to connect. Falling back to Demo Mode.", error);
        setIsDemoMode(true);
        setEngineers(MOCK_ENGINEERS);
        setAppState({ id: 1, updated_at: new Date().toISOString(), metrics_reset_at: new Date().toISOString() });
        if (savedUserId) {
           const user = MOCK_ENGINEERS.find(e => e.id === savedUserId);
           if (user) setCurrentUser(user);
        }
      }
    };

    fetchInitialData();

    if (!isPlaceholder) {
        const engSub = supabase.channel('public:engineers')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'engineers' }, payload => {
            const newEngineer = payload.new as Engineer;
            setEngineers(current => {
              const updated = current.map(e => e.id === newEngineer.id ? newEngineer : e);
              return [...updated].sort((a, b) => new Date(a.last_ticket_assigned_at).getTime() - new Date(b.last_ticket_assigned_at).getTime());
            });
            if (currentUser?.id === newEngineer.id) {
                setCurrentUser(newEngineer);
            }
        }).subscribe();

        const stateSub = supabase.channel('public:app_state')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'app_state' }, payload => {
            const newState = payload.new as AppState;
            setAppState(newState);
            fetchAllTickets(newState); // Refresh all tickets if reset time changed
            playNotificationSound();
        }).subscribe();

        const ticketsSub = supabase.channel('public:tickets')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, async (payload) => {
            if (payload.eventType === 'INSERT') {
              setAllTickets(prev => [payload.new as Ticket, ...prev]);
            } else if (payload.eventType === 'UPDATE') {
              const updatedTicket = payload.new as Ticket;
              setAllTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
            } else if (payload.eventType === 'DELETE') {
              setAllTickets(prev => prev.filter(t => t.id !== payload.old.id));
            }
        }).subscribe();

        const notesSub = supabase.channel('public:notes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'notes' }, (payload) => {
            if (payload.eventType === 'INSERT') {
              setNotes(prev => [payload.new as Note, ...prev]);
              playNotificationSound();
            } else if (payload.eventType === 'DELETE') {
              setNotes(prev => prev.filter(n => n.id !== payload.old.id));
            }
        }).subscribe();

        return () => {
          supabase.removeChannel(engSub);
          supabase.removeChannel(stateSub);
          supabase.removeChannel(ticketsSub);
          supabase.removeChannel(notesSub);
        };
    }
  }, [currentUser?.id]);

  const playNotificationSound = () => {
    try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        osc.connect(ctx.destination);
        osc.frequency.value = 440;
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    } catch(e) { console.error("Audio playback failed", e); }
  };

  const handleLogin = (id: string) => {
    const user = engineers.find(eng => eng.id === id);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUserId', user.id);
    }
  };

  const logout = () => {
      setCurrentUser(null);
      localStorage.removeItem('currentUserId');
  }

  const toggleRetreat = async () => {
    if (!currentUser) return;
    const newStatus = currentUser.status === 'retreat' ? 'available' : 'retreat';
    if (isDemoMode) {
      setEngineers(prev => prev.map(e => e.id === currentUser.id ? { ...e, status: newStatus } : e));
      return alert(`Demo Mode: Status changed to ${newStatus}.`);
    }
    await supabase.from('engineers').update({ status: newStatus }).eq('id', currentUser.id);
  };

  const addNote = async (content: string) => {
    if (!currentUser) return;
    const now = new Date().toISOString();
    
    if (isDemoMode) {
      const mockNote: Note = {
        id: Math.random().toString(),
        engineer_id: currentUser.id,
        content,
        created_at: now
      };
      setNotes(prev => [mockNote, ...prev]);
      return alert("Demo Mode: Note added.");
    }

    await supabase.from('notes').insert([{
      engineer_id: currentUser.id,
      content,
      created_at: now
    }]);
  };

  // --- DERIVED STATE ---
  const availableEngineers = engineers.filter(e => e.status === 'available');
  const nextUp = availableEngineers.length > 0 ? availableEngineers[0] : null;
  const isMyTurn = currentUser ? nextUp?.id === currentUser.id : false;
  // Only keep active and suspended tickets in the manager modal (escalated & closed are removed from active workload)
  const myActiveTickets = allTickets.filter(t => t.engineer_id === currentUser?.id && (t.status === 'active' || t.status === 'suspended'));

  // --- EXTENDED METRICS DERIVATION ---
  const teamStats = {
    completed: allTickets.filter(t => t.status === 'closed').length,
    escalated: allTickets.filter(t => t.status === 'escalated').length,
    suspended: allTickets.filter(t => t.status === 'suspended').length
  };

  const myStats = {
    completed: allTickets.filter(t => t.engineer_id === currentUser?.id && t.status === 'closed').length,
    escalated: allTickets.filter(t => t.engineer_id === currentUser?.id && t.status === 'escalated').length,
    suspended: allTickets.filter(t => t.engineer_id === currentUser?.id && t.status === 'suspended').length,
  };

  // --- TICKET LOGIC ---

  const claimNextTicket = async (ticketId: string) => {
      if (!currentUser) return;
      
      // Strict Guard Clause: Only allow claiming if it is currently their turn and they are active.
      if (currentUser.status === 'retreat') {
        return alert("You are on retreat. Return from retreat to claim tickets.");
      }
      if (currentUser.status !== 'available') {
        return alert("You must be active/online to claim a ticket.");
      }
      if (!isMyTurn) {
        return alert("It is not your turn to claim a ticket. Please wait for your spot in the queue.");
      }

      const now = new Date().toISOString();
      const newTicket: Ticket = {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(),
        engineer_id: currentUser.id,
        short_id: ticketId,
        status: 'active',
        created_at: now,
        updated_at: now
      };

      if (isDemoMode) {
        setAllTickets(prev => [newTicket, ...prev]);
        return alert("Demo Mode: Ticket claimed.");
      }
      
      // Update engineer timestamp to push them to the back of the queue
      await supabase.from('engineers').update({ last_ticket_assigned_at: now }).eq('id', currentUser.id);
      
      // Insert new active ticket with user provided ID
      await supabase.from('tickets').insert([{ 
        engineer_id: newTicket.engineer_id, 
        short_id: newTicket.short_id,
        status: newTicket.status,
        created_at: newTicket.created_at,
        updated_at: newTicket.updated_at
      }]);
  };

  const updateTicketStatus = async (ticketId: string, status: Ticket['status']) => {
      const now = new Date().toISOString();
      if (isDemoMode) {
        setAllTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status, updated_at: now } : t));
        return alert("Demo Mode: Status updated.");
      }
      await supabase.from('tickets').update({ status, updated_at: now }).eq('id', ticketId);
  };

  const handleResetMetrics = async () => {
    if (isDemoMode) {
      setAllTickets([]);
      return;
    }
    const now = new Date().toISOString();
    await supabase.from('app_state').update({ metrics_reset_at: now, updated_at: now }).eq('id', 1);
  };


  if (!currentUser) {
    return <AuthScreen engineers={engineers} isDemoMode={isDemoMode} onLogin={handleLogin} theme={theme} toggleTheme={toggleTheme} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-800 dark:text-slate-300 font-sans selection:bg-teal-500/30 pb-16 transition-colors duration-300">
      <Header 
        currentUser={currentUser} 
        logout={logout} 
        theme={theme} 
        toggleTheme={toggleTheme} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="max-w-7xl mx-auto px-6 mt-8 flex flex-col gap-6">
        
        {activeTab === 'dashboard' ? (
          <>
            {/* TOP ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SystemStatusCard currentUser={currentUser} isMyTurn={isMyTurn} myTickets={myActiveTickets} toggleRetreat={toggleRetreat} />
                <OperationalActionCard 
                  currentUser={currentUser}
                  isMyTurn={isMyTurn} 
                  goToSuivi={() => setActiveTab('suivi')}
                  activeTicketCount={myActiveTickets.length}
                />
            </div>

            {/* BOTTOM ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <AgentRoster engineers={engineers} currentUser={currentUser} nextUp={nextUp} tickets={allTickets} />
                <DailyMetrics teamStats={teamStats} myStats={myStats} onReset={handleResetMetrics} />
            </div>

            {/* WEEKLY PLANNING ROW */}
            <div className="grid grid-cols-1 gap-6">
                <WeeklyPlanning currentUser={currentUser} />
            </div>
          </>
        ) : activeTab === 'suivi' ? (
          <SuiviTab 
            engineers={engineers} 
            allTickets={allTickets} 
            currentUser={currentUser} 
            nextUp={nextUp} 
            onClaim={claimNextTicket} 
            onUpdateStatus={updateTicketStatus} 
          />
        ) : (
          <SharedNotesTab
             engineers={engineers}
             notes={notes}
             currentUser={currentUser}
             onAddNote={addNote}
          />
        )}

      </main>
    </div>
  );
}

export default App;