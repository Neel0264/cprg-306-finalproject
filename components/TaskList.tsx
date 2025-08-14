'use client';
import { useEffect, useState } from "react";
import { getTasks } from "@/utils/storage";
import TaskItem from "./TaskItem";

export default function TaskList() {
  const [tasks, setTasks] = useState<string[]>([]);

  const loadTasks = () => {
    const loaded = getTasks();
    setTasks(loaded);
  };

  useEffect(() => {
    loadTasks();
    window.addEventListener("task-updated", loadTasks);
    return () => window.removeEventListener("task-updated", loadTasks);
  }, []);

  return (
    <ul className="space-y-2">
      {tasks.map((task, index) => (
        <TaskItem key={index} task={task} index={index} />
      ))}
    </ul>
  );
}
