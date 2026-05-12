import { ChevronLeft, ChevronRight } from 'lucide-react'

export function PaginationBar({ page, totalPages, onPage }) {
  function getPages() {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (page <= 4) return [1, 2, 3, 4, 5, '…', totalPages]
    if (page >= totalPages - 3) return [1, '…', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    return [1, '…', page - 1, page, page + 1, '…', totalPages]
  }

  if (totalPages <= 1) return null
  const pages = getPages()

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-[#1A5C38] hover:text-[#1A5C38] disabled:opacity-30 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      {pages.map((p, i) =>
        p === '…'
          ? <span key={`e${i}`} className="w-9 text-center text-gray-400 select-none text-sm">…</span>
          : <button
              key={p}
              onClick={() => onPage(p)}
              className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                page === p
                  ? 'bg-[#0A2415] text-white'
                  : 'border border-gray-200 text-gray-600 hover:border-[#1A5C38] hover:text-[#1A5C38]'
              }`}
            >{p}</button>
      )}
      <button
        onClick={() => onPage(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-[#1A5C38] hover:text-[#1A5C38] disabled:opacity-30 transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}

export function PerPageSelector({ value, options = [5, 10, 20], onChange }) {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <span className="text-gray-400">Tampilkan:</span>
      {options.map(n => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={`w-8 h-7 rounded-md font-semibold transition-colors ${
            value === n
              ? 'bg-[#1A5C38] text-white'
              : 'border border-gray-200 text-gray-500 hover:border-[#1A5C38] hover:text-[#1A5C38]'
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  )
}
