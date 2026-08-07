import { useState } from 'react';
import { ClipboardList, Clock, Zap, CheckCircle2, PauseCircle, PlayCircle, ArrowUpRight, AlertCircle } from 'lucide-react';
import type { Engineer, Ticket } from '../../lib/supabase';
import { getInitials } from '../../lib/utils';

interface SuiviTabProps {
  engineers: Engineer[];
  allTickets: Ticket[];
  currentUser: Engineer;
  nextUp: Engineer | null;
  onClaim: (ticketId: string) => void;
  onUpdateStatus: (ticketId: string, status: Ticket['status']) => void;
}

export function SuiviTab({ engineers, allTickets, currentUser, nextUp, onClaim, onUpdateStatus }: SuiviTabProps) {
  const [ticketIdInput, setTicketIdInput] = useState('');

  const isMyTurn = nextUp?.id === currentUser.id;
  const myActiveTickets = allTickets.filter(t => t.engineer_id === currentUser.id && t.status === 'active');
  const mySuspendedTickets = allTickets.filter(t => t.engineer_id === currentUser.id && t.status === 'suspended');

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticketIdInput.trim() && isMyTurn) {
      onClaim(ticketIdInput.trim());
      setTicketIdInput('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/20';
      case 'suspended': return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20';
      case 'escalated': return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20';
      case 'closed': return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20';
      default: return 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-500/10 border-slate-200 dark:border-slate-500/20';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* TOP SECTION: ACTIVE CONTROL PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Round-Robin Status & Claim Form */}
        <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-xl p-6 shadow-sm flex flex-col transition-colors relative overflow-hidden">
          <div className={`absolute top-0 right-0 w-32 h-32 blur-[50px] rounded-full pointer-events-none opacity-10 dark:opacity-20 transition-colors ${
            isMyTurn ? 'bg-teal-500 dark:bg-[#14b8a6]' : 'bg-slate-400 dark:bg-slate-500'
          }`} />
          
          <h2 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10">
            <Zap className="w-3.5 h-3.5" />
            Round-Robin Turn
          </h2>
          
          <div className="relative z-10 flex-1 flex flex-col justify-center">
            {isMyTurn ? (
              <form onSubmit={handleClaimSubmit} className="flex flex-col gap-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.5)] animate-pulse" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">It is your turn.</span>
                </div>
                <input
                  type="text"
                  value={ticketIdInput}
                  onChange={(e) => setTicketIdInput(e.target.value)}
                  placeholder="Enter Ticket ID (e.g. INC-123)"
                  className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow placeholder:text-slate-400 dark:placeholder:text-slate-600 font-mono uppercase"
                />
                <button
                  type="submit"
                  disabled={!ticketIdInput.trim()}
                  className="w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all bg-teal-600 dark:bg-[#0d9488] hover:bg-teal-700 dark:hover:bg-[#0f766e] text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-teal-900/10"
                >
                  Claim Ticket
                </button>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] flex items-center justify-center mb-3">
                  <AlertCircle className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                </div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Waiting for rotation</h3>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  Next in line: <strong className="text-slate-800 dark:text-slate-200">{nextUp?.name || 'Waiting...'}</strong>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Active Workload Actions */}
        <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-xl p-6 shadow-sm flex flex-col transition-colors max-h-[300px]">
          <h2 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-between">
            <span>Active Tickets</span>
            <span className="bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-400 px-2 py-0.5 rounded text-[10px]">{myActiveTickets.length}</span>
          </h2>
          
          <div className="flex-1 overflow-y-auto pr-1 space-y-2">
            {myActiveTickets.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">No active tickets.</div>
            ) : (
              myActiveTickets.map(ticket => (
                <div key={ticket.id} className="bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-lg p-3 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200">{ticket.short_id}</span>
                    <span className="text-[9px] text-slate-400">{new Date(ticket.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onUpdateStatus(ticket.id, 'closed')}
                      title="Complete Ticket"
                      className="flex-1 py-1.5 rounded bg-teal-50 dark:bg-[#14b8a6]/10 text-teal-600 dark:text-[#14b8a6] border border-teal-200 dark:border-[#14b8a6]/30 hover:bg-teal-100 dark:hover:bg-[#14b8a6]/20 transition-colors flex justify-center items-center gap-1 text-[10px] font-bold uppercase"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Done
                    </button>
                    <button
                      onClick={() => onUpdateStatus(ticket.id, 'suspended')}
                      title="Suspend Ticket"
                      className="flex-1 py-1.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex justify-center items-center gap-1 text-[10px] font-bold uppercase"
                    >
                      <PauseCircle className="w-3.5 h-3.5" /> Hold
                    </button>
                    <button
                      onClick={() => onUpdateStatus(ticket.id, 'escalated')}
                      title="Escalate Ticket"
                      className="flex-1 py-1.5 rounded bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors flex justify-center items-center gap-1 text-[10px] font-bold uppercase"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" /> Esc
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Card 3: Suspended Queue */}
        <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-xl p-6 shadow-sm flex flex-col transition-colors max-h-[300px]">
          <h2 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-between">
            <span>Suspended Tickets</span>
            <span className="bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded text-[10px]">{mySuspendedTickets.length}</span>
          </h2>
          
          <div className="flex-1 overflow-y-auto pr-1 space-y-2">
            {mySuspendedTickets.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">No suspended tickets.</div>
            ) : (
              mySuspendedTickets.map(ticket => (
                <div key={ticket.id} className="bg-amber-50/50 dark:bg-[#0f172a] border border-amber-100 dark:border-[#334155] rounded-lg p-3 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200">{ticket.short_id}</span>
                    <span className="text-[9px] text-amber-600 dark:text-amber-500/70 uppercase tracking-wider font-bold">On Hold</span>
                  </div>
                  <button
                    onClick={() => onUpdateStatus(ticket.id, 'active')}
                    title="Resume Ticket"
                    className="px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-500/30 hover:bg-teal-100 dark:hover:bg-teal-500/20 transition-colors flex items-center gap-1.5 text-[10px] font-bold uppercase"
                  >
                    <PlayCircle className="w-3.5 h-3.5" /> Resume
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: AUDIT LOG TABLE */}
      <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-xl shadow-sm flex flex-col min-h-[400px] transition-colors">
        <div className="p-6 border-b border-slate-200 dark:border-[#334155] flex justify-between items-center bg-slate-50 dark:bg-[#0f172a]/50 rounded-t-xl">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-teal-500" />
              Live Audit Log
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Real-time tracking of all tickets claimed today.</p>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] px-3 py-1.5 rounded-lg shadow-sm">
            {allTickets.length} Total Logs
          </div>
        </div>

        <div className="flex-1 p-6 overflow-x-auto">
          {allTickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2 py-10">
              <ClipboardList className="w-8 h-8 opacity-20" />
              <span className="text-sm">No tickets have been logged yet today.</span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-[#334155]">
                  <th className="pb-3 font-bold text-[10px] uppercase tracking-widest text-slate-400">Timestamp</th>
                  <th className="pb-3 font-bold text-[10px] uppercase tracking-widest text-slate-400">Engineer</th>
                  <th className="pb-3 font-bold text-[10px] uppercase tracking-widest text-slate-400">Ticket ID</th>
                  <th className="pb-3 font-bold text-[10px] uppercase tracking-widest text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {allTickets.map(ticket => {
                  const engineer = engineers.find(e => e.id === ticket.engineer_id);
                  const engineerName = engineer?.name || 'Unknown';
                  
                  return (
                    <tr key={ticket.id} className="border-b border-slate-100 dark:border-[#334155]/50 hover:bg-slate-50 dark:hover:bg-[#0f172a]/50 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
                          <Clock className="w-3 h-3" />
                          {new Date(ticket.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center text-[9px] font-bold">
                             {getInitials(engineerName)}
                           </div>
                           <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{engineerName}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="font-mono font-semibold text-sm text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
                          {ticket.short_id}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}