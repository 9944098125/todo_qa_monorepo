import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectTheme } from '@/app/slice/selectors';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalDocuments?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  totalDocuments,
  pageSize = 10,
  onPageChange,
  isLoading = false,
}: PaginationProps) {
  const themeState = useSelector(selectTheme);
  const isDark = themeState === 'dark';

  if (!totalPages || totalPages <= 0) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1 && !isLoading) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && !isLoading) {
      onPageChange(currentPage + 1);
    }
  };

  // Generate page numbers with a max window
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include page 1
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        start = 2;
        end = 4;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
        end = totalPages - 1;
      }

      if (start > 2) {
        pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push('...');
      }

      // Always include last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const startItem = totalDocuments
    ? Math.min((currentPage - 1) * pageSize + 1, totalDocuments)
    : (currentPage - 1) * pageSize + 1;
  const endItem = totalDocuments
    ? Math.min(currentPage * pageSize, totalDocuments)
    : currentPage * pageSize;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 px-4 select-none">
      {/* Information text */}
      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {typeof totalDocuments === 'number' && totalDocuments > 0 ? (
          <span>
            Showing{' '}
            <strong className="text-gray-900 dark:text-white">
              {startItem}
            </strong>{' '}
            to{' '}
            <strong className="text-gray-900 dark:text-white">{endItem}</strong>{' '}
            of{' '}
            <strong className="text-gray-900 dark:text-white">
              {totalDocuments}
            </strong>{' '}
            results
          </span>
        ) : (
          <span>
            Page{' '}
            <strong className="text-gray-900 dark:text-white">
              {currentPage}
            </strong>{' '}
            of{' '}
            <strong className="text-gray-900 dark:text-white">
              {totalPages}
            </strong>
          </span>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentPage <= 1 || isLoading}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150 border ${
            currentPage <= 1 || isLoading
              ? 'opacity-40 cursor-not-allowed border-gray-200 dark:border-gray-800 text-gray-400'
              : isDark
                ? 'border-gray-700 bg-gray-900 hover:bg-gray-800 text-white cursor-pointer active:scale-95'
                : 'border-gray-300 bg-white hover:bg-gray-100 text-gray-800 cursor-pointer active:scale-95'
          }`}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page numbers */}
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 py-1 text-sm font-medium text-gray-400 pointer-events-none"
              >
                ...
              </span>
            );
          }

          const isCurrent = page === currentPage;

          return (
            <button
              key={`page-${page}`}
              type="button"
              disabled={isLoading}
              onClick={() => onPageChange(Number(page))}
              className={`py-3 px-6 rounded-lg text-sm font-semibold transition-all duration-150 flex items-center justify-center border ${
                isCurrent
                  ? 'bg-green-600 text-white border-green-600 shadow-sm'
                  : isDark
                    ? 'border-gray-700 bg-gray-900 hover:bg-gray-800 text-gray-200 cursor-pointer active:scale-95'
                    : 'border-gray-300 bg-white hover:bg-gray-100 text-gray-800 cursor-pointer active:scale-95'
              }`}
            >
              {page}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNext}
          disabled={currentPage >= totalPages || isLoading}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150 border ${
            currentPage >= totalPages || isLoading
              ? 'opacity-40 cursor-not-allowed border-gray-200 dark:border-gray-800 text-gray-400'
              : isDark
                ? 'border-gray-700 bg-gray-900 hover:bg-gray-800 text-white cursor-pointer active:scale-95'
                : 'border-gray-300 bg-white hover:bg-gray-100 text-gray-800 cursor-pointer active:scale-95'
          }`}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
