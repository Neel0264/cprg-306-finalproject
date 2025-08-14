'use client';
import { deleteTask } from "@/utils/storage";

interface Props {
  task: string;
  index: number;
}

export default function TaskItem({ task, index }: Props) {
  const handleDelete = () => {
    deleteTask(index);
    window.dispatchEvent(new Event("task-updated"));
  };

  return (
    <li className="bg-white border p-3 rounded flex justify-between items-center">
      <span>{task}</span>
      <button onClick={handleDelete} className="text-red-500 font-medium">
        Delete
      </button>
    </li>
  );
}
