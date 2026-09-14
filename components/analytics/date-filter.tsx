"use client";

import { Calendar } from "lucide-react";
import { useState } from "react";

export function DateFilter() {
  const [selected, setSelected] = useState("30d");

  const ranges = [
    { id: "today", label: "Today" },
    { id: "yesterday", label: "Yesterday" },
    { id: "7d", label: "Last 7 days" },
    { id: "30d", label: "Last 30 days" },
    { id: "90d", label: "Last 90 days" },
    { id: "custom", label: "Custom" },
  ];

  return (
    <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm overflow-x-auto">
      {ranges.map((range) => (
        <button
          key={range.id}
          onClick={() => setSelected(range.id)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
            selected === range.id
              ? "bg-slate-100 text-slate-900"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          {range.id === "custom" && <Calendar className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />}
          {range.label}
        </button>
      ))}
    </div>
  );
}
