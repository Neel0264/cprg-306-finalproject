'use client';
import { useEffect, useState } from 'react';
import { getUserStats, getAchievements } from "@/utils/achievements";
import { UserStats, Achievement } from "@/types/achievements";

export default function StatsCard() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showAchievements, setShowAchievements] = useState(false);

  const loadStats = () => {
    setStats(getUserStats());
    setAchievements(getAchievements());
  };

  useEffect(() => {
    loadStats();
    window.addEventListener("stats-updated", loadStats);
    return () => window.removeEventListener("stats-updated", loadStats);
  }, []);

  if (!stats) return null;

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const progressToNextLevel = (stats.totalPoints % 100) / 100 * 100;

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Your Progress
        </h3>
        <button
          onClick={() => setShowAchievements(true)}
          className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 text-sm font-medium"
        >
          View Achievements ({unlockedAchievements.length}/{achievements.length})
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {stats.level}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Level</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.totalTasksCompleted}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Tasks Done</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {stats.currentStreak}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Day Streak</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.totalPoints}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Points</div>
        </div>
      </div>

      {/* Level Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>Level {stats.level}</span>
          <span>Level {stats.level + 1}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressToNextLevel}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
          {100 - (stats.totalPoints % 100)} points to next level
        </div>
      </div>

      {/* Recent Achievements */}
      {unlockedAchievements.length > 0 && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Latest:</span>
          {unlockedAchievements.slice(-3).map((achievement) => (
            <span
              key={achievement.id}
              className="text-lg"
              title={achievement.name}
            >
              {achievement.icon}
            </span>
          ))}
        </div>
      )}

      {/* Achievements Modal */}
      {showAchievements && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Achievements ({unlockedAchievements.length}/{achievements.length})
              </h2>
              <button
                onClick={() => setShowAchievements(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border transition-all ${
                    achievement.unlocked
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-700'
                      : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {achievement.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {achievement.description}
                      </p>
                      {!achievement.unlocked && (
                        <div className="mt-1">
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1">
                            <div
                              className="bg-blue-500 h-1 rounded-full"
                              style={{ width: `${(achievement.progress / achievement.requirement) * 100}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {achievement.progress}/{achievement.requirement}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}