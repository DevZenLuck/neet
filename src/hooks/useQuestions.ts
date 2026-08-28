import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  const [currentQueue, setCurrentQueue] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const sessionHistoryRef = useRef<string[]>([]);
  const filteredRef = useRef<Question[]>(allQuestions);

  const filteredQuestions = useMemo(
    () => filterQuestions(allQuestions, filters, attempts, bookmarks),
    [allQuestions, filters, attempts, bookmarks]
  );

  useEffect(() => {
    filteredRef.current = filteredQuestions;
  }, [filteredQuestions]);

  const rebuildQueue = useCallback(() => {
    const pool = filteredRef.current;
    if (pool.length === 0) {
      setCurrentQueue([]);
      setCurrentIndex(0);
      return;
    }
    const eligible = pool.filter((q) => !sessionHistoryRef.current.includes(q.id));
    const shuffled = shuffleArray(eligible.length > 0 ? eligible : pool);
    setCurrentQueue(shuffled);
    setCurrentIndex(0);
  }, []);

  useEffect(() => {
    rebuildQueue();
  }, [filters, rebuildQueue]);

  const currentQuestion = currentQueue[currentIndex] || null;

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      if (nextIndex >= currentQueue.length) {
        sessionHistoryRef.current = [
          ...sessionHistoryRef.current,
          ...currentQueue.map((q) => q.id),
        ].slice(-SESSION_WINDOW);
        const pool = filteredRef.current;
        const eligible = pool.filter((q) => !sessionHistoryRef.current.includes(q.id));
        const shuffled = shuffleArray(eligible.length > 0 ? eligible : pool);
        setCurrentQueue(shuffled);
        return 0;
      }
      if (currentQueue[nextIndex]) {
        sessionHistoryRef.current = [
          ...sessionHistoryRef.current,
          currentQueue[nextIndex].id,
        ].slice(-SESSION_WINDOW);
      }
      return nextIndex;
    });
  }, [currentQueue]);

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
