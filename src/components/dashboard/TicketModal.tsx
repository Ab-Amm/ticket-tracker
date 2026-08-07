import { X, CheckCircle2, PauseCircle, PlayCircle, ArrowUpRight, Zap } from 'lucide-react';
import type { Ticket } from '../../lib/supabase';

interface TicketModalProps {
  tickets: Ticket[];
  onClose: () => void;
  onUpdateStatus: (ticketId: string, status: Ticket['status']) => void;
}

export function TicketModal({ tickets, onClose, onUpdateStatus }: TicketModalProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/20';
      case 'suspended': return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20';
      case 'escalated': return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20';
      default: return 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-500/10 border-slate-200 dark:border-slate-500/20';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-[#334155] bg-slate-50 dark:bg-[#0f172a]/50">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-teal-500" />
            Active Tickets ({tickets.length})
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {tickets.length === 0 ? (
            <div className="text-center py-10 text-slate-500 dark:text-slate-400 text-sm">
              You have no active or suspended tickets.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {tickets.map(ticket => (
                <div key={ticket.id} className="border border-slate-200 dark:border-[#334155] bg-slate-50 dark:bg-[#0f172a] rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between transition-colors">
                  
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200">
                        {ticket.short_id}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Claimed: {new Date(ticket.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => onUpdateStatus(ticket.id, 'closed')}
                      title="Resolve Ticket"
                      className="flex-1 sm:flex-none p-2.5 rounded-lg bg-teal-50 dark:bg-[#14b8a6]/10 text-teal-600 dark:text-[#14b8a6] border border-teal-200 dark:border-[#14b8a6]/30 hover:bg-teal-100 dark:hover:bg-[#14b8a6]/20 transition-colors flex justify-center"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>

                    {ticket.status === 'suspended' ? (
                       <button
                         onClick={() => onUpdateStatus(ticket.id, 'active')}
                         title="Resume Ticket"
                         className="flex-1 sm:flex-none p-2.5 rounded-lg bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-500/30 hover:bg-teal-100 dark:hover:bg-teal-500/20 transition-colors flex justify-center"
                       >
                         <PlayCircle className="w-4 h-4" />
                       </button>
                    ) : (
                       <button
                         onClick={() => onUpdateStatus(ticket.id, 'suspended')}
                         title="Suspend / Hold"
                         className="flex-1 sm:flex-none p-2.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors flex justify-center"
                       >
                         <PauseCircle className="w-4 h-4" />
                       </button>
                    )}

                    <button
                      onClick={() => onUpdateStatus(ticket.id, 'escalated')}
                      title="Escalate Ticket"
                      className="flex-1 sm:flex-none p-2.5 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors flex justify-center"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}