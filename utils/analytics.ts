import { Task } from "@/types/task";
import { getTasks } from "@/utils/storage";
import { TaskAnalytics, DayData, WeekData } from "@/types/analytics";

export function calculateTaskAnalytics(): TaskAnalytics {
  const tasks = getTasks();
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Basic stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.filter(t => !t.completed).length;
  const overdueTasks = tasks.filter(t => 
    !t.completed && 
    t.dueDate && 
    new Date(t.dueDate) < now
  ).length;

  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Average completion time
  const completedTasksWithDuration = tasks.filter(t => t.completed).map(t => {
    const created = new Date(t.createdAt);
    const completed = new Date(); // Simplified - in real app, you'd track completion date
    return Math.max(1, Math.ceil((completed.getTime() - created.getTime()) / (24 * 60 * 60 * 1000)));
  });
  
  const averageCompletionTime = completedTasksWithDuration.length > 0
    ? completedTasksWithDuration.reduce((a, b) => a + b, 0) / completedTasksWithDuration.length
    : 0;

  // Weekly stats
  const tasksCreatedThisWeek = tasks.filter(t => 
    new Date(t.createdAt) >= sevenDaysAgo
  ).length;
  
  const tasksCompletedThisWeek = tasks.filter(t => 
    t.completed && new Date(t.createdAt) >= sevenDaysAgo
  ).length;

  // Daily data for last 30 days
  const dailyData: DayData[] = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    
    const tasksCreated = tasks.filter(t => 
      t.createdAt.split('T')[0] === dateStr
    ).length;
    
    const tasksCompleted = tasks.filter(t => 
      t.completed && t.createdAt.split('T')[0] === dateStr
    ).length;
    
    const tasksOverdue = tasks.filter(t => 
      !t.completed && 
      t.dueDate && 
      t.dueDate.split('T')[0] === dateStr &&
      new Date(t.dueDate) < now
    ).length;

    dailyData.push({
      date: dateStr,
      completed: tasksCompleted,
      created: tasksCreated,
      overdue: tasksOverdue
    });
  }

  // Weekly data for last 8 weeks
  const weeklyData: WeekData[] = [];
  for (let i = 7; i >= 0; i--) {
    const weekStart = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
    const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
    
    const weekTasks = tasks.filter(t => {
      const taskDate = new Date(t.createdAt);
      return taskDate >= weekStart && taskDate <= weekEnd;
    });
    
    const weekCompleted = weekTasks.filter(t => t.completed).length;
    const weekCreated = weekTasks.length;
    const productivity = weekCreated > 0 ? (weekCompleted / weekCreated) * 100 : 0;
    
    weeklyData.push({
      week: `Week ${8 - i}`,
      completed: weekCompleted,
      created: weekCreated,
      productivity: Math.round(productivity)
    });
  }

  // Most productive day
  const dayProductivity = dailyData.reduce((acc, day) => {
    const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' });
    if (!acc[dayName]) acc[dayName] = { completed: 0, created: 0 };
    acc[dayName].completed += day.completed;
    acc[dayName].created += day.created;
    return acc;
  }, {} as { [key: string]: { completed: number; created: number } });

  const mostProductiveDay = Object.entries(dayProductivity).reduce((best, [day, stats]) => {
    const productivity = stats.created > 0 ? stats.completed / stats.created : 0;
    const bestProductivity = dayProductivity[best] ? 
      dayProductivity[best].completed / Math.max(dayProductivity[best].created, 1) : 0;
    return productivity > bestProductivity ? day : best;
  }, 'Monday');

  // Category breakdown (simplified - by due date urgency)
  const categoryBreakdown = {
    'Completed': completedTasks,
    'Due Soon': tasks.filter(t => !t.completed && t.dueDate && 
      new Date(t.dueDate).getTime() - now.getTime() < 2 * 24 * 60 * 60 * 1000 &&
      new Date(t.dueDate) > now
    ).length,
    'Overdue': overdueTasks,
    'No Due Date': tasks.filter(t => !t.completed && !t.dueDate).length
  };

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    overdueTasks,
    completionRate,
    averageCompletionTime,
    tasksCreatedThisWeek,
    tasksCompletedThisWeek,
    mostProductiveDay,
    dailyData,
    weeklyData,
    categoryBreakdown
  };
}