// src/components/Pagination.js

const paginationButton = (name, onClick, disabled) =>
  <button
    onClick={onClick}
    disabled={disabled}
    className="px-4 py-2 bg-[var(--secondary-dark)] border-2 border-[var(--secondary-dark)] text-[var(--main-text)] rounded-lg hover:bg-[var(--secondary)] transition"
  >
    {name}
  </button>

const Pagination = ({ currentPage, totalPages, onPageChange, hasMore }) => {
  return (
    <div className="flex justify-center gap-4 mt-8">
      { 
        paginationButton(
          "Prev",
          () => onPageChange(currentPage - 1),
          currentPage === 1
        )
      }
      <span className="text-lg text-[var(--primary)]">
        {currentPage} of {totalPages}
      </span>
      { 
        paginationButton(
          "Next",
          () => onPageChange(currentPage + 1),
          !hasMore || currentPage===totalPages
        )
      }
    </div>
  );
};

export default Pagination;
