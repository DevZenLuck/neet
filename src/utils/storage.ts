import type { AttemptRecord, BookmarkRecord } from '../types';

const ATTEMPTS_KEY = 'pgmcq-attempts';
const BOOKMARKS_KEY = 'pgmcq-bookmarks';
const THEME_KEY = 'pgmcq-theme';

export function loadAttempts(): AttemptRecord[] {
  try {
    const data = localStorage.getItem(ATTEMPTS_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((a: Record<string, unknown>) => ({
      questionId: String(a.questionId || ''),
      selectedOption: String(a.selectedOption || ''),
      isCorrect: Boolean(a.isCorrect),
      lastAttemptedAt: Number(a.lastAttemptedAt || a.timestamp || 0),
    })).filter((a: AttemptRecord) => a.questionId);
  } catch {
    return [];
  }
}

export function saveAttempts(attempts: AttemptRecord[]): void {
  try {
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));
  } catch {
    // localStorage not available or full
  }
}

export function addAttempt(attempts: AttemptRecord[], attempt: AttemptRecord): AttemptRecord[] {
  const filtered = attempts.filter((a) => a.questionId !== attempt.questionId);
  return [...filtered, attempt];
}

export function removeAttempt(attempts: AttemptRecord[], questionId: string): AttemptRecord[] {
  return attempts.filter((a) => a.questionId !== questionId);
}

export function loadBookmarks(): BookmarkRecord[] {
  try {
    const data = localStorage.getItem(BOOKMARKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveBookmarks(bookmarks: BookmarkRecord[]): void {
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  } catch {
    // localStorage not available or full
  }
}

export function toggleBookmark(bookmarks: BookmarkRecord[], questionId: string): BookmarkRecord[] {
  const exists = bookmarks.find((b) => b.questionId === questionId);
  if (exists) {
    return bookmarks.filter((b) => b.questionId !== questionId);
  }
  return [...bookmarks, { questionId, timestamp: Date.now() }];
}

export function isBookmarked(bookmarks: BookmarkRecord[], questionId: string): boolean {
  return bookmarks.some((b) => b.questionId === questionId);
}

export function loadTheme(): 'light' | 'dark' {
  try {
    const data = localStorage.getItem(THEME_KEY);
    if (data === 'dark' || data === 'light') return data;
  } catch {
    // ignore
  }
  return 'light';
}

export function saveTheme(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // ignore
  }
}
