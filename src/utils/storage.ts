import type { AttemptRecord, BookmarkRecord, NoteRecord } from '../types';

const ATTEMPTS_KEY = 'pgmcq-attempts';
const BOOKMARKS_KEY = 'pgmcq-bookmarks';
const NOTES_KEY = 'pgmcq-notes';
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

export function loadNotes(): NoteRecord[] {
  try {
    const data = localStorage.getItem(NOTES_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((n: Record<string, unknown>) => ({
      questionId: String(n.questionId || ''),
      text: String(n.text || ''),
      timestamp: Number(n.timestamp || 0),
    })).filter((n: NoteRecord) => n.questionId);
  } catch {
    return [];
  }
}

export function saveNotes(notes: NoteRecord[]): void {
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  } catch {
    // ignore
  }
}

export function upsertNote(notes: NoteRecord[], questionId: string, text: string): NoteRecord[] {
  const existing = notes.find((n) => n.questionId === questionId);
  if (text.trim() === '') {
    return notes.filter((n) => n.questionId !== questionId);
  }
  if (existing) {
    return notes.map((n) =>
      n.questionId === questionId ? { ...n, text, timestamp: Date.now() } : n
    );
  }
  return [...notes, { questionId, text, timestamp: Date.now() }];
}

export function getNote(notes: NoteRecord[], questionId: string): string {
  return notes.find((n) => n.questionId === questionId)?.text || '';
}

const SUBJECT_NOTES_KEY = 'pgmcq-subject-notes';

export interface SubjectNote {
  subject: string;
  text: string;
  timestamp: number;
}

export function loadSubjectNotes(): SubjectNote[] {
  try {
    const data = localStorage.getItem(SUBJECT_NOTES_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((n: Record<string, unknown>) => ({
      subject: String(n.subject || ''),
      text: String(n.text || ''),
      timestamp: Number(n.timestamp || 0),
    })).filter((n: SubjectNote) => n.subject);
  } catch {
    return [];
  }
}

export function saveSubjectNotes(notes: SubjectNote[]): void {
  try {
    localStorage.setItem(SUBJECT_NOTES_KEY, JSON.stringify(notes));
  } catch {
    // ignore
  }
}

export function upsertSubjectNote(notes: SubjectNote[], subject: string, text: string): SubjectNote[] {
  const existing = notes.find((n) => n.subject === subject);
  if (text.trim() === '') {
    return notes.filter((n) => n.subject !== subject);
  }
  if (existing) {
    return notes.map((n) =>
      n.subject === subject ? { ...n, text, timestamp: Date.now() } : n
    );
  }
  return [...notes, { subject, text, timestamp: Date.now() }];
}

export function getSubjectNote(notes: SubjectNote[], subject: string): string {
  return notes.find((n) => n.subject === subject)?.text || '';
}
