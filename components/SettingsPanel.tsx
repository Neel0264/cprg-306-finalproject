'use client';
import { clearTasks } from "@/utils/storage";

export default function SettingsPanel() {
  const handleClear = () => {
    if (confirm("Are you sure you want to delete all tasks?")) {
      clearTasks();
      window.dispatchEvent(new Event("task-updated"));
    }
  };

  return (
    <div className="bg-white p-4 border rounded">
      <h3 className="text-lg font-semibold mb-2">Options</h3>
      <button onClick={handleClear} className="bg-red-600 text-white px-4 py-2 rounded">
        Clear All Tasks
      </button>
    </div>
  );
}
