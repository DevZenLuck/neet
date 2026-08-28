interface OptionButtonProps {
  label: string;
  text: string;
  selected: boolean;
  revealed: boolean;
  isCorrect: boolean;
  isUserAnswer: boolean;
  disabled: boolean;
  onClick: () => void;
}

export function OptionButton({
  label,
  text,
  selected,
  revealed,
  isCorrect,
  isUserAnswer,
  disabled,
  onClick,
}: OptionButtonProps) {
  let baseClasses =
    'w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-start gap-3 min-h-[56px]';

  if (revealed) {
    if (isCorrect) {
      baseClasses += ' border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30';
    } else if (isUserAnswer && !isCorrect) {
      baseClasses += ' border-red-500 bg-red-50 dark:bg-red-900/30';
    } else {
      baseClasses += ' border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 opacity-50';
    }
  } else if (selected) {
    baseClasses += ' border-blue-500 bg-blue-50 dark:bg-blue-900/30';
  } else {
    baseClasses +=
      ' border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-600';
  }

  if (!disabled && !revealed) {
    baseClasses += ' cursor-pointer active:scale-[0.98]';
  }

  const labelClasses = revealed
    ? isCorrect
      ? 'flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold'
      : isUserAnswer && !isCorrect
        ? 'flex-shrink-0 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold'
        : 'flex-shrink-0 w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-600 text-white flex items-center justify-center text-sm font-bold'
    : selected
      ? 'flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold'
      : 'flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center text-sm font-bold';

  return (
    <button
      className={baseClasses}
      onClick={onClick}
      disabled={disabled}
      role="radio"
      aria-checked={selected}
      aria-label={`Option ${label}: ${text}`}
    >
      <span className={labelClasses}>{label}</span>
      <span className="text-slate-800 dark:text-slate-100 text-[15px] leading-relaxed pt-0.5">
        {text}
      </span>
    </button>
  );
}
