export function LoadingSkeleton() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col px-4 py-6">
      <div className="max-w-2xl mx-auto w-full space-y-4 animate-pulse">
        <div className="flex gap-2">
          <div className="h-6 w-28 rounded-lg bg-slate-200 dark:bg-slate-700" />
          <div className="h-6 w-20 rounded-lg bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-4 w-4/5 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="space-y-3">
          <div className="h-14 w-full rounded-xl bg-slate-200 dark:bg-slate-700" />
          <div className="h-14 w-full rounded-xl bg-slate-200 dark:bg-slate-700" />
          <div className="h-14 w-full rounded-xl bg-slate-200 dark:bg-slate-700" />
          <div className="h-14 w-full rounded-xl bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="h-12 w-full rounded-xl bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  );
}

export function EmptyState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        <span className="text-3xl">📚</span>
      </div>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
        No questions found
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-xs">
        No questions match your current filters. Try adjusting your filter criteria.
      </p>
      <button
        onClick={onClearFilters}
        className="px-6 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
      >
        Clear Filters
      </button>
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
        <span className="text-3xl">⚠️</span>
      </div>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
        Unable to load questions
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-xs">
        Something went wrong while loading the question data. Please try again.
      </p>
      <button
        onClick={onRetry}
        className="px-6 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
      >
        Retry
      </button>
    </div>
  );
}
