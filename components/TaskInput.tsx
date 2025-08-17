'use client';
import { useState } from "react";
import { saveTask } from "@/utils/storage";

export default function TaskInput() {
  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleAdd = () => {
    if (task.trim() !== "") {
      saveTask(task, dueDate || undefined);
      setTask("");
      setDueDate("");
      window.dispatchEvent(new Event("task-updated"));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAdd();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter your study task..."
          className="flex-1 p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          required
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none sm:w-40"
          min={new Date().toISOString().split('T')[0]}
        />
        <button 
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 sm:w-auto w-full"
        >
          Add Task
        </button>
      </div>
    </form>
  );
}