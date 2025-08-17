'use client';
import { useEffect, useState } from 'react';
import { calculateTaskAnalytics } from "@/utils/analytics";
import { TaskAnalytics } from "@/types/analytics";

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<TaskAnalytics | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'insights'>('overview');

  const loadAnalytics = () => {
    setAnalytics(calculateTaskAnalytics());
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
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-0">
          📊 Analytics Dashboard
        </h2>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
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

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {analytics.completionRate.toFixed(1)}%
              </div>
              <div className="text-sm text-blue-800 dark:text-blue-300">Completion Rate</div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {analytics.totalTasks}
              </div>
              <div className="text-sm text-green-800 dark:text-green-300">Total Tasks</div>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {analytics.pendingTasks}
              </div>
              <div className="text-sm text-orange-800 dark:text-orange-300">Pending</div>
            </div>
            
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-700">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {analytics.overdueTasks}
              </div>
              <div className="text-sm text-red-800 dark:text-red-300">Overdue</div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Task Categories</h3>
            <div className="space-y-2">
              {Object.entries(analytics.categoryBreakdown).map(([category, count]) => {
                const colors = {
                  'Completed': 'bg-green-500',
                  'Due Soon': 'bg-yellow-500',
                  'Overdue': 'bg-red-500',
                  'No Due Date': 'bg-gray-500'
                };
                const percentage = analytics.totalTasks > 0 ? (count / analytics.totalTasks) * 100 : 0;
                
                return (
                  <div key={category} className="flex items-center space-x-3">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 dark:text-gray-300">{category}</span>
                        <span className="text-gray-500 dark:text-gray-400">{count} ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${colors[category as keyof typeof colors]}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'trends' && (
        <div className="space-y-6">
          {/* Daily Activity Chart */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Daily Activity (Last 30 Days)</h3>
            <div className="flex items-end space-x-1 h-32 bg-gray-50 dark:bg-gray-700 rounded-lg p-3 overflow-x-auto">
              {analytics.dailyData.map((day, index) => {
                const completedHeight = maxDailyTasks > 0 ? (day.completed / maxDailyTasks) * 100 : 0;
                const createdHeight = maxDailyTasks > 0 ? (day.created / maxDailyTasks) * 100 : 0;
                const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
                
                return (
                  <div key={day.date} className="flex flex-col items-center space-y-1 min-w-0 flex-1">
                    <div className="flex flex-col items-center space-y-0.5 h-20 justify-end">
                      {day.created > 0 && (
                        <div
                          className="w-3 bg-blue-400 dark:bg-blue-500 rounded-t"
                          style={{ height: `${createdHeight}%` }}
                          title={`Created: ${day.created}`}
                        ></div>
                      )}
                      {day.completed > 0 && (
                        <div
                          className="w-3 bg-green-500 dark:bg-green-400 rounded-b"
                          style={{ height: `${completedHeight}%` }}
                          title={`Completed: ${day.completed}`}
                        ></div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      {index % 5 === 0 ? dayName : ''}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center space-x-4 mt-2 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-400 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">Created</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">Completed</span>
              </div>
            </div>
          </div>

          {/* Weekly Productivity */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Weekly Productivity</h3>
            <div className="space-y-2">
              {analytics.weeklyData.map((week) => (
                <div key={week.week} className="flex items-center space-x-3">
                  <div className="w-16 text-sm text-gray-600 dark:text-gray-400">{week.week}</div>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4 relative">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full transition-all duration-300"
                      style={{ width: `${week.productivity}%` }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                      {week.productivity}%
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 w-16 text-right">
                    {week.completed}/{week.created}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
              <h3 className="font-medium text-purple-800 dark:text-purple-300 mb-2">📅 Most Productive Day</h3>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{analytics.mostProductiveDay}</p>
              <p className="text-sm text-purple-700 dark:text-purple-300">Based on completion rate</p>
            </div>
            
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-700">
              <h3 className="font-medium text-indigo-800 dark:text-indigo-300 mb-2">⏱️ Avg. Completion Time</h3>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {analytics.averageCompletionTime.toFixed(1)} days
              </p>
              <p className="text-sm text-indigo-700 dark:text-indigo-300">From creation to completion</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">📈 This Week's Progress</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tasks Created</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">{analytics.tasksCreatedThisWeek}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tasks Completed</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{analytics.tasksCompletedThisWeek}</p>
              </div>
            </div>
            
            {analytics.tasksCreatedThisWeek > 0 && (
              <div className="mt-3">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>Weekly Completion Rate</span>
                  <span>{((analytics.tasksCompletedThisWeek / analytics.tasksCreatedThisWeek) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(analytics.tasksCompletedThisWeek / analytics.tasksCreatedThisWeek) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Motivational Insights */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700">
            <h3 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">💡 Smart Insights</h3>
            <div className="space-y-2 text-sm">
              {analytics.completionRate > 80 && (
                <p className="text-yellow-700 dark:text-yellow-300">🌟 Excellent! You're completing over 80% of your tasks!</p>
              )}
              {analytics.overdueTasks > 0 && (
                <p className="text-yellow-700 dark:text-yellow-300">⚠️ You have {analytics.overdueTasks} overdue task(s). Consider setting earlier reminders.</p>
              )}
              {analytics.tasksCreatedThisWeek === 0 && (
                <p className="text-yellow-700 dark:text-yellow-300">📝 No tasks created this week. Time to plan your goals!</p>
              )}
              {analytics.completionRate < 50 && analytics.totalTasks > 5 && (
                <p className="text-yellow-700 dark:text-yellow-300">🎯 Focus on completing existing tasks before creating new ones.</p>
              )}
              {analytics.averageCompletionTime > 7 && (
                <p className="text-yellow-700 dark:text-yellow-300">⏰ Tasks are taking over a week to complete. Try breaking them into smaller parts.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}