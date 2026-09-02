import { useState } from 'react';
import { StickyNote, Check, X, Pencil, Trash2 } from 'lucide-react';

interface NoteSectionProps {
  questionId: string;
  note: string;
  onSave: (questionId: string, text: string) => void;
}

export function NoteSection({ questionId, note, onSave }: NoteSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(note);

  const handleSave = () => {
    onSave(questionId, draft);
    setIsEditing(false);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setDraft(note);
    setIsEditing(false);
  };

  const handleClear = () => {
    onSave(questionId, '');
    setDraft('');
    setIsEditing(false);
    setIsOpen(false);
  };

  const handleOpen = () => {
    setDraft(note);
    setIsOpen(true);
    setIsEditing(!note);
  };

  if (!isOpen) {
    return (
      <button
        onClick={handleOpen}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
          note
            ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
      >
        <StickyNote className="w-4 h-4" />
        <span>{note ? 'View Note' : 'Add Note'}</span>
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-900/10 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-indigo-700 dark:text-indigo-300">
          <StickyNote className="w-4 h-4" />
          <span>Your Note</span>
        </div>
        <div className="flex items-center gap-1">
          {!isEditing && note && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
              aria-label="Edit note"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}
          {!isEditing && note && (
            <button
              onClick={handleClear}
              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              aria-label="Delete note"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => {
              setIsOpen(false);
              setIsEditing(false);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close note"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isEditing ? (
        <>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add your key points here..."
            className="w-full h-24 p-2.5 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-600"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Cancel
            </button>
          </div>
        </>
      ) : (
        <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
          {note || <span className="text-slate-400 dark:text-slate-500 italic">No note yet.</span>}
        </div>
      )}
    </div>
  );
}
