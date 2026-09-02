import { Settings, Moon, Sun, Bookmark, AlertCircle, StickyNote } from 'lucide-react';

interface HeaderProps {
  onFilterClick: () => void;
  onBookmarksClick: () => void;
  onIncorrectClick: () => void;
  onSubjectNotesClick: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  activeFilters: string[];
  bookmarkCount: number;
  incorrectCount: number;
  subjectNoteCount: number;
}

export function Header({ onFilterClick, onBookmarksClick, onIncorrectClick, onSubjectNotesClick, theme, onToggleTheme, activeFilters, bookmarkCount, incorrectCount, subjectNoteCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-700/50">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            PG Medical MCQ
          </h1>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 -mt-0.5">
            Question Practice
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onBookmarksClick}
            className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
            aria-label="View saved questions"
          >
            <Bookmark className="w-5 h-5" />
            {bookmarkCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
                {bookmarkCount > 9 ? '9+' : bookmarkCount}
              </span>
            )}
          </button>
          <button
            onClick={onSubjectNotesClick}
            className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
            aria-label="Subject notes"
          >
            <StickyNote className="w-5 h-5" />
            {subjectNoteCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-indigo-500 text-white text-[10px] flex items-center justify-center font-bold">
                {subjectNoteCount > 9 ? '9+' : subjectNoteCount}
              </span>
            )}
          </button>
          {incorrectCount > 0 && (
            <button
              onClick={onIncorrectClick}
              className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
              aria-label="View incorrect questions"
            >
              <AlertCircle className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                {incorrectCount > 9 ? '9+' : incorrectCount}
              </span>
            </button>
          )}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <button
            onClick={onFilterClick}
            className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
            aria-label="Open filters"
          >
            <Settings className="w-5 h-5" />
            {activeFilters.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilters.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="max-w-2xl mx-auto px-4 pb-2 flex gap-1.5 flex-wrap">
          {activeFilters.map((f) => (
            <span
              key={f}
              className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-[11px] font-medium"
            >
              {f}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}
