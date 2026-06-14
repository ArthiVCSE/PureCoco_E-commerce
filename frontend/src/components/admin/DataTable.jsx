import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/formatCurrency';

const DataTable = ({
  columns,
  data,
  searchable = true,
  searchPlaceholder = 'Search...',
  onSearch,
  page = 1,
  totalPages = 1,
  onPageChange,
}) => {
  return (
    <div className="card overflow-hidden">
      {searchable && (
        <div className="p-4 border-b border-coconut/10 dark:border-cream/10">
          <div className="relative max-w-sm">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              onChange={(e) => onSearch?.(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-coconut/15 dark:border-cream/15 text-sm font-sans text-body placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm font-sans">
          <thead>
            <tr className="border-b border-coconut/15 dark:border-cream/15 bg-coconut/8 dark:bg-cream/8">
              {columns.map((col) => (
                <th key={col.key} className="text-left p-4 font-bold text-coconut/80 dark:text-cream/80 text-xs uppercase tracking-wider">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-muted">
                  No data found
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr
                  key={row.id || i}
                  className="border-b border-coconut/5 dark:border-cream/5 hover:bg-coconut/5 dark:hover:bg-cream/5 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="p-4 text-body">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-coconut/10 dark:border-cream/10">
          <span className="text-sm text-muted">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange?.(page - 1)}
              disabled={page <= 1}
              className={cn('p-2 rounded border border-coconut/15 text-body transition-colors', page <= 1 ? 'opacity-40' : 'hover:bg-coconut/5 dark:hover:bg-cream/5')}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= totalPages}
              className={cn('p-2 rounded border border-coconut/15 text-body transition-colors', page >= totalPages ? 'opacity-40' : 'hover:bg-coconut/5 dark:hover:bg-cream/5')}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
