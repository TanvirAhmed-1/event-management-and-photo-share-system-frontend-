"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const DEFAULT_PAGE_SIZE = 20;

export function paginateItems<T>(
  items: T[],
  currentPage: number,
  pageSize: number = DEFAULT_PAGE_SIZE
): { paginatedItems: T[]; safePage: number; totalPages: number } {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    paginatedItems: items.slice(start, start + pageSize),
    safePage,
    totalPages,
  };
}

interface TablePaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
}

/**
 * Reusable shadcn-styled table pagination bar defaulting to 20 items per page.
 */
export default function TablePagination({
  currentPage,
  totalItems,
  pageSize = DEFAULT_PAGE_SIZE,
  onPageChange,
}: TablePaginationProps) {
  if (totalItems === 0) return null;

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startItem = (safePage - 1) * pageSize + 1;
  const endItem = Math.min(safePage * pageSize, totalItems);

  const getPageNumbers = (): (number | "ellipsis")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "ellipsis")[] = [1];
    if (safePage > 3) pages.push("ellipsis");
    const rangeStart = Math.max(2, safePage - 1);
    const rangeEnd = Math.min(totalPages - 1, safePage + 1);
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }
    if (safePage < totalPages - 2) pages.push("ellipsis");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
      <div>
        Showing{" "}
        <span className="font-semibold text-[#172554]">
          {startItem}–{endItem}
        </span>{" "}
        of <span className="font-semibold text-[#172554]">{totalItems}</span>{" "}
        {totalItems === 1 ? "entry" : "entries"}
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(safePage - 1)}
          disabled={safePage <= 1}
          className="inline-flex items-center gap-1 h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-[#172554] disabled:opacity-40 disabled:pointer-events-none font-medium transition"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Prev</span>
        </button>

        {getPageNumbers().map((p, idx) =>
          p === "ellipsis" ? (
            <span key={`e-${idx}`} className="px-1.5 text-slate-400 select-none">
              ...
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`h-8 min-w-8 px-2 rounded-lg text-xs font-semibold transition ${
                p === safePage
                  ? "bg-[#7C3AED] text-white shadow-xs"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-[#172554]"
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onPageChange(safePage + 1)}
          disabled={safePage >= totalPages}
          className="inline-flex items-center gap-1 h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-[#172554] disabled:opacity-40 disabled:pointer-events-none font-medium transition"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
