'use client';
import { useEffect, useState } from "react";
import { getTasks } from "@/utils/storage";
import { Task } from "@/types/task";
import TaskItem from "./TaskItem";

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const loadTasks = () => {
    const loaded = getTasks();
    // Sort tasks: incomplete first, then by due date, then by creation date
    const sorted = loaded.sort((a, b) => {
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    setTasks(sorted);
  };

  useEffect(() => {
    loadTasks();
    window.addEventListener("task-updated", loadTasks);
    return () => window.removeEventListener("task-updated", loadTasks);
  }, []);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    active: tasks.filter(t => !t.completed).length
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">No tasks yet!</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Add your first study task above to get started.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Task Statistics */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
          {taskStats.total} Total
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          {taskStats.completed} Completed
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
          {taskStats.active} Active
        </span>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'active', 'completed'].map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              filter === filterType
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </button>
        ))}
      </div>

      {/* Task List */}
      <ul className="space-y-3">
        {filteredTasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>

      {filteredTasks.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No {filter} tasks found.</p>
        </div>
      )}
    </div>
  );
}