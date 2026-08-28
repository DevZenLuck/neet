export interface QuestionOption {
  label: string;
  text: string;
}

export interface QuestionImage {
  url: string;
  caption: string;
  source: string;
}

export interface QuestionSource {
  type: 'official' | 'trusted' | 'recalled';
  organization: string;
  documentTitle: string;
  url: string | null;
  page: number | null;
}

export interface QuestionVerification {
  questionVerified: boolean;
  answerVerified: boolean;
  explanationVerified: boolean;
}

export interface QuestionClassification {
  subject: string | null;
  topic: string | null;
  subtopic: string | null;
  tags: string[];
}

export interface QuestionExam {
  name: string;
  fullName: string;
  year: number;
}

export interface QuestionAnswer {
  correctOption: string;
  correctText: string;
  explanation: string | null;
  status: 'confirmed' | 'disputed' | 'uncertain';
}

export interface Question {
  id: string;
  exam: QuestionExam;
  question: {
    text: string;
    type: string;
    options: QuestionOption[];
  };
  answer: QuestionAnswer;
  classification: QuestionClassification;
  images: QuestionImage[];
  source: QuestionSource;
  verification: QuestionVerification;
}

export interface AttemptRecord {
  questionId: string;
  selectedOption: string;
  isCorrect: boolean;
  lastAttemptedAt: number;
}

export interface UserProgress {
  questionId: string;
  attempted: boolean;
  selectedOption: string | null;
  isCorrect: boolean;
  bookmarked: boolean;
  lastAttemptedAt: number | null;
}

export interface BookmarkRecord {
  questionId: string;
  timestamp: number;
}

export interface Filters {
  exam: string | 'all';
  year: number | 'all';
  subject: string | 'all';
  topic: string | 'all';
  subtopic: string | 'all';
  source: 'all' | 'official' | 'trusted' | 'recalled';
  status: 'all' | 'unattempted' | 'correct' | 'incorrect' | 'bookmarked';
}

export type Theme = 'light' | 'dark';
