import { useState, useEffect } from 'react';
import { loadTheme, saveTheme } from '../utils/storage';

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => loadTheme());

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    saveTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
}
