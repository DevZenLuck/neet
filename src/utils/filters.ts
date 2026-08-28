import type { Question, Filters, AttemptRecord, BookmarkRecord } from '../types';

export function filterQuestions(
  questions: Question[],
  filters: Filters,
  attempts: AttemptRecord[],
  bookmarks: BookmarkRecord[]
): Question[] {
  return questions.filter((q) => {
    if (filters.exam !== 'all' && q.exam.name !== filters.exam) return false;
    if (filters.year !== 'all' && q.exam.year !== filters.year) return false;
    if (filters.subject !== 'all' && q.classification.subject !== filters.subject) return false;
    if (filters.topic !== 'all' && q.classification.topic !== filters.topic) return false;
    if (filters.subtopic !== 'all' && q.classification.subtopic !== filters.subtopic) return false;

    if (filters.source !== 'all' && q.source.type !== filters.source) return false;

    if (filters.status !== 'all') {
      const attempt = attempts.find((a) => a.questionId === q.id);
      const bookmarked = bookmarks.some((b) => b.questionId === q.id);
      if (filters.status === 'unattempted' && attempt) return false;
      if (filters.status === 'correct' && (!attempt || !attempt.isCorrect)) return false;
      if (filters.status === 'incorrect' && (!attempt || attempt.isCorrect)) return false;
      if (filters.status === 'bookmarked' && !bookmarked) return false;
    }

    return true;
  });
}

export function getUniqueExams(questions: Question[]): string[] {
  const exams = new Set(questions.map((q) => q.exam.name));
  return Array.from(exams).sort();
}

export function getUniqueYears(questions: Question[], exam?: string): number[] {
  const filtered = exam && exam !== 'all'
    ? questions.filter((q) => q.exam.name === exam)
    : questions;
  const years = new Set(filtered.map((q) => q.exam.year));
  return Array.from(years).sort((a, b) => b - a);
}

export function getUniqueSubjects(questions: Question[]): string[] {
  const subjects = new Set(
    questions.map((q) => q.classification.subject).filter((s): s is string => s !== null)
  );
  return Array.from(subjects).sort();
}

export function getUniqueTopics(questions: Question[], subject?: string): string[] {
  const filtered = subject && subject !== 'all'
    ? questions.filter((q) => q.classification.subject === subject)
    : questions;
  const topics = new Set(
    filtered.map((q) => q.classification.topic).filter((t): t is string => t !== null)
  );
  return Array.from(topics).sort();
}

export function getUniqueSubtopics(questions: Question[], subject?: string, topic?: string): string[] {
  let filtered = questions;
  if (subject && subject !== 'all') {
    filtered = filtered.filter((q) => q.classification.subject === subject);
  }
  if (topic && topic !== 'all') {
    filtered = filtered.filter((q) => q.classification.topic === topic);
  }
  const subtopics = new Set(
    filtered.map((q) => q.classification.subtopic).filter((s): s is string => s !== null)
  );
  return Array.from(subtopics).sort();
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
