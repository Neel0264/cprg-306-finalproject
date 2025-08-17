'use client';
import { useState } from 'react';
import { updateTask, deleteTask } from "@/utils/storage";
import { updateStatsOnTaskComplete } from "@/utils/achievements";
import { Task } from "@/types/task";
import { Achievement } from "@/types/achievements";
import AchievementModal from "./AchievementModal";

interface Props {
  task: Task;
}

export default function TaskItem({ task }: Props) {
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);

  const handleToggleComplete = () => {
    const wasCompleted = task.completed;
    updateTask(task.id, { completed: !task.completed });
    
    // If task was just completed (not uncompleted), check for achievements
    if (!wasCompleted && !task.completed) {
      const result = updateStatsOnTaskComplete();
      if (result.newAchievements.length > 0) {
        setNewAchievements(result.newAchievements);
      }
      window.dispatchEvent(new Event("stats-updated"));
    }
    
    window.dispatchEvent(new Event("task-updated"));
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTask(task.id);
      window.dispatchEvent(new Event("task-updated"));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
  const isDueSoon = task.dueDate && new Date(task.dueDate).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000 && !task.completed;

  return (
    <>
      <li className={`bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm transition-all duration-200 ${
        task.completed ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600' : 'border-gray-300 dark:border-gray-600 hover:shadow-md'
      } ${isOverdue ? 'border-red-300 bg-red-50 dark:bg-red-900/20' : ''} ${isDueSoon ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20' : ''}`}>
        <div className="flex items-start gap-3">
          <button
            onClick={handleToggleComplete}
            className="mt-1 relative"
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => {}} // Handled by button click
              className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
              readOnly
            />
            {task.completed && (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <p className={`text-gray-900 dark:text-white transition-all duration-200 ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
              {task.text}
            </p>
            
            {task.dueDate && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">Due:</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  isOverdue 
                    ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' 
                    : isDueSoon 
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {formatDate(task.dueDate)}
                </span>
              </div>
            )}
            
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Created {formatDate(task.createdAt)}
            </p>
          </div>
          
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium text-sm transition-colors duration-200 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 rounded"
          >
            Delete
          </button>
        </div>
      </li>

      {/* Achievement Modal */}
      <AchievementModal
        achievements={newAchievements}
        onClose={() => setNewAchievements([])}
      />
    </>
  );
}