'use client';

import ThemeToggle from './ThemeToggle';
import { clearTasks } from '@/utils/storage';

export default function SettingsPanel() {
  const handleClear = () => {
    if (confirm('Are you sure you want to delete all tasks?')) {
      clearTasks();
      window.dispatchEvent(new Event('task-updated'));
    }
  };

  return (
    <div className="space-y-6">
      {/* Theme */}
      <section className="rounded-lg border bg-white p-6 dark:bg-slate-800 dark:border-slate-700">
        <h2 className="text-lg font-semibold mb-3">Theme</h2>
        <ThemeToggle />
      </section>

      {/* Task settings */}
      <section className="rounded-lg border bg-white p-6 dark:bg-slate-800 dark:border-slate-700">
        <h2 className="text-lg font-semibold mb-3">Task Settings</h2>
        <button
          onClick={handleClear}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Clear All Tasks
        </button>
      </section>
    </div>
  );
}
