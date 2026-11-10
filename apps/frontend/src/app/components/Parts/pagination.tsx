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

  const pageLimit = pageSize || 10;
  // Don't show pagination if documents are less than or equal to pageLimit (or 10), or only 1 page
  const hasMoreThanPageLimit =
    typeof totalDocuments === 'number'
      ? totalDocuments > pageLimit
      : totalPages > 1;

  if (!totalPages || totalPages <= 1 || !hasMoreThanPageLimit) {
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
      <div
        className={`text-sm font-medium ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}
      >
        {typeof totalDocuments === 'number' && totalDocuments > 0 ? (
          <span>
            Showing{' '}
            <strong
              className={
                isDark ? 'text-white font-bold' : 'text-gray-900 font-bold'
              }
            >
              {startItem}
            </strong>{' '}
            to{' '}
            <strong
              className={
                isDark ? 'text-white font-bold' : 'text-gray-900 font-bold'
              }
            >
              {endItem}
            </strong>{' '}
            of{' '}
            <strong
              className={
                isDark ? 'text-white font-bold' : 'text-gray-900 font-bold'
              }
            >
              {totalDocuments}
            </strong>{' '}
            results
          </span>
        ) : (
          <span>
            Page{' '}
            <strong
              className={
                isDark ? 'text-white font-bold' : 'text-gray-900 font-bold'
              }
            >
              {currentPage}
            </strong>{' '}
            of{' '}
            <strong
              className={
                isDark ? 'text-white font-bold' : 'text-gray-900 font-bold'
              }
            >
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
              ? isDark
                ? 'opacity-40 cursor-not-allowed border-gray-800 bg-transparent text-gray-500'
                : 'opacity-40 cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400'
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
                className={`px-2 py-1 text-sm font-medium pointer-events-none ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}
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
              className={`min-w-[2.5rem] h-9 px-3 rounded-lg text-sm font-semibold transition-all duration-150 flex items-center justify-center border ${
                isCurrent
                  ? 'bg-green-600 text-white border-green-600 shadow-sm font-bold'
                  : isDark
                    ? 'border-gray-700 bg-gray-900 hover:bg-gray-800 text-white cursor-pointer active:scale-95'
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
              ? isDark
                ? 'opacity-40 cursor-not-allowed border-gray-800 bg-transparent text-gray-500'
                : 'opacity-40 cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400'
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
