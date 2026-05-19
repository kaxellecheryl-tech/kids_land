"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  total: number;
  page: number;
  perPage: number;
  onPageChange: (page: number) => void;
};

function getPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "…")[] = [1];
  if (current > 3) pages.push("…");
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}

export function TablePagination({ total, page, perPage, onPageChange }: Props) {
  const totalPages = Math.ceil(total / perPage);
  const from = Math.min((page - 1) * perPage + 1, total);
  const to = Math.min(page * perPage, total);

  if (totalPages <= 1) return null;

  const pages = getPageNumbers(page, totalPages);

  return (
    <div className="flex items-center justify-between px-6 py-3.5 border-t border-gray-100 bg-gray-50/30">
      <span className="text-[12px] text-gray-400 font-medium">
        {from}–{to} sur {total}
      </span>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-white hover:border hover:border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft size={15} />
        </button>

        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-[12px] text-gray-300">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-lg text-[12px] font-semibold transition-all ${
                p === page
                  ? "bg-black text-white shadow-sm"
                  : "text-gray-600 hover:bg-white hover:border hover:border-gray-200"
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-white hover:border hover:border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
