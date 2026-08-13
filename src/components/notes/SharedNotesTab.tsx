import { useState, useMemo } from 'react';
import { Send, Search, Filter, Calendar as CalendarIcon, MessageSquareText } from 'lucide-react';
import type { Engineer, Note } from '../../lib/supabase';
import { getInitials } from '../../lib/utils';

interface SharedNotesTabProps {
  engineers: Engineer[];
  notes: Note[];
  currentUser: Engineer;
  onAddNote: (content: string) => void;
}

export function SharedNotesTab({ engineers, notes, currentUser, onAddNote }: SharedNotesTabProps) {
  const [newNoteContent, setNewNoteContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [authorFilter, setAuthorFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week'>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNoteContent.trim()) {
      onAddNote(newNoteContent.trim());
      setNewNoteContent('');
    }
  };

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      // 1. Author Filter
      if (authorFilter !== 'all' && note.engineer_id !== authorFilter) return false;

      // 2. Search Filter
      if (searchQuery.trim() && !note.content.toLowerCase().includes(searchQuery.toLowerCase())) return false;

      // 3. Date Filter
      if (dateFilter !== 'all') {
        const noteDate = new Date(note.created_at);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (dateFilter === 'today') {
          if (noteDate < today) return false;
        } else if (dateFilter === 'week') {
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          if (noteDate < weekAgo) return false;
        }
      }

      return true;
    });
  }, [notes, authorFilter, searchQuery, dateFilter]);

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      
      {/* HEADER & INPUT SECTION */}
      <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-xl shadow-sm overflow-hidden transition-colors">
        <div className="p-6 border-b border-slate-200 dark:border-[#334155] bg-slate-50 dark:bg-[#0f172a]/50">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <MessageSquareText className="w-4 h-4 text-indigo-500" />
            Shared Operations Notes
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Log handoff notes, system outages, or important updates for the team.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 flex gap-4">
           <div className="flex-shrink-0 pt-1">
             <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center text-xs font-bold shadow-sm">
               {getInitials(currentUser.name)}
             </div>
           </div>
           <div className="flex-1 flex flex-col gap-3">
             <textarea
               value={newNoteContent}
               onChange={e => setNewNoteContent(e.target.value)}
               placeholder="Write a note to the team..."
               className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow placeholder:text-slate-400 dark:placeholder:text-slate-600 min-h-[100px] resize-y text-sm"
             />
             <div className="flex justify-end">
               <button
                 type="submit"
                 disabled={!newNoteContent.trim()}
                 className="px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-400 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-900/10 flex items-center gap-2"
               >
                 Post Note <Send className="w-3.5 h-3.5" />
               </button>
             </div>
           </div>
        </form>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] p-4 rounded-xl shadow-sm transition-colors">
        
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] text-slate-900 dark:text-white rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-shadow"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-lg px-3 py-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={authorFilter}
              onChange={(e) => setAuthorFilter(e.target.value)}
              className="bg-transparent text-sm text-slate-700 dark:text-slate-300 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Engineers</option>
              {engineers.map(e => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-[#334155] rounded-lg px-3 py-2">
            <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="bg-transparent text-sm text-slate-700 dark:text-slate-300 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Past 7 Days</option>
            </select>
          </div>
        </div>

      </div>

      {/* FEED DISPLAY */}
      <div className="flex flex-col gap-4 pb-10">
        {filteredNotes.length === 0 ? (
          <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] rounded-xl p-10 text-center flex flex-col items-center gap-3 text-slate-400">
            <MessageSquareText className="w-8 h-8 opacity-20" />
            <p className="text-sm">No notes found matching your criteria.</p>
          </div>
        ) : (
          filteredNotes.map(note => {
            const author = engineers.find(e => e.id === note.engineer_id);
            const authorName = author?.name || 'Unknown Engineer';
            const isMyNote = author?.id === currentUser.id;

            return (
              <div key={note.id} className={`bg-white dark:bg-[#1e293b] border rounded-xl p-5 shadow-sm transition-colors ${isMyNote ? 'border-indigo-200 dark:border-indigo-500/30' : 'border-slate-200 dark:border-[#334155]'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm ${isMyNote ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'}`}>
                      {getInitials(authorName)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        {authorName}
                        {isMyNote && <span className="bg-indigo-500/10 text-indigo-500 text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded border border-indigo-500/20">You</span>}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(note.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap pl-11">
                  {note.content}
                </p>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}