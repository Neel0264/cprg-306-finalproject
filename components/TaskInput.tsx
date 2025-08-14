'use client';
import { useState } from "react";
import { saveTask } from "@/utils/storage";

export default function TaskInput() {
  const [task, setTask] = useState("");

  const handleAdd = () => {
    if (task.trim() !== "") {
      saveTask(task);
      setTask("");
      window.dispatchEvent(new Event("task-updated"));
    }
  };

  return (
    <div className="flex gap-2 mb-4">
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter your task"
        className="flex-1 p-2 border rounded"
      />
      <button onClick={handleAdd} className="bg-green-600 text-white px-4 py-2 rounded">
        Add
      </button>
    </div>
  );
}
