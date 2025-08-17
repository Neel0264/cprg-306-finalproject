import { Task } from "@/types/task";

const TASK_KEY = "study_tasks";

export function getTasks(): Task[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(TASK_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveTask(text: string, dueDate?: string) {
  const tasks = getTasks();
  const newTask: Task = {
    id: Date.now().toString(),
    text,
    completed: false,
    dueDate,
    createdAt: new Date().toISOString()
  };
  tasks.push(newTask);
  localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
}

export function updateTask(id: string, updates: Partial<Task>) {
  const tasks = getTasks();
  const index = tasks.findIndex(task => task.id === id);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...updates };
    localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
  }
}

export function deleteTask(id: string) {
  const tasks = getTasks();
  const filteredTasks = tasks.filter(task => task.id !== id);
  localStorage.setItem(TASK_KEY, JSON.stringify(filteredTasks));
}

export function clearTasks() {
  localStorage.removeItem(TASK_KEY);
}