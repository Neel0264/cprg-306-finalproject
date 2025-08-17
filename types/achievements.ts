export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  requirement: number;
  progress: number;
  category: 'tasks' | 'streak' | 'special';
}

export interface UserStats {
  totalTasksCompleted: number;
  currentStreak: number;
  longestStreak: number;
  lastCompletionDate: string | null;
  totalPoints: number;
  level: number;
  joinDate: string;
}