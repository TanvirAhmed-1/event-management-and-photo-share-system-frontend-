"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 bg-white rounded-2xl select-none", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "space-y-3",
        month_caption: "flex justify-center pt-1 relative items-center h-8",
        caption_label: "text-xs font-extrabold text-[#172554] tracking-tight",
        nav: "flex items-center gap-1",
        button_previous:
          "absolute left-1 top-1 h-7 w-7 bg-slate-50 hover:bg-purple-50 text-slate-600 hover:text-[#7C3AED] border border-slate-200/80 rounded-lg inline-flex items-center justify-center transition-colors cursor-pointer",
        button_next:
          "absolute right-1 top-1 h-7 w-7 bg-slate-50 hover:bg-purple-50 text-slate-600 hover:text-[#7C3AED] border border-slate-200/80 rounded-lg inline-flex items-center justify-center transition-colors cursor-pointer",
        month_grid: "w-full border-collapse",
        weekdays: "flex justify-between mb-1",
        weekday:
          "text-slate-400 rounded-md w-9 font-bold text-[10px] uppercase tracking-wider text-center",
        week: "flex w-full justify-between mt-1",
        day: "relative p-0 text-center text-xs focus-within:relative focus-within:z-20",
        day_button:
          "h-9 w-9 p-0 font-semibold rounded-xl inline-flex items-center justify-center hover:bg-purple-50 hover:text-[#7C3AED] transition-all cursor-pointer aria-selected:opacity-100",
        selected:
          "!bg-[#7C3AED] !text-white hover:!bg-[#6D28D9] hover:!text-white font-extrabold shadow-sm shadow-[#7C3AED]/30 rounded-xl",
        today: "bg-amber-50 text-amber-800 font-extrabold border border-amber-200 rounded-xl",
        outside: "text-slate-300 opacity-50",
        disabled:
          "text-slate-300 opacity-40 cursor-not-allowed hover:bg-transparent hover:text-slate-300 line-through",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
