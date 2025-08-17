'use client';
import { useState } from 'react';
import Header from "@/components/Header";
import ThemeToggle from "@/components/ThemeToggle";
import { clearTasks } from "@/utils/storage";

export default function SettingsPage() {
  const [showQuotes, setShowQuotes] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('showQuotes') !== 'false';
    }
    return true;
  });

  const handleToggleQuotes = () => {
    const newValue = !showQuotes;
    setShowQuotes(newValue);
    localStorage.setItem('showQuotes', newValue.toString());
    window.dispatchEvent(new Event('quotes-setting-changed'));
  };

  const handleClearAllTasks = () => {
    if (confirm("Are you sure you want to delete all tasks? This action cannot be undone.")) {
      clearTasks();
      window.dispatchEvent(new Event("task-updated"));
      alert("All tasks have been cleared!");
    }
  };

  const handleExportTasks = () => {
    const tasks = localStorage.getItem('study_tasks');
    if (!tasks) {
      alert('No tasks to export!');
      return;
    }

    const blob = new Blob([tasks], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studybuddy-tasks-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportTasks = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const tasks = JSON.parse(content);
        
        // Validate the imported data
        if (Array.isArray(tasks)) {
          localStorage.setItem('study_tasks', JSON.stringify(tasks));
          window.dispatchEvent(new Event("task-updated"));
          alert(`Successfully imported ${tasks.length} tasks!`);
        } else {
          alert('Invalid file format. Please select a valid StudyBuddy export file.');
        }
      } catch (error) {
        alert('Error reading file. Please make sure it\'s a valid StudyBuddy export file.');
      }
    };
    reader.readAsText(file);
    
    // Reset the input
    event.target.value = '';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />
      
      <main className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Settings</h1>

        <div className="space-y-6">
          {/* Theme Settings */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Theme Preferences
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 dark:text-gray-300 font-medium">Dark Mode</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Toggle between light and dark themes
                </p>
              </div>
              <ThemeToggle />
            </div>
          </div>

          {/* Quote Settings */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Motivational Quotes
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 dark:text-gray-300 font-medium">Show Daily Quotes</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Display inspirational quotes on the home page
                </p>
              </div>
              <button
                onClick={handleToggleQuotes}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${showQuotes ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}
                `}
                role="switch"
                aria-checked={showQuotes}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ease-in-out
                    ${showQuotes ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>
          </div>

          {/* Task Management */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Task Management
            </h2>
            <div className="space-y-4">
              <div>
                <button
                  onClick={handleExportTasks}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Export Tasks
                </button>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Download your tasks as a backup file
                </p>
              </div>

              <div>
                <label className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 cursor-pointer inline-block text-center">
                  Import Tasks
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportTasks}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Restore tasks from a backup file
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={handleClearAllTasks}
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Clear All Tasks
                </button>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Permanently delete all your tasks
                </p>
              </div>
            </div>
          </div>

          {/* App Information */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              About StudyBuddy
            </h2>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p><strong>Version:</strong> 1.0.0</p>
              <p><strong>Developers:</strong> Neel Moradiya & Rishi Chaudhari</p>
              <p><strong>Description:</strong> A collaborative study planner to help students organize their tasks and stay motivated.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}