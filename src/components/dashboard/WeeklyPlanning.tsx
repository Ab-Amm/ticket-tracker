import { CalendarClock } from 'lucide-react';
import type { Engineer } from '../../lib/supabase';
import { getInitials } from '../../lib/utils';

interface WeeklyPlanningProps {
  currentUser: Engineer;
}

// The base sequence of people and shifts defined by the user
const BASE_PEOPLE = ['Abderrahmane', 'Salma K', 'Aimad', 'Otmane', 'Salma M'];
const SHIFTS = ['6:00 AM', '7:00 AM', '7:30 AM', '8:00 AM', '8:00 AM'];

export function WeeklyPlanning({ currentUser }: WeeklyPlanningProps) {
  
  // Calculate current week's Monday and how many weeks have passed since a benchmark
  const getWeeksPassedAndDateRange = () => {
    const now = new Date();
    
    // Find the Monday of the current week (local time)
    const day = now.getDay();
    // If Sunday (0), we go back 6 days to Monday. Otherwise, go back day-1 days.
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);

    // Find the Sunday of the current week
    const sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 6);

    // Benchmark Monday: We set this to the week of August 3, 2026.
    // This locks in the 0 offset so the schedule exactly matches the user's requirement for this week.
    // Every subsequent Monday from this date will increment the offset by 1.
    const benchmark = new Date(2026, 7, 3); // August 3, 2026 (Month is 0-indexed, so 7 is August)
    
    // Use UTC for diffing to avoid Daylight Savings Time (DST) fractions
    const utcMonday = Date.UTC(monday.getFullYear(), monday.getMonth(), monday.getDate());
    const utcBenchmark = Date.UTC(benchmark.getFullYear(), benchmark.getMonth(), benchmark.getDate());
    
    const msInWeek = 7 * 24 * 60 * 60 * 1000;
    // Calculate weeks passed. If we are somehow looking at a date before the benchmark, we max to 0.
    const weeksPassed = Math.max(0, Math.round((utcMonday - utcBenchmark) / msInWeek));

    const formatDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return {
       weeksPassed,
       dateRange: `${formatDate(monday)} - ${formatDate(sunday)}`
    };
  };

  const { weeksPassed, dateRange } = getWeeksPassedAndDateRange();
  
  // The offset shifts the people sequence left by 1 index per week.
  // We use modulo 5 because there are 5 team members.
  const offset = weeksPassed % 5;

  // Reconstruct the ordered schedule based on the offset
  const orderedSchedule = [];
  for (let i = 0; i < 5; i++) {
     // Mathematical rotation to find who gets shift 'i' this week
     const personIndex = (i + offset) % 5;
     orderedSchedule.push({ 
       name: BASE_PEOPLE[personIndex], 
       shift: SHIFTS[i] 
     });
  }

  return (
    <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-xl p-6 shadow-sm flex flex-col transition-colors w-full">
       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
         <h2 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
           <CalendarClock className="w-3.5 h-3.5" />
           This Week's Planning
         </h2>
         <span className="text-[10px] font-bold tracking-widest text-teal-700 dark:text-teal-400 uppercase bg-teal-50 dark:bg-teal-500/10 px-3 py-1.5 rounded-lg border border-teal-200 dark:border-teal-500/20">
           {dateRange}
         </span>
       </div>
       
       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {orderedSchedule.map((item, idx) => {
            // Check if this card belongs to the currently logged in user
            const isMe = item.name === currentUser.name;
            
            return (
              <div 
                key={idx} 
                className={`relative overflow-hidden flex flex-col items-center justify-center p-5 rounded-xl border transition-all duration-300 ${
                  isMe 
                    ? 'bg-teal-50 dark:bg-teal-500/10 border-teal-300 dark:border-teal-500/30 shadow-md shadow-teal-500/10' 
                    : 'bg-slate-50 dark:bg-[#0f172a] border-slate-200 dark:border-[#334155]'
                }`}
              >
                 {isMe && (
                   <div className="absolute top-0 left-0 w-full h-1 bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.5)]"></div>
                 )}
                 <div className="text-[11px] font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 mb-4">
                   {item.shift}
                 </div>
                 
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold mb-3 transition-colors ${
                   isMe 
                     ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30' 
                     : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                 }`}>
                   {getInitials(item.name)}
                 </div>
                 
                 <div className={`text-xs font-semibold text-center tracking-wide ${
                   isMe ? 'text-teal-700 dark:text-teal-400' : 'text-slate-700 dark:text-slate-300'
                 }`}>
                   {item.name}
                 </div>
              </div>
            );
          })}
       </div>
    </div>
  );
}