import { X, Bookmark, ChevronRight } from 'lucide-react';
import type { Question, BookmarkRecord, AttemptRecord } from '../types';

interface BookmarksPanelProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: BookmarkRecord[];
  allQuestions: Question[];
  attempts: AttemptRecord[];
  onGoToQuestion: (questionId: string) => void;
  onRemoveBookmark: (questionId: string) => void;
}

export function BookmarksPanel({
  isOpen,
  onClose,
  bookmarks,
  allQuestions,
  attempts,
  onGoToQuestion,
  onRemoveBookmark,
}: BookmarksPanelProps) {
  if (!isOpen) return null;

  const bookmarkedQuestions = bookmarks
    .map((b) => {
      const q = allQuestions.find((q) => q.id === b.questionId);
      return q ? { question: q, bookmark: b } : null;
    })
    .filter((item): item is { question: Question; bookmark: BookmarkRecord } => item !== null)
    .sort((a, b) => b.bookmark.timestamp - a.bookmark.timestamp);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-2xl max-h-[85vh] flex flex-col">
        <div className="sticky top-0 bg-white dark:bg-slate-900 p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-amber-500" fill="currentColor" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Saved Questions
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              ({bookmarkedQuestions.length})
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {bookmarkedQuestions.length === 0 ? (
            <div className="text-center py-12">
              <Bookmark className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No saved questions yet.
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Tap the bookmark icon on any question to save it here.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {bookmarkedQuestions.map(({ question: q, bookmark }) => {
                const attempt = attempts.find((a) => a.questionId === q.id);
                return (
                  <div
                    key={q.id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer group"
                    onClick={() => {
                      onGoToQuestion(q.id);
                      onClose();
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                          <span className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-semibold">
                            {q.exam.name} {q.exam.year}
                          </span>
                          {q.classification.subject && (
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">
                              {q.classification.subject}
                            </span>
                          )}
                          {attempt && (
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                attempt.isCorrect
                                  ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                              }`}
                            >
                              {attempt.isCorrect ? 'Correct' : 'Incorrect'}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-800 dark:text-slate-200 line-clamp-2 leading-relaxed">
                          {q.question.text}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveBookmark(q.id);
                          }}
                          className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                          aria-label="Remove bookmark"
                        >
                          <Bookmark className="w-4 h-4" fill="currentColor" />
                        </button>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
