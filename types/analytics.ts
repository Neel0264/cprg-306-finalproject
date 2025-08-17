export interface DayData {
  date: string;
  completed: number;
  created: number;
  overdue: number;
}

export interface WeekData {
  week: string;
  completed: number;
  created: number;
  productivity: number; // percentage
}

export interface TaskAnalytics {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  completionRate: number;
  averageCompletionTime: number; // in days
  tasksCreatedThisWeek: number;
  tasksCompletedThisWeek: number;
  mostProductiveDay: string;
  dailyData: DayData[];
  weeklyData: WeekData[];
  categoryBreakdown: { [key: string]: number };
}