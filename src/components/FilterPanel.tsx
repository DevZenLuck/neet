import { X, RotateCcw } from 'lucide-react';
import type { Filters, Question } from '../types';
import {
  getUniqueExams,
  getUniqueYears,
  getUniqueSubjects,
  getUniqueTopics,
} from '../utils/filters';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onClear: () => void;
  allQuestions: Question[];
}

export function FilterPanel({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onClear,
  allQuestions,
}: FilterPanelProps) {
  const exams = getUniqueExams(allQuestions);
  const years = getUniqueYears(allQuestions, filters.exam !== 'all' ? filters.exam : undefined);
  const subjects = getUniqueSubjects(allQuestions);
  const topics = getUniqueTopics(allQuestions, filters.subject !== 'all' ? filters.subject : undefined);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-2xl max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-slate-900 p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Filter Questions</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <FilterSelect
            label="Examination"
            value={filters.exam}
            options={exams}
            allLabel="All Exams"
            onChange={(v) => onFiltersChange({ ...filters, exam: v, year: 'all' })}
          />

          <FilterSelect
            label="Year"
            value={filters.year}
            options={years.map(String)}
            allLabel="All Years"
            onChange={(v) => onFiltersChange({ ...filters, year: v === 'all' ? 'all' : Number(v) })}
          />

          <FilterSelect
            label="Subject"
            value={filters.subject}
            options={subjects}
            allLabel="All Subjects"
            onChange={(v) => onFiltersChange({ ...filters, subject: v, topic: 'all', subtopic: 'all' })}
          />

          <FilterSelect
            label="Topic"
            value={filters.topic}
            options={topics}
            allLabel="All Topics"
            onChange={(v) => onFiltersChange({ ...filters, topic: v })}
          />

          <FilterSelect
            label="Source"
            value={filters.source}
            options={['official', 'trusted', 'recalled']}
            allLabel="All Sources"
            onChange={(v) => onFiltersChange({ ...filters, source: v as Filters['source'] })}
            displayMap={{ official: 'Official', trusted: 'Trusted', recalled: 'Recalled' }}
          />

          <FilterSelect
            label="Status"
            value={filters.status}
            options={['unattempted', 'correct', 'incorrect', 'bookmarked']}
            allLabel="All"
            onChange={(v) => onFiltersChange({ ...filters, status: v as Filters['status'] })}
            displayMap={{ unattempted: 'Unattempted', correct: 'Correct', incorrect: 'Incorrect', bookmarked: 'Bookmarked' }}
          />
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-slate-900 p-4 border-t border-slate-200 dark:border-slate-700 flex gap-3">
          <button
            onClick={onClear}
            className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Clear Filters
          </button>
          <button
            onClick={onClose}
            className="flex-1 p-3 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  allLabel,
  onChange,
  displayMap,
}: {
  label: string;
  value: string | number;
  options: (string | number)[];
  allLabel: string;
  onChange: (v: string) => void;
  displayMap?: Record<string, string>;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
      >
        <option value="all">{allLabel}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {displayMap?.[String(o)] || String(o)}
          </option>
        ))}
      </select>
    </div>
  );
}
