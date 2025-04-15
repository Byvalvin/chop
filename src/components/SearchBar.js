// SearchBar.js
const SearchBar = ({ searchTerm, setSearchTerm, handleSearch, height = 'py-4' }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <div className={`w-full ${height}`}>
      <div className="flex items-center justify-center">
        <div className="flex items-center border border-[var(--secondary)] rounded-full px-3 py-1 space-x-2 w-1/3 sm:w-1/4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyUp={handleKeyPress} // Handle Enter key press
            className="text-[var(--main-text)] w-full px-3 py-1 rounded-full focus:outline-none"
            placeholder="Search..."
          />
          <button
            className="border-2 border-[var(--secondary-dark)] bg-[var(--secondary-dark)] text-[var(--main-text)] p-2 rounded-full hover:bg-[var(--secondary)]"
            onClick={handleSearch} // On button click
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
