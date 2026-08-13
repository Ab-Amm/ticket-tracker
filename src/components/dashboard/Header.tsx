import { Activity, LogOut, Sun, Moon, LayoutDashboard, ClipboardList, MessageSquareText } from 'lucide-react';
import { getInitials } from '../../lib/utils';
import type { Engineer } from '../../lib/supabase';

interface HeaderProps {
  currentUser: Engineer;
  logout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  activeTab: 'dashboard' | 'suivi' | 'notes';
  setActiveTab: (tab: 'dashboard' | 'suivi' | 'notes') => void;
}

export function Header({ currentUser, logout, theme, toggleTheme, activeTab, setActiveTab }: HeaderProps) {
  return (
    <header className="border-b border-slate-200 dark:border-[#334155] bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-16 grid grid-cols-3 items-center">
        {/* Left: Logo */}
        <div className="flex items-center gap-3 justify-start">
          <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
            <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <span className="text-sm font-bold text-slate-900 dark:text-white tracking-wide hidden sm:block">SyncSpace</span>
        </div>

        {/* Center: Tabs */}
        <div className="flex justify-center items-center gap-2 sm:gap-4 lg:gap-6 w-[350px] lg:w-auto -ml-10 lg:ml-0">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'dashboard' 
                ? 'bg-teal-50 dark:bg-[#14b8a6]/10 text-teal-600 dark:text-[#14b8a6]' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="hidden lg:block">Dashboard</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('suivi')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'suivi' 
                ? 'bg-teal-50 dark:bg-[#14b8a6]/10 text-teal-600 dark:text-[#14b8a6]' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span className="hidden lg:block">Suivi</span>
          </button>

          <button 
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'notes' 
                ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <MessageSquareText className="w-3.5 h-3.5" />
            <span className="hidden lg:block">Notes</span>
          </button>
        </div>

        {/* Right: Active Profile & Theme */}
        <div className="flex items-center justify-end gap-3 md:gap-4">
          <button 
            onClick={toggleTheme} 
            className="p-1.5 md:mr-2 rounded-full text-slate-400 dark:text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4"/> : <Moon className="w-4 h-4"/>}
          </button>

          <div className="flex items-center gap-3 bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] py-1 pl-1 pr-3 rounded-full">
            <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-white font-bold text-[10px]">
              {getInitials(currentUser.name)}
            </div>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 hidden sm:block">{currentUser.name}</span>
          </div>
          
          <button
            onClick={logout}
            className="text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}