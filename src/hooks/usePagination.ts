
import { useState } from 'react';

export function usePagination<T>(items: T[], itemsPerPage: number = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Calculate total number of pages
  const totalPages = Math.ceil(items.length / itemsPerPage);
  
  // Get current page items
  const currentItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Change page
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  
  return {
    currentPage,
    setCurrentPage,
    totalPages,
    currentItems,
    paginate,
    itemsPerPage
  };
}
