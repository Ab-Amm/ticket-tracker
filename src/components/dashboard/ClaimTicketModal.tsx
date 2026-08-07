import { useState } from 'react';
import { X, Zap } from 'lucide-react';

interface ClaimTicketModalProps {
  onClose: () => void;
  onSubmit: (ticketId: string) => void;
}

export function ClaimTicketModal({ onClose, onSubmit }: ClaimTicketModalProps) {
  const [ticketId, setTicketId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticketId.trim().length > 0) {
      onSubmit(ticketId.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-2xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-[#334155] bg-slate-50 dark:bg-[#0f172a]/50">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-teal-500" />
            Claim Next Ticket
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          <div>
            <label htmlFor="ticketId" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
              Ticket Number / ID <span className="text-rose-500">*</span>
            </label>
            <input
              autoFocus
              id="ticketId"
              type="text"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              placeholder="e.g. INC-123456"
              className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-[#14b8a6] transition-shadow placeholder:text-slate-400 dark:placeholder:text-slate-600 font-mono"
            />
            <p className="text-xs text-slate-500 mt-2">
              You must enter a valid Ticket ID to advance the queue and officially claim your turn.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={ticketId.trim().length === 0}
              className="px-5 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider text-white bg-teal-600 dark:bg-[#0d9488] hover:bg-teal-700 dark:hover:bg-[#0f766e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Claim Ticket
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}