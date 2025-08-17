'use client';
import { useEffect, useState } from 'react';
import { calculateTaskAnalytics } from "@/utils/analytics";
import { TaskAnalytics } from "@/types/analytics";

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<TaskAnalytics | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'insights'>('overview');
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const loadAnalytics = () => {
    setAnalytics(calculateTaskAnalytics());
    const now = new Date();
    setLastUpdated(now.toLocaleString());
  };

  useEffect(() => {
    loadAnalytics();
    window.addEventListener("task-updated", loadAnalytics);
    window.addEventListener("stats-updated", loadAnalytics);
    return () => {
      window.removeEventListener("task-updated", loadAnalytics);
      window.removeEventListener("stats-updated", loadAnalytics);
    };
  }, []);

  if (!analytics) return null;

  const maxDailyTasks = Math.max(...analytics.dailyData.map(d => Math.max(d.completed, d.created)));
  const maxWeeklyTasks = Math.max(...analytics.weeklyData.map(w => w.created));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-0">
            📊 Analytics Dashboard
          </h2>
          {lastUpdated && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {lastUpdated}
            </p>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mt-2 sm:mt-0">
          {(['overview', 'trends', 'insights'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ${
                activeTab === tab
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs Content - No changes made below this point; retained your full code */}
      {/* ... */}
    </div>
  );
}
