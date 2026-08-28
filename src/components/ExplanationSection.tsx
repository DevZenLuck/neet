import { ExternalLink } from 'lucide-react';
import type { QuestionSource } from '../types';

interface ExplanationSectionProps {
  explanation: string | null;
  source: QuestionSource;
}

function sourceTypeLabel(type: QuestionSource['type']): string {
  switch (type) {
    case 'official': return 'Official Source';
    case 'trusted': return 'Trusted Source';
    case 'recalled': return 'Recalled Question';
  }
}

export function ExplanationSection({ explanation, source }: ExplanationSectionProps) {
  return (
    <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
        Explanation
      </h4>

      {explanation ? (
        <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{explanation}</p>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400 italic">
          Official explanation not available.
        </p>
      )}

      <div className="mt-3 flex items-center gap-3">
        {source.url ? (
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            <span>{sourceTypeLabel(source.type)}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {sourceTypeLabel(source.type)}
          </span>
        )}

        {source.documentTitle && (
          <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-[200px]">
            {source.documentTitle}
          </span>
        )}
      </div>
    </div>
  );
}
