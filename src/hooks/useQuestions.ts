import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Question, Filters, AttemptRecord, BookmarkRecord } from '../types';
import { getQuestions } from '../data/loader';
import { filterQuestions, shuffleArray } from '../utils/filters';
import { loadAttempts, saveAttempts, addAttempt, loadBookmarks, saveBookmarks, toggleBookmark } from '../utils/storage';

const SESSION_WINDOW = 20;

export function useQuestions() {
  const allQuestions = useMemo(() => getQuestions(), []);

  const [filters, setFilters] = useState<Filters>({
    exam: 'all',
    year: 'all',
    subject: 'all',
    topic: 'all',
    subtopic: 'all',
    source: 'all',
    status: 'all',
  });
  const [attempts, setAttempts] = useState<AttemptRecord[]>(() => loadAttempts());
  const [bookmarks, setBookmarks] = useState<BookmarkRecord[]>(() => loadBookmarks());
  const [sessionHistory, setSessionHistory] = useState<string[]>([]);
  const [currentQueue, setCurrentQueue] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredQuestions = useMemo(
    () => filterQuestions(allQuestions, filters, attempts, bookmarks),
    [allQuestions, filters, attempts, bookmarks]
  );

  const rebuildQueue = useCallback(() => {
    const eligible = filteredQuestions.filter((q) => !sessionHistory.includes(q.id));
    const pool = eligible.length > 0 ? eligible : filteredQuestions;
    const shuffled = shuffleArray(pool);
    setCurrentQueue(shuffled);
    setCurrentIndex(0);
  }, [filteredQuestions, sessionHistory]);

  useEffect(() => {
    rebuildQueue();
  }, [rebuildQueue]);

  const currentQuestion = currentQueue[currentIndex] || null;

  const goToNext = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= currentQueue.length) {
      setSessionHistory((prev) => {
        const newHistory = [...prev, ...currentQueue.map((q) => q.id)];
        return newHistory.slice(-SESSION_WINDOW);
      });
      rebuildQueue();
    } else {
      setCurrentIndex(nextIndex);
      if (currentQueue[nextIndex]) {
        setSessionHistory((prev) => {
          const newHistory = [...prev, currentQueue[nextIndex].id];
          return newHistory.slice(-SESSION_WINDOW);
        });
      }
    }
  }, [currentIndex, currentQueue, rebuildQueue]);

  const recordAttempt = useCallback(
    (questionId: string, selectedOption: string, isCorrect: boolean) => {
      const attempt: AttemptRecord = {
        questionId,
        selectedOption,
        isCorrect,
        lastAttemptedAt: Date.now(),
      };
      const updated = addAttempt(attempts, attempt);
      setAttempts(updated);
      saveAttempts(updated);
    },
    [attempts]
  );

  const toggleBook = useCallback(
    (questionId: string) => {
      const updated = toggleBookmark(bookmarks, questionId);
      setBookmarks(updated);
      saveBookmarks(updated);
    },
    [bookmarks]
  );

  const clearFilters = useCallback(() => {
    setFilters({
      exam: 'all',
      year: 'all',
      subject: 'all',
      topic: 'all',
      subtopic: 'all',
      source: 'all',
      status: 'all',
    });
  }, []);

  const stats = useMemo(() => ({
    total: filteredQuestions.length,
    attempted: attempts.length,
    correct: attempts.filter((a) => a.isCorrect).length,
    incorrect: attempts.filter((a) => !a.isCorrect).length,
    bookmarked: bookmarks.length,
  }), [filteredQuestions, attempts, bookmarks]);

  return {
    currentQuestion,
    filteredQuestions,
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
    totalFiltered: filteredQuestions.length,
  };
}
