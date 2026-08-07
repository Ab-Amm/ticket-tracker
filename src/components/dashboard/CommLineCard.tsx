import { PhoneCall, Undo2 } from 'lucide-react';
import type { AppState, Engineer } from '../../lib/supabase';

interface CommLineCardProps {
  appState: AppState | null;
  currentUser: Engineer;
  phoneOccupant?: Engineer;
  togglePhone: () => void;
  undoPhone: () => void;
}

export function CommLineCard({ appState, currentUser, phoneOccupant, togglePhone, undoPhone }: CommLineCardProps) {
  const isOccupied = appState?.phone_occupied_by !== null;
  const isMe = appState?.phone_occupied_by === currentUser.id;

  return (
    <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-xl p-6 shadow-sm flex flex-col justify-between h-full transition-colors">
      <div>
        <h2 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <PhoneCall className="w-3.5 h-3.5" />
          Shared Comm Line
        </h2>

        <div className="flex items-start gap-4 mb-5">
          <div
            className={`mt-1 flex-shrink-0 w-2.5 h-2.5 rounded-full ${
              isOccupied ? 'bg-rose-500' : 'bg-teal-500 dark:bg-[#14b8a6]'
            }`}
          />
          <div>
            {isOccupied ? (
              <>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white leading-tight mb-1">Line Occupied</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  In use by <strong className="text-rose-600 dark:text-rose-400">{phoneOccupant?.name || 'Someone'}</strong>
                </p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white leading-tight mb-1">Line Available</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Phone is free and ready for dispatch.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Inline Action Button */}
      <div className="flex gap-2">
        {isOccupied ? (
          <>
            <button
              onClick={togglePhone}
              disabled={!isMe}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors border ${
                isMe
                  ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/30 hover:bg-rose-100 dark:hover:bg-rose-500/20'
                  : 'bg-slate-50 dark:bg-[#0f172a] text-slate-400 dark:text-slate-600 border-slate-200 dark:border-[#334155] cursor-not-allowed'
              }`}
            >
              {isMe ? 'Release Line' : 'Locked'}
            </button>
            {isMe && (
              <button
                onClick={undoPhone}
                title="Undo Mistake (Delete Log)"
                className="px-4 rounded-lg transition-all flex items-center justify-center bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] text-slate-400 hover:border-rose-500/30 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10"
              >
                <Undo2 className="w-4 h-4" />
              </button>
            )}
          </>
        ) : (
          <button
            onClick={togglePhone}
            className="w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors bg-teal-600 dark:bg-[#0d9488] hover:bg-teal-700 dark:hover:bg-[#0f766e] text-white"
          >
            Claim Line
          </button>
        )}
      </div>
    </div>
  );
}