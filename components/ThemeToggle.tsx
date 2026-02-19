
import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  toggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggle }) => {
  return (
    <button
      onClick={toggle}
      className="p-2 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 bg-white/10 backdrop-blur-md border border-white/20 dark:border-white/10"
      aria-label="Toggle dark mode"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-lifewood-serpent" />
      ) : (
        <Sun className="w-5 h-5 text-lifewood-yellow" />
      )}
    </button>
  );
};
