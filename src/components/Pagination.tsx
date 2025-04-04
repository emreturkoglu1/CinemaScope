import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    // Daima ilk sayfayı göster
    if (currentPage > 3) {
      pages.push(
        <button 
          key={1} 
          onClick={() => onPageChange(1)}
          className="pagination-button"
        >
          1
        </button>
      );
      
      // Eğer ilk sayfadan uzaktaysak "..." göster
      if (currentPage > 4) {
        pages.push(
          <span key="ellipsis1" className="pagination-ellipsis">...</span>
        );
      }
    }
    
    // Mevcut sayfanın etrafındaki sayfaları göster
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
      pages.push(
        <button 
          key={i} 
          onClick={() => onPageChange(i)}
          className={`pagination-button ${i === currentPage ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }
    
    // Eğer son sayfadan uzaktaysak "..." göster
    if (currentPage < totalPages - 3) {
      pages.push(
        <span key="ellipsis2" className="pagination-ellipsis">...</span>
      );
      
      // Daima son sayfayı göster
      pages.push(
        <button 
          key={totalPages} 
          onClick={() => onPageChange(totalPages)}
          className="pagination-button"
        >
          {totalPages}
        </button>
      );
    }
    
    return pages;
  };

  return (
    <div className="pagination">
      <button 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
        className="pagination-button arrow"
        aria-label="Önceki sayfa"
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </button>
      
      {renderPageNumbers()}
      
      <button 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
        className="pagination-button arrow"
        aria-label="Sonraki sayfa"
      >
        <ChevronRightIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Pagination; 