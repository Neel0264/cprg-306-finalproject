'use client';

import { useEffect, useState } from 'react';

function applyTheme(theme: 'light' | 'dark') {
  const root = document.documentElement; // <html>
  root.classList.toggle('dark', theme === 'dark');
  localStorage.setItem('theme', theme);
}

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved ?? (prefersDark ? 'dark' : 'light');
    applyTheme(initial);
    setIsDark(initial === 'dark');
  }, []);

  const toggle = () => {
    const next = isDark ? 'light' : 'dark';
    applyTheme(next);
    setIsDark(!isDark);
  };

  return (
    <button
      onClick={toggle}
      className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
      aria-label="Toggle Light / Dark"
    >
      Toggle Light / Dark
    </button>
  );
}
