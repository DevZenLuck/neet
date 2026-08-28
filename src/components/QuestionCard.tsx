import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import type { Question, AttemptRecord } from '../types';
import { OptionButton } from './OptionButton';
import { AnswerResult } from './AnswerResult';
import { ExplanationSection } from './ExplanationSection';
import { BookmarkButton } from './BookmarkButton';

interface QuestionCardProps {
  question: Question;
  attempt: AttemptRecord | undefined;
  isBookmarked: boolean;
  onRecordAttempt: (questionId: string, selectedOption: string, isCorrect: boolean) => void;
  onToggleBookmark: (questionId: string) => void;
  onNext: () => void;
}

export function QuestionCard({
  question,
  attempt,
  isBookmarked,
  onRecordAttempt,
  onToggleBookmark,
  onNext,
}: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(
    attempt?.selectedOption || null
  );
  const [revealed, setRevealed] = useState(!!attempt);

  const handleCheck = () => {
    if (!selectedAnswer) return;
    const isCorrect = selectedAnswer === question.answer.correctOption;
    onRecordAttempt(question.id, selectedAnswer, isCorrect);
    setRevealed(true);
  };

  const isCorrect = attempt
    ? attempt.selectedOption === question.answer.correctOption
    : selectedAnswer === question.answer.correctOption;

  const selectedOption = question.question.options.find((o) => o.label === selectedAnswer);
  const correctOption = question.question.options.find((o) => o.label === question.answer.correctOption);

  return (
    <article className="min-h-[calc(100vh-80px)] flex flex-col px-4 py-6">
      <div className="flex-1 max-w-2xl mx-auto w-full">
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold">
              {question.exam.name} {question.exam.year}
            </span>
            {question.classification.subject && (
              <>
                <span className="text-xs text-slate-500 dark:text-slate-400">&middot;</span>
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  {question.classification.subject}
                </span>
              </>
            )}
            {question.classification.topic && (
              <>
                <span className="text-xs text-slate-500 dark:text-slate-400">&middot;</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{question.classification.topic}</span>
              </>
            )}
          </div>
          <BookmarkButton
            isBookmarked={isBookmarked}
            onToggle={() => onToggleBookmark(question.id)}
          />
        </div>

        {question.images && question.images.length > 0 && (
          <div className="mb-4 space-y-2">
            {question.images.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt={img.caption}
                className="w-full rounded-xl object-contain max-h-[50vh]"
                loading="lazy"
              />
            ))}
          </div>
        )}

        <div className="mb-6">
          <p className="text-[16px] leading-relaxed text-slate-900 dark:text-white font-medium">
            {question.question.text}
          </p>
        </div>

        <div className="space-y-3 mb-6" role="radiogroup" aria-label="Answer options">
          {question.question.options.map((option) => (
            <OptionButton
              key={option.label}
              label={option.label}
              text={option.text}
              selected={selectedAnswer === option.label}
              revealed={revealed}
              isCorrect={option.label === question.answer.correctOption}
              isUserAnswer={option.label === selectedAnswer}
              disabled={revealed}
              onClick={() => !revealed && setSelectedAnswer(option.label)}
            />
          ))}
        </div>

        {!revealed && (
          <button
            onClick={handleCheck}
            disabled={!selectedAnswer}
            className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              selectedAnswer
                ? 'bg-blue-500 text-white hover:bg-blue-600 active:scale-[0.98]'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
            }`}
          >
            Check Answer
          </button>
        )}

        {revealed && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <AnswerResult
              isCorrect={isCorrect}
              selectedAnswer={selectedAnswer || ''}
              correctAnswer={question.answer.correctOption}
              selectedText={selectedOption?.text || ''}
              correctText={correctOption?.text || ''}
              answerStatus={question.answer.status}
            />

            <ExplanationSection
              explanation={question.answer.explanation}
              source={question.source}
            />

            <button
              onClick={onNext}
              className="w-full mt-4 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>Next Question</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
