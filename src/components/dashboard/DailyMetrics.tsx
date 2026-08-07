import { RefreshCw, BarChart3, CheckCircle2, ArrowUpRight, PauseCircle, PhoneCall } from 'lucide-react';

interface DailyMetricsProps {
  teamStats: { completed: number; escalated: number; suspended: number; calls: number };
  myStats: { completed: number; escalated: number; suspended: number };
  onReset: () => void;
}

export function DailyMetrics({ teamStats, myStats, onReset }: DailyMetricsProps) {
  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset today's metrics back to zero?")) {
      onReset();
    }
  };

  return (
    <div className="lg:col-span-1 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-xl p-6 shadow-sm flex flex-col h-full transition-colors relative">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <BarChart3 className="w-3.5 h-3.5" />
          Daily Metrics
        </h2>
        <button
          onClick={handleReset}
          title="Reset Metrics"
          className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* TEAM STATS */}
        <div>
          <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
            Team Dashboard (Global)
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] p-3 rounded-lg flex flex-col justify-between transition-colors">
              <div className="flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Completed</span>
              </div>
              <span className="text-2xl font-light text-slate-900 dark:text-white">{teamStats.completed}</span>
            </div>

            <div className="bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] p-3 rounded-lg flex flex-col justify-between transition-colors">
              <div className="flex items-center gap-1.5 mb-2">
                <ArrowUpRight className="w-3.5 h-3.5 text-rose-500" />
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Escalated</span>
              </div>
              <span className="text-2xl font-light text-slate-900 dark:text-white">{teamStats.escalated}</span>
            </div>

            <div className="bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] p-3 rounded-lg flex flex-col justify-between transition-colors">
              <div className="flex items-center gap-1.5 mb-2">
                <PauseCircle className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Suspended</span>
              </div>
              <span className="text-2xl font-light text-slate-900 dark:text-white">{teamStats.suspended}</span>
            </div>

            <div className="bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] p-3 rounded-lg flex flex-col justify-between transition-colors">
              <div className="flex items-center gap-1.5 mb-2">
                <PhoneCall className="w-3.5 h-3.5 text-indigo-500" />
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Calls</span>
              </div>
              <span className="text-2xl font-light text-slate-900 dark:text-white">{teamStats.calls}</span>
            </div>
          </div>
        </div>

        {/* PERSONAL STATS */}
        <div className="border-t border-slate-200 dark:border-[#334155] pt-5">
          <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
            My Dashboard (Personal)
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center p-2 rounded-lg bg-teal-50 dark:bg-[#14b8a6]/10 border border-teal-200 dark:border-[#14b8a6]/20 transition-colors">
              <span className="text-xl font-medium text-teal-700 dark:text-teal-400">{myStats.completed}</span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-teal-600/70 dark:text-teal-500 mt-1">Completed</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 transition-colors">
              <span className="text-xl font-medium text-rose-700 dark:text-rose-400">{myStats.escalated}</span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-rose-600/70 dark:text-rose-500 mt-1">Escalated</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 transition-colors">
              <span className="text-xl font-medium text-amber-700 dark:text-amber-400">{myStats.suspended}</span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-amber-600/70 dark:text-amber-500 mt-1">Suspended</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}