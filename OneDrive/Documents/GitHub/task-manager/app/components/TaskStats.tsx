"use client";

import { useState } from "react";

interface TaskStats {
  tasks: Array<{
    id: string;
    title: string;
    is_completed: boolean;
    priority: "low" | "medium" | "high";
    due_date: string | null;
  }>;
}

export default function TaskStats({ tasks }: TaskStats) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.is_completed).length;
  const pending = total - completed;
  const highPriority = tasks.filter(
    (t) => !t.is_completed && t.priority === "high"
  ).length;

  const stats = [
    {
      label: "Total Tasks",
      value: total,
      icon: "📊",
      gradient: "from-blue-600 to-cyan-600",
      bg: "from-blue-50 to-cyan-50",
    },
    {
      label: "Completed",
      value: completed,
      icon: "✅",
      gradient: "from-green-600 to-emerald-600",
      bg: "from-green-50 to-emerald-50",
    },
    {
      label: "Pending",
      value: pending,
      icon: "⏳",
      gradient: "from-yellow-600 to-orange-600",
      bg: "from-yellow-50 to-orange-50",
    },
    {
      label: "Urgent",
      value: highPriority,
      icon: "🔥",
      gradient: "from-red-600 to-pink-600",
      bg: "from-red-50 to-pink-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, idx) => (
        <div
          key={stat.label}
          className="group relative overflow-hidden rounded-2xl p-6 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg hover:shadow-gray-300/20 hover:-translate-y-1 cursor-default"
          style={{
            background: `linear-gradient(135deg, var(--color-from) 0%, var(--color-to) 100%)`,
            '--color-from': `rgb(${stat.gradient === 'from-blue-600 to-cyan-600' ? '37, 99, 235' : stat.gradient === 'from-green-600 to-emerald-600' ? '22, 163, 74' : stat.gradient === 'from-yellow-600 to-orange-600' ? '202, 138, 4' : '220, 38, 38'})`,
            '--color-to': `rgb(${stat.gradient === 'from-blue-600 to-cyan-600' ? '34, 211, 238' : stat.gradient === 'from-green-600 to-emerald-600' ? '16, 185, 129' : stat.gradient === 'from-yellow-600 to-orange-600' ? '234, 88, 12' : '236, 72, 153'})`,
          } as any}
        >
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent group-hover:from-white/20 transition-all duration-300"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{stat.icon}</span>
              <span className="text-2xl opacity-30">→</span>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1 text-gray-900">{stat.value}</div>
              <div className="text-sm font-medium text-gray-700">{stat.label}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
