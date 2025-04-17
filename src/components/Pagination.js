// src/components/Pagination.js

const PaginationButton = ({name, onClick, disabled}) =>
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
        PaginationButton(
          {
            name:"Prev",
            onClick:() => onPageChange(currentPage - 1),
            disabled:currentPage === 1
          }
        )
      }
      <span className="text-lg text-[var(--primary)]">
        {currentPage} of {totalPages}
      </span>
      <PaginationButton
          name="Next"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasMore || currentPage===totalPages}
      />
    </div>
  );
};

export default Pagination;
