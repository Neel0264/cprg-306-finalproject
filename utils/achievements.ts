import { Task } from "@/types/task";
import { Achievement, UserStats } from "@/types/achievements";

const STATS_KEY = "study_stats";
const ACHIEVEMENTS_KEY = "study_achievements";

// Default achievements
const defaultAchievements: Achievement[] = [
  {
    id: "first_task",
    name: "Getting Started",
    description: "Complete your first task",
    icon: "🎯",
    unlocked: false,
    requirement: 1,
    progress: 0,
    category: "tasks"
  },
  {
    id: "task_warrior",
    name: "Task Warrior",
    description: "Complete 10 tasks",
    icon: "⚔️",
    unlocked: false,
    requirement: 10,
    progress: 0,
    category: "tasks"
  },
  {
    id: "task_master",
    name: "Task Master",
    description: "Complete 50 tasks",
    icon: "👑",
    unlocked: false,
    requirement: 50,
    progress: 0,
    category: "tasks"
  },
  {
    id: "streak_3",
    name: "On Fire",
    description: "Maintain a 3-day streak",
    icon: "🔥",
    unlocked: false,
    requirement: 3,
    progress: 0,
    category: "streak"
  },
  {
    id: "streak_7",
    name: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: "🏆",
    unlocked: false,
    requirement: 7,
    progress: 0,
    category: "streak"
  },
  {
    id: "streak_30",
    name: "Month Master",
    description: "Maintain a 30-day streak",
    icon: "💎",
    unlocked: false,
    requirement: 30,
    progress: 0,
    category: "streak"
  },
  {
    id: "early_bird",
    name: "Early Bird",
    description: "Complete a task before 8 AM",
    icon: "🌅",
    unlocked: false,
    requirement: 1,
    progress: 0,
    category: "special"
  },
  {
    id: "night_owl",
    name: "Night Owl",
    description: "Complete a task after 10 PM",
    icon: "🦉",
    unlocked: false,
    requirement: 1,
    progress: 0,
    category: "special"
  }
];

export function getUserStats(): UserStats {
  if (typeof window === "undefined") {
    return {
      totalTasksCompleted: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastCompletionDate: null,
      totalPoints: 0,
      level: 1,
      joinDate: new Date().toISOString()
    };
  }

  const saved = localStorage.getItem(STATS_KEY);
  if (saved) {
    return JSON.parse(saved);
  }

  const defaultStats: UserStats = {
    totalTasksCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastCompletionDate: null,
    totalPoints: 0,
    level: 1,
    joinDate: new Date().toISOString()
  };

  localStorage.setItem(STATS_KEY, JSON.stringify(defaultStats));
  return defaultStats;
}

export function getAchievements(): Achievement[] {
  if (typeof window === "undefined") return defaultAchievements;

  const saved = localStorage.getItem(ACHIEVEMENTS_KEY);
  if (saved) {
    return JSON.parse(saved);
  }

  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(defaultAchievements));
  return defaultAchievements;
}

export function updateStatsOnTaskComplete(): { newAchievements: Achievement[], stats: UserStats } {
  const stats = getUserStats();
  const achievements = getAchievements();
  const now = new Date();
  const today = now.toDateString();
  
  // Update basic stats
  stats.totalTasksCompleted += 1;
  stats.totalPoints += 10; // 10 points per task
  
  // Calculate streak
  const lastDate = stats.lastCompletionDate ? new Date(stats.lastCompletionDate).toDateString() : null;
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString();
  
  if (lastDate === today) {
    // Already completed a task today, don't update streak
  } else if (lastDate === yesterday) {
    // Continuing streak
    stats.currentStreak += 1;
  } else if (lastDate === null) {
    // First task ever
    stats.currentStreak = 1;
  } else {
    // Streak broken, start new
    stats.currentStreak = 1;
  }
  
  stats.lastCompletionDate = now.toISOString();
  stats.longestStreak = Math.max(stats.longestStreak, stats.currentStreak);
  
  // Calculate level (every 100 points = 1 level)
  stats.level = Math.floor(stats.totalPoints / 100) + 1;
  
  // Check for new achievements
  const newAchievements: Achievement[] = [];
  
  achievements.forEach(achievement => {
    if (achievement.unlocked) return;
    
    let shouldUnlock = false;
    
    switch (achievement.category) {
      case 'tasks':
        achievement.progress = stats.totalTasksCompleted;
        shouldUnlock = stats.totalTasksCompleted >= achievement.requirement;
        break;
        
      case 'streak':
        achievement.progress = stats.currentStreak;
        shouldUnlock = stats.currentStreak >= achievement.requirement;
        break;
        
      case 'special':
        const hour = now.getHours();
        if (achievement.id === 'early_bird' && hour < 8) {
          achievement.progress = 1;
          shouldUnlock = true;
        } else if (achievement.id === 'night_owl' && hour >= 22) {
          achievement.progress = 1;
          shouldUnlock = true;
        }
        break;
    }
    
    if (shouldUnlock) {
      achievement.unlocked = true;
      achievement.unlockedAt = now.toISOString();
      stats.totalPoints += 50; // Bonus points for achievements
      newAchievements.push({ ...achievement });
    }
  });
  
  // Recalculate level after achievement bonuses
  stats.level = Math.floor(stats.totalPoints / 100) + 1;
  
  // Save updated data
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  
  return { newAchievements, stats };
}