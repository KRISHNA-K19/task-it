"use client";

import { useState } from "react";
import TaskForm from "./TaskForm";
import TaskCard from "./TaskCard";
import TaskStats from "./TaskStats";

interface Task {
  id: string;
  title: string;
  is_completed: boolean;
  priority: "low" | "medium" | "high";
  due_date: string | null;
  created_at: string;
}

interface DashboardClientProps {
  initialTasks: Task[];
}

export default function DashboardClient({ initialTasks }: DashboardClientProps) {
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [priorityFilter, setPriorityFilter] = useState<
    "all" | "low" | "medium" | "high"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Filter tasks based on criteria
  const filteredTasks = initialTasks.filter((task) => {
    // Filter by completion status
    if (filter === "active" && task.is_completed) return false;
    if (filter === "completed" && !task.is_completed) return false;

    // Filter by priority
    if (priorityFilter !== "all" && task.priority !== priorityFilter)
      return false;

    // Filter by search query
    if (
      searchQuery &&
      !task.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;

    return true;
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
<h1 className="text-5xl font-bold text-gray-900 mb-3 flex items-center gap-3">
            <span className="text-5xl">✨</span>
            Task-it
          </h1>
          <p className="text-xl text-gray-600 font-medium">Organize, prioritize, accomplish</p>
        </div>

        {/* Task Form / Edit Modal */}
        {isEditModalOpen && editingTask ? (
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur-2xl"></div>
            <div className="relative bg-gradient-to-br from-white to-gray-50 p-8 rounded-3xl border border-gray-200 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Task</h2>
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingTask(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 text-3xl font-bold transition-colors"
                >
                  ✕
                </button>
              </div>
              <TaskForm
                task={editingTask}
                isEditing={true}
                onSuccess={() => {
                  setIsEditModalOpen(false);
                  setEditingTask(null);
                }}
              />
            </div>
          </div>
        ) : (
          <TaskForm />
        )}

        {/* Stats */}
        <TaskStats tasks={initialTasks} />

        {/* Filters Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 mb-8 space-y-4 hover:shadow-md transition-shadow duration-300">
          {/* Search */}
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-xl">🔍</span>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 pl-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition duration-200 placeholder-gray-400 font-medium"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="flex gap-2 flex-wrap">
              {[
                { label: "All Tasks", value: "all", icon: "📊" },
                { label: "Active", value: "active", icon: "⚡" },
                { label: "Completed", value: "completed", icon: "✅" },
              ].map((btn) => (
                <button
                  key={btn.value}
                  onClick={() => setFilter(btn.value as any)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                    filter === btn.value
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {btn.icon} {btn.label}
                </button>
              ))}
            </div>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(
                  e.target.value as "all" | "low" | "medium" | "high"
                )
              }
              className="px-5 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition duration-200 font-bold text-gray-700 hover:border-gray-300 cursor-pointer"
            >
              <option value="all">🎯 All Priorities</option>
              <option value="high">🔥 High Priority</option>
              <option value="medium">⚡ Medium Priority</option>
              <option value="low">📊 Low Priority</option>
            </select>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="text-6xl mb-4">🎉</div>
              <p className="text-gray-500 text-xl font-semibold">No tasks found</p>
              <p className="text-gray-400 text-base mt-2">
                {searchQuery
                  ? "Try adjusting your search or filters"
                  : filter === "completed"
                    ? "You haven't completed any tasks yet"
                    : "Great job! Create your first task to get started"}
              </p>
            </div>
          ) : (
            <>
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                {filteredTasks.length} {filteredTasks.length === 1 ? "Task" : "Tasks"}
              </div>
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  {...task}
                  onEdit={(task) => {
                    setEditingTask(task);
                    setIsEditModalOpen(true);
                  }}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
