"use client";

import { createTask, editTask } from "@/app/_actions";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface TaskFormProps {
  task?: {
    id: string;
    title: string;
    priority: "low" | "medium" | "high";
    due_date: string | null;
  };
  onSuccess?: () => void;
  isEditing?: boolean;
}

export default function TaskForm({
  task,
  onSuccess,
  isEditing = false,
}: TaskFormProps) {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(task?.title || "");
  const [priority, setPriority] = useState<"low" | "medium" | "high">(
    task?.priority || "medium"
  );
  const [dueDate, setDueDate] = useState(task?.due_date || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    // Client-side validation
    if (!title.trim()) {
      setErrors({ title: "Title is required" });
      return;
    }
    if (title.trim().length < 3) {
      setErrors({ title: "Title must be at least 3 characters" });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("priority", priority);
    formData.append("due_date", dueDate);
    if (isEditing && task) {
      formData.append("id", task.id);
    }

    startTransition(async () => {
      try {
        const action = isEditing ? editTask : createTask;
        await action(formData);
        toast.success(
          isEditing ? "✨ Task updated!" : "🎉 Task created!"
        );
        setTitle("");
        setDueDate("");
        setPriority("medium");
        onSuccess?.();
      } catch (error: any) {
        toast.error(error.message || "Failed to save task");
      }
    });
  };

  const priorityOptions = [
    { value: "low", label: "Low Priority", icon: "📊", color: "blue" },
    { value: "medium", label: "Medium Priority", icon: "⚡", color: "amber" },
    { value: "high", label: "High Priority", icon: "🔥", color: "red" },
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            📝 Task Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a new task..."
            className={`w-full px-5 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition duration-200 placeholder-gray-400 font-medium ${
              errors.title
                ? "border-red-500 bg-red-50"
                : "border-gray-200 hover:border-gray-300 focus:border-purple-500"
            }`}
            disabled={isPending}
          />
          {errors.title && (
            <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
              ⚠️ {errors.title}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Priority Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              ⚡ Priority Level
            </label>
            <div className="space-y-2">
              {priorityOptions.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center p-3 rounded-xl cursor-pointer border-2 transition-all duration-200 ${
                    priority === opt.value
                      ? `border-${opt.color}-500 bg-${opt.color}-50`
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={opt.value}
                    checked={priority === opt.value}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-4 h-4 cursor-pointer"
                    disabled={isPending}
                  />
                  <span className="ml-3 text-lg">{opt.icon}</span>
                  <span className="ml-2 font-medium text-gray-700">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Due Date Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              📅 Due Date (optional)
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition duration-200 hover:border-gray-300 font-medium"
              disabled={isPending}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className={`w-full py-3 rounded-xl font-bold text-white text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl ${
            isPending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          }`}
        >
          {isPending
            ? "⏳ Saving..."
            : isEditing
              ? "✏️ Update Task"
              : "✨ Add Task"}
        </button>
      </div>
    </form>
  );
}
