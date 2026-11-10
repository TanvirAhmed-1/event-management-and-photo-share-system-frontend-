"use client";

import React from "react";
import { Users, Calendar, Utensils, Wrench, Database } from "lucide-react";

interface AdminStatsProps {
  userCount: number;
  eventCount: number;
  serviceCount: number;
  foodCount: number;
  packageCount: number;
}

export default function AdminStats({
  userCount,
  eventCount,
  serviceCount,
  foodCount,
  packageCount,
}: AdminStatsProps) {
  const stats = [
    {
      label: "Registered Users",
      value: userCount,
      icon: Users,
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      label: "Platform Events",
      value: eventCount,
      icon: Calendar,
      color: "text-[#7C3AED] bg-purple-50 border-purple-200",
    },
    {
      label: "Active Services",
      value: serviceCount,
      icon: Wrench,
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
    {
      label: "Food & Catering Items",
      value: foodCount,
      icon: Utensils,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      label: "AI Storage Plans",
      value: packageCount,
      icon: Database,
      color: "text-indigo-600 bg-indigo-50 border-indigo-200",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((st, i) => {
        const Icon = st.icon;
        return (
          <div
            key={i}
            className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow"
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center border ${st.color} shrink-0`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-[#172554]">{st.value}</div>
              <div className="text-[11px] font-semibold text-slate-500 leading-tight">
                {st.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

