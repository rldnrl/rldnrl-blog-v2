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
            className="cursor-auto disabled:opacity-50 dark:text-white"
            disabled={!prevPage}>
            Previous
          </button>
        )}
        {prevPage && (
          <Link
            className="dark:text-white"
            href={
              currentPage - 1 === 1
                ? `/blog/`
                : `/blog/?page=${currentPage - 1}`
            }>
            <button>Previous</button>
          </Link>
        )}
        <span className="dark:text-white">
          {currentPage} of {totalPages}
        </span>
        {!nextPage && (
          <button
            className="cursor-auto disabled:opacity-50 dark:text-white"
            disabled={!nextPage}>
            Next
          </button>
        )}
        {nextPage && (
          <Link
            className="dark:text-white"
            href={`/blog/?page=${currentPage + 1}`}>
            <button>Next</button>
          </Link>
        )}
      </nav>
    </div>
  );
};
