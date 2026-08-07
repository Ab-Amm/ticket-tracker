import { Zap, ArrowRight } from 'lucide-react';
import type { Engineer } from '../../lib/supabase';

interface OperationalActionCardProps {
  currentUser: Engineer;
  isMyTurn: boolean;
  goToSuivi: () => void;
  activeTicketCount: number;
}

export function OperationalActionCard({
  currentUser,
  isMyTurn,
  goToSuivi,
  activeTicketCount
}: OperationalActionCardProps) {
  const isOnRetreat = currentUser.status === 'retreat';

  return (
    <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden h-full transition-colors">
      <div
        className={`absolute top-0 right-0 w-32 h-32 blur-[50px] rounded-full pointer-events-none opacity-10 dark:opacity-20 transition-colors ${
          isOnRetreat ? 'bg-violet-500' : isMyTurn ? 'bg-teal-500 dark:bg-[#14b8a6]' : 'bg-slate-400 dark:bg-slate-500'
        }`}
      />

      <div className="relative z-10">
        <h2 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Zap className="w-3.5 h-3.5" />
          Ticket Operations
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
          {isOnRetreat ? "You are on break and skipped in the queue. Return from retreat to claim tickets." : "Ticket claiming and active workload management have been unified in the Suivi hub."}
        </p>
      </div>

      <div className="relative z-10 flex flex-col gap-2">
        <button
          onClick={goToSuivi}
          className={`w-full py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            isOnRetreat
              ? 'bg-violet-600 dark:bg-violet-500/20 text-white dark:text-violet-400 hover:bg-violet-700 dark:hover:bg-violet-500/30 shadow-lg shadow-violet-900/20 border border-transparent dark:border-violet-500/30'
              : isMyTurn
              ? 'bg-teal-600 dark:bg-[#0d9488] hover:bg-teal-700 dark:hover:bg-[#0f766e] text-white shadow-lg shadow-teal-900/20 border border-transparent'
              : 'bg-slate-50 dark:bg-[#0f172a] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#334155] hover:border-teal-500/50 hover:text-teal-600 dark:hover:text-teal-400'
          }`}
        >
          Open Operations Hub <ArrowRight className="w-4 h-4" />
        </button>
        
        {activeTicketCount > 0 && (
          <div className="text-center mt-2">
            <span className="inline-block bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border border-rose-200 dark:border-rose-500/20">
              {activeTicketCount} Active Task{activeTicketCount > 1 ? 's' : ''} Pending
            </span>
          </div>
        )}
      </div>
    </div>
  );
}