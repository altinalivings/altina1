'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { PaginationState } from '@/types/crm'

export default function Pagination({
  pagination,
  onPageChange,
  onPageSizeChange,
}: {
  pagination: PaginationState
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
}) {
  const { page, pageSize, total } = pagination
  const totalPages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)

  return (
    <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
      <div className="flex items-center gap-4">
        <span className="text-sm text-altina-muted">
          {total > 0 ? `${start}-${end} of ${total}` : 'No results'}
        </span>
        {onPageSizeChange && (
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-lg border border-white/15 bg-transparent px-2 py-1 text-xs text-white outline-none"
          >
            {[10, 25, 50, 100].map((s) => (
              <option key={s} value={s} className="bg-[#1A1A1C]">
                {s} / page
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="rounded-lg p-1.5 text-altina-muted transition-colors hover:bg-white/5 hover:text-white disabled:opacity-30"
        >
          <ChevronLeft size={18} />
        </button>
        {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
          let pageNum: number
          if (totalPages <= 5) {
            pageNum = i + 1
          } else if (page <= 3) {
            pageNum = i + 1
          } else if (page >= totalPages - 2) {
            pageNum = totalPages - 4 + i
          } else {
            pageNum = page - 2 + i
          }
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`min-w-8 rounded-lg px-2 py-1 text-sm font-medium transition-colors ${
                pageNum === page
                  ? 'bg-altina-gold/20 text-altina-gold'
                  : 'text-altina-muted hover:bg-white/5 hover:text-white'
              }`}
            >
              {pageNum}
            </button>
          )
        })}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="rounded-lg p-1.5 text-altina-muted transition-colors hover:bg-white/5 hover:text-white disabled:opacity-30"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
