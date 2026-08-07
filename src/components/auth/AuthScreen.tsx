import { Activity, ChevronRight, Sparkles, Sun, Moon } from 'lucide-react';
import { getInitials } from '../../lib/utils';
import type { Engineer } from '../../lib/supabase';

interface AuthScreenProps {
  engineers: Engineer[];
  isDemoMode: boolean;
  onLogin: (id: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export function AuthScreen({ engineers, isDemoMode, onLogin, theme, toggleTheme }: AuthScreenProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden transition-colors duration-300">
      
      {/* Theme Toggle Button */}
      <button 
        onClick={toggleTheme} 
        className="absolute top-6 right-6 p-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 shadow-sm transition-all"
        title="Toggle Theme"
      >
        {theme === 'dark' ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}
      </button>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="mx-auto w-14 h-14 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center shadow-sm dark:shadow-lg mb-6">
            <Activity className="w-7 h-7 text-teal-500 dark:text-teal-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">SyncSpace</h1>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 tracking-[0.15em] uppercase">Authentication</p>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-sm dark:shadow-xl">
          <div className="space-y-1">
            {engineers.map((engineer) => (
              <button
                key={engineer.id}
                onClick={() => onLogin(engineer.id)}
                className="w-full group flex items-center justify-between p-3.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border border-teal-500/20 bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold text-sm">
                    {getInitials(engineer.name)}
                  </div>
                  <span className="text-slate-700 dark:text-slate-300 font-medium text-sm group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                    {engineer.name}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {isDemoMode && (
          <div className="mt-8 flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium">
            <Sparkles className="w-3 h-3 text-teal-500 dark:text-teal-500/50" /> Local Demo Mode Active
          </div>
        )}
      </div>
    </div>
  );
}