"use client";

import Link from "next/link";

type PaginationProps = {
  totalPages: number;
  currentPage: number;
};

export const Pagination = ({ totalPages, currentPage }: PaginationProps) => {
  const prevPage = currentPage - 1 > 0;
  const nextPage = currentPage + 1 <= totalPages;

  return (
    <div className="col-span-12 md:col-start-2 md:col-end-12 mt-8">
      <nav className="flex justify-between">
        {!prevPage && (
          <button
            aria-label="Disable Previous"
            className="cursor-auto disabled:opacity-50 dark:text-white"
            disabled={!prevPage}>
            Previous
          </button>
        )}
        {prevPage && (
          <Link
            className="text-green-500 hover:text-green-600 dark:text-green-300 dark:hover:text-primary-1 cursor-pointer"
            href={
              currentPage - 1 === 1
                ? `/blog/page/1`
                : `/blog/page/${currentPage - 1}`
            }>
            <button aria-label="Pagination Previous">Previous</button>
          </Link>
        )}
        <span className="dark:text-white">
          {currentPage} of {totalPages}
        </span>
        {!nextPage && (
          <button
            aria-label="Disable Next"
            className="cursor-auto disabled:opacity-50 dark:text-white"
            disabled={!nextPage}>
            Next
          </button>
        )}
        {nextPage && (
          <Link
            className="text-green-500 hover:text-green-600 dark:text-green-300 dark:hover:text-primary-1 cursor-pointer"
            href={`/blog/page/${currentPage + 1}`}>
            <button aria-label="Pagination Next">Next</button>
          </Link>
        )}
      </nav>
    </div>
  );
};
