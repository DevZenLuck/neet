import { useState } from 'react';
import { Bookmark } from 'lucide-react';

interface BookmarkButtonProps {
  isBookmarked: boolean;
  onToggle: () => void;
}

export function BookmarkButton({ isBookmarked, onToggle }: BookmarkButtonProps) {
  const [animating, setAnimating] = useState(false);

  const handleClick = () => {
    setAnimating(true);
    onToggle();
    setTimeout(() => setAnimating(false), 300);
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-lg transition-all duration-200 ${
        isBookmarked
          ? 'text-amber-500'
          : 'text-slate-400 dark:text-slate-500 hover:text-amber-400'
      } ${animating ? 'scale-125' : 'scale-100'}`}
      aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      <Bookmark className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} />
    </button>
  );
}
