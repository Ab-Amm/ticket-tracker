import { Users } from 'lucide-react';
import { getInitials } from '../../lib/utils';
import type { Engineer, Ticket } from '../../lib/supabase';

interface AgentRosterProps {
  engineers: Engineer[];
  currentUser: Engineer;
  nextUp: Engineer | null;
  tickets: Ticket[];
}

export function AgentRoster({ engineers, currentUser, nextUp, tickets }: AgentRosterProps) {
  return (
    <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-xl p-6 shadow-sm flex flex-col h-full transition-colors">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Users className="w-3.5 h-3.5" />
          Agent Roster
        </h2>
        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase">
          {engineers.length} Active
        </span>
      </div>

      <div className="flex-1 bg-slate-50 dark:bg-[#0f172a]/50 rounded-lg border border-slate-200 dark:border-[#334155]/50 overflow-hidden">
        {engineers.map((engineer) => {
          const isNext = engineer.id === nextUp?.id;
          const isMe = engineer.id === currentUser.id;
          const activeTicketsCount = tickets.filter(t => t.engineer_id === engineer.id && (t.status === 'active' || t.status === 'escalated' || t.status === 'suspended')).length;

          return (
            <div
              key={engineer.id}
              className="flex items-center justify-between p-3.5 border-b border-slate-200 dark:border-[#334155]/50 last:border-0 hover:bg-slate-100 dark:hover:bg-[#1e293b]/50 transition-colors"
            >
              {/* Left: Avatar & Name */}
              <div className="flex items-center gap-3 w-1/3">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center text-[11px] font-bold">
                  {getInitials(engineer.name)}
                </div>
                <div className="flex flex-col">
                  <span className={`text-sm font-medium ${isMe ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                    {engineer.name}
                  </span>
                  {activeTicketsCount > 0 && (
                     <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        {activeTicketsCount} Active Ticket{activeTicketsCount > 1 ? 's' : ''}
                     </span>
                  )}
                </div>
              </div>

              {/* Middle: Status Indicator (Now just purely Online since we allow multiple) */}
              <div className="flex items-center gap-2 w-1/3">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    engineer.status === 'available'
                      ? 'bg-teal-500 dark:bg-[#14b8a6]'
                      : engineer.status === 'retreat'
                      ? 'bg-violet-500 dark:bg-violet-400'
                      : 'bg-slate-400 dark:bg-slate-600'
                  }`}
                />
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-medium">
                  {engineer.status === 'available' ? 'Online' : engineer.status === 'retreat' ? 'On Retreat' : 'Offline'}
                </span>
              </div>

              {/* Right: Pill Tags */}
              <div className="flex items-center justify-end gap-2 w-1/3">
                {isMe && (
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    You
                  </span>
                )}
                {isNext && (
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase bg-teal-100 dark:bg-[#0d9488]/20 text-teal-700 dark:text-[#14b8a6] border border-teal-200 dark:border-[#0d9488]/30">
                    Next In Line
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}