// src/components/Pagination.js

export const recipesPerPage = 8;

const PaginationButton = ({ name, onClick, disabled }) =>
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 border-2 text-[var(--main-text)] rounded-lg transition-all 
        ${disabled 
          ? "bg-[var(--sub-text)] text-[var(--other-text)] border-[var(--sub-text)] cursor-not-allowed opacity-50" // Disabled state
          : "bg-[var(--secondary-dark)] border-[var(--secondary-dark)] hover:bg-[var(--secondary)]"} // Active state
      `}
    >
      {name}
    </button>


const Pagination = ({ currentPage, totalPages, onPageChange, hasMore }) => {
  return (
    <div className="flex justify-center gap-4 mt-8">
      { 
        PaginationButton(
          {
            name:"< Prev",
            onClick:() => onPageChange(currentPage - 1),
            disabled:currentPage === 1
          }
        )
      }
      {/* <span className="text-lg text-[var(--primary)]">
        {currentPage} of {totalPages}
      </span> */}
      <PaginationButton
          name="Next >"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasMore || currentPage===totalPages}
      />
    </div>
  );
};

export default Pagination;
