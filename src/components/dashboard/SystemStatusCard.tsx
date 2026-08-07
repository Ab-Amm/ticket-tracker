import { Server, Coffee, Play } from 'lucide-react';
import type { Engineer, Ticket } from '../../lib/supabase';

interface SystemStatusCardProps {
  currentUser: Engineer;
  isMyTurn: boolean;
  myTickets: Ticket[];
  toggleRetreat: () => void;
}

export function SystemStatusCard({ currentUser, isMyTurn, myTickets, toggleRetreat }: SystemStatusCardProps) {
  const activeCount = myTickets.filter(t => t.status === 'active').length;
  const suspendedCount = myTickets.filter(t => t.status === 'suspended').length;
  const totalCount = activeCount + suspendedCount;
  
  const isOnRetreat = currentUser.status === 'retreat';

  return (
    <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-xl p-6 shadow-sm flex flex-col justify-between h-full transition-colors">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Server className="w-3.5 h-3.5" />
            System Status
          </h2>
          <button 
            onClick={toggleRetreat}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest transition-colors border ${
              isOnRetreat 
                ? 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-500/30 hover:bg-violet-100 dark:hover:bg-violet-500/20' 
                : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            {isOnRetreat ? <Play className="w-3 h-3" /> : <Coffee className="w-3 h-3" />}
            {isOnRetreat ? 'Resume' : 'Break'}
          </button>
        </div>

        <div className="flex items-start gap-4">
          <div
            className={`mt-1 flex-shrink-0 w-2.5 h-2.5 rounded-full ${
              isOnRetreat
                ? 'bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.5)] animate-pulse'
                : totalCount > 0
                ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)] animate-pulse'
                : 'bg-teal-500 dark:bg-[#14b8a6] shadow-[0_0_8px_rgba(20,184,166,0.5)]'
            }`}
          />
          <div>
            {isOnRetreat ? (
              <>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white leading-tight mb-1">
                  On Retreat
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  You are currently skipped in the queue.
                </p>
              </>
            ) : totalCount === 0 ? (
              <>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white leading-tight mb-1">
                  Active & Ready
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isMyTurn ? 'You are next in queue. Stand by.' : 'In queue. Awaiting next rotation.'}
                </p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white leading-tight mb-1">
                  Processing Tickets
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  You have {activeCount} active and {suspendedCount} suspended task{totalCount !== 1 ? 's' : ''}.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}