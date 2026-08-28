import { BarChart3, Bookmark, Target } from 'lucide-react';

interface StatsBarProps {
  stats: {
    total: number;
    attempted: number;
    correct: number;
    incorrect: number;
    bookmarked: number;
  };
  onBookmarkClick?: () => void;
}

export function StatsBar({ stats }: StatsBarProps) {
  const accuracy =
    stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-2">
      <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1">
          <Target className="w-3.5 h-3.5" />
          <span>
            {stats.correct}/{stats.attempted} correct
          </span>
        </div>
        <div className="flex items-center gap-1">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>{accuracy}% accuracy</span>
        </div>
        <div className="flex items-center gap-1">
          <Bookmark className="w-3.5 h-3.5" />
          <span>{stats.bookmarked} saved</span>
        </div>
        <div className="ml-auto text-slate-400 dark:text-slate-500">
          {stats.total} available
        </div>
      </div>
    </div>
  );
}
