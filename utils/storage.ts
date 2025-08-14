const TASK_KEY = "study_tasks";

export function getTasks(): string[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(TASK_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveTask(task: string) {
  const tasks = getTasks();
  tasks.push(task);
  localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
}

export function deleteTask(index: number) {
  const tasks = getTasks();
  tasks.splice(index, 1);
  localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
}

export function clearTasks() {
  localStorage.removeItem(TASK_KEY);
}
