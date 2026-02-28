"use client";

import { deleteTask, toggleTask } from "@/app/_actions";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface TaskCardProps {
  id: string;
  title: string;
  is_completed: boolean;
  priority: "low" | "medium" | "high";
  due_date: string | null;
  onEdit?: (task: any) => void;
}

const priorityConfig = {
  low: {
    color: "blue",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    label: "Low",
    icon: "📊",
  },
  medium: {
    color: "amber",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-700",
    label: "Medium",
    icon: "⚡",
  },
  high: {
    color: "red",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-700",
    label: "High",
    icon: "🔥",
  },
};

export default function TaskCard({
  id,
  title,
  is_completed,
  priority,
  due_date,
  onEdit,
}: TaskCardProps) {
  const [isPending, startTransition] = useTransition();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isOverdue =
    due_date && new Date(due_date) < new Date() && !is_completed;

  const config = priorityConfig[priority];

  const handleToggle = () => {
    startTransition(async () => {
      try {
        await toggleTask(id);
        toast.success(is_completed ? "Marked as pending" : "✅ Task completed!");
      } catch (error: any) {
        toast.error(error.message || "Failed to toggle task");
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteTask(id);
        toast.success("🗑️ Task deleted");
      } catch (error: any) {
        toast.error(error.message || "Failed to delete task");
      }
    });
  };

  return (
    <div
      className={`group relative rounded-2xl border-2 transition-all duration-300 transform hover:scale-102 ${
        is_completed
          ? "border-gray-200 bg-gray-50 hover:border-gray-300"
          : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-lg hover:shadow-purple-200/20 hover:-translate-y-1"
      }`}
    >
      <div className="flex items-start gap-4 p-5">
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          disabled={isPending}
          className={`flex-shrink-0 mt-1 w-6 h-6 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
            is_completed
              ? "bg-green-500 border-green-500 text-white"
              : "border-gray-300 hover:border-green-500 hover:bg-green-50"
          }`}
        >
          {is_completed && <span className="text-sm font-bold">✓</span>}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold text-lg transition-all duration-200 ${
              is_completed
                ? "text-gray-400 line-through"
                : "text-gray-900 group-hover:text-purple-600"
            }`}
          >
            {title}
          </h3>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-3 mt-3">
            {/* Priority Badge */}
            <span
              className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-lg transition-colors duration-200 ${config.bgColor} ${config.textColor}`}
            >
              <span>{config.icon}</span>
              {config.label}
            </span>

            {/* Due Date */}
            {due_date && (
              <span
                className={`text-xs font-medium flex items-center gap-1 ${
                  isOverdue
                    ? "text-red-600 bg-red-50 px-3 py-1 rounded-lg font-bold"
                    : "text-gray-500"
                }`}
              >
                📅 {new Date(due_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
                {isOverdue && " (Overdue)"}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {!is_completed && (
            <button
              onClick={() =>
                onEdit?.({
                  id,
                  title,
                  priority,
                  due_date,
                })
              }
              className="px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-sm transition-all duration-200 hover:shadow-md active:scale-95"
              disabled={isPending}
              title="Edit task"
            >
              ✏️ Edit
            </button>
          )}
          {showDeleteConfirm ? (
            <div className="flex gap-1">
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-all duration-200 active:scale-95"
              >
                Yes
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isPending}
                className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-sm transition-all duration-200"
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-sm transition-all duration-200 hover:shadow-md active:scale-95"
              disabled={isPending}
              title="Delete task"
            >
              🗑️ Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
