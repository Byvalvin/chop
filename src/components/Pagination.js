// src/components/Pagination.js

const Pagination = ({ currentPage, totalPages, onPageChange, hasMore }) => {
    return (
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
        >
          Prev
        </button>
        <span className="text-lg text-white">{currentPage} of {totalPages}</span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasMore || currentPage === totalPages}
          className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
        >
          Next
        </button>
      </div>
    );
  };
  
  export default Pagination;
  