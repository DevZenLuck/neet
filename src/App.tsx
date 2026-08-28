import { useState, useCallback, useEffect } from 'react';
import { useQuestions } from './hooks/useQuestions';
import { useTheme } from './hooks/useTheme';
import { Header } from './components/Header';
import { QuestionCard } from './components/QuestionCard';
import { FilterPanel } from './components/FilterPanel';
import { StatsBar } from './components/StatsBar';
import { LoadingSkeleton, EmptyState } from './components/States';
import { isBookmarked } from './utils/storage';

function App() {
  const {
    currentQuestion,
    allQuestions,
    filters,
    setFilters,
    attempts,
    bookmarks,
    isFilterOpen,
    setIsFilterOpen,
    goToNext,
    recordAttempt,
    toggleBook,
    clearFilters,
    stats,
  } = useQuestions();

  const { theme, toggleTheme } = useTheme();
  const [isLoading] = useState(false);

  const activeFilters: string[] = [];
  if (filters.exam !== 'all') activeFilters.push(filters.exam);
  if (filters.year !== 'all') activeFilters.push(String(filters.year));
  if (filters.subject !== 'all') activeFilters.push(filters.subject);
  if (filters.topic !== 'all') activeFilters.push(filters.topic);
  if (filters.subtopic !== 'all') activeFilters.push(filters.subtopic);
  if (filters.source !== 'all') activeFilters.push(filters.source.charAt(0).toUpperCase() + filters.source.slice(1));
  if (filters.status !== 'all') activeFilters.push(filters.status.charAt(0).toUpperCase() + filters.status.slice(1));

  const handleNext = useCallback(() => {
    goToNext();
  }, [goToNext]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'j') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-200">
      <Header
        onFilterClick={() => setIsFilterOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        activeFilters={activeFilters}
      />

      <StatsBar stats={stats} />

      {isLoading ? (
        <LoadingSkeleton />
      ) : currentQuestion ? (
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          attempt={attempts.find((a) => a.questionId === currentQuestion.id)}
          isBookmarked={isBookmarked(bookmarks, currentQuestion.id)}
          onRecordAttempt={recordAttempt}
          onToggleBookmark={toggleBook}
          onNext={handleNext}
        />
      ) : (
        <EmptyState onClearFilters={clearFilters} />
      )}

      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        onClear={clearFilters}
        allQuestions={allQuestions}
      />

      <div className="fixed bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-slate-950 to-transparent pointer-events-none z-30" />
    </div>
  );
}

export default App;
