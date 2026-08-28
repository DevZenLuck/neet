import { Check, X, AlertTriangle } from 'lucide-react';

interface AnswerResultProps {
  isCorrect: boolean;
  selectedAnswer: string;
  correctAnswer: string;
  selectedText: string;
  correctText: string;
  answerStatus: 'confirmed' | 'disputed' | 'uncertain';
}

export function AnswerResult({
  isCorrect,
  selectedAnswer,
  correctAnswer,
  selectedText,
  correctText,
  answerStatus,
}: AnswerResultProps) {
  return (
    <div className="mt-4 space-y-3">
      {isCorrect ? (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
          <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span className="text-emerald-700 dark:text-emerald-300 font-semibold text-sm">
            Correct!
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <X className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
          <span className="text-red-700 dark:text-red-300 font-semibold text-sm">Incorrect</span>
        </div>
      )}

      {answerStatus !== 'confirmed' && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <span className="text-amber-700 dark:text-amber-300 text-xs font-medium">
            Answer status: {answerStatus.charAt(0).toUpperCase() + answerStatus.slice(1)}
          </span>
        </div>
      )}

      {!isCorrect && (
        <div className="text-sm">
          <span className="text-slate-500 dark:text-slate-400">Your answer: </span>
          <span className="text-red-600 dark:text-red-400 font-medium">
            {selectedAnswer}. {selectedText}
          </span>
        </div>
      )}

      <div className="text-sm">
        <span className="text-slate-500 dark:text-slate-400">Correct answer: </span>
        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
          {correctAnswer}. {correctText}
        </span>
      </div>
    </div>
  );
}
