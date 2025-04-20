"use client";

import { useState, useEffect } from "react";  // Import Suspense
import { useSearchParams } from "next/navigation";
import { fetchRecipes } from "../../utils/api";
import RecipeCard from "../../components/RecipeCard";
import Pagination, {recipesPerPage} from "../../components/Pagination";
import GeneralFilter from "../../components/filtration/GeneralFilter";
import RangeSlider from "../../components/filtration/RangeSlider";
import { FaTrashAlt, FaCheckCircle, FaSearch, FaFilter,FaTimes } from 'react-icons/fa'; // Import icons for the buttons
import PageContainer from "../../components/PageContainer";

import RecipeCardSkeleton from "../../components/skeletons/RecipeCardSkeleton";

// The Results Component wrapped in Suspense
export default function Results() {
  const searchParams = useSearchParams();

  // Grab query params
  const searchTermFromParams = searchParams.get("searchTerm");
  const nationFromParams = searchParams.get("nation");
  const categoryFromParams = searchParams.get("category");
  const subcategoryFromParams = searchParams.get("subcategory");

  // State
  const [searchTerm, setSearchTerm] = useState(searchTermFromParams || "");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [shouldSearch, setShouldSearch] = useState(false);

  // Filter states
  const [categories, setCategories] = useState(categoryFromParams ? [categoryFromParams] : []);
  const [subcategories, setSubcategories] = useState(subcategoryFromParams ? [subcategoryFromParams] : []);
  const [ratings, setRatings] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [nations, setNations] = useState(nationFromParams ? [nationFromParams] : []);
  const [time, setTime] = useState([0, 720]);
  const [cost, setCost] = useState([0, 1000]);
  const [difficulty, setDifficulty] = useState([1, 10]);

  // Applied filters (used to compare for changes)
  const [appliedFiltersState, setAppliedFiltersState] = useState({
    searchTerm,
    categories,
    subcategories,
    ratings,
    ingredients,
    nations,
    time,
    cost,
    difficulty,
  });
  const [showFilters, setShowFilters] = useState(false);

  // Options for dropdowns/sliders
  const categoryOptions = ["Vegetarian", "Vegan", "Dessert"];
  const subcategoryOptions = ["Stew"];
  const ratingOptions = ["1", "2", "3", "4", "5", "unrated"];
  const ingredientOptions = ["Tomato", "Cheese", "Chicken", "Lettuce", "Rice"];
  const nationOptions = ["Italy", "India", "Mexico", "Nigeria", "United States of America"];

  // Clear all filters
  const handleClearAll = () => {
    setCategories([]);
    setSubcategories([]);
    setRatings([]);
    setIngredients([]);
    setNations([]);
    setTime([0, 720]);
    setCost([0, 1000]);
    setDifficulty([1, 10]);
    setSearchTerm("");

     // Clear search params in the URL
    //searchParams.set("searchTerm", ""); // Set the searchTerm to empty in the URL
    window.history.replaceState({}, "", window.location.pathname); // Update the URL without reloading the page

     // Clear applied filters state
  setAppliedFiltersState({
    searchTerm: "",
    categories: [],
    subcategories: [],
    ratings: [],
    ingredients: [],
    nations: [],
    time: [0, 720],
    cost: [0, 1000],
    difficulty: [1, 10],
  });

  // Trigger a new search with the cleared filters
  setShouldSearch(true);

  // Ensure there are no unsaved changes after clearing all filters
  setShowFilters(false); // Optional: Hide filters on smaller screens after clearing
  };

  // Handle search button click or Enter key press
  const handleSearch = () => {
    setAppliedFiltersState({
      searchTerm,
      categories,
      subcategories,
      ratings,
      ingredients,
      nations,
      time,
      cost,
      difficulty,
    });
    setShouldSearch(true);

    // Toggle the filters visibility for smaller screens
    if (window.innerWidth <= 768) {
      setShowFilters(false);  // Hide filters after applying on small screens
    }
  };

  const haveUnsavedChanges = (key) => {
    const current = {
      searchTerm,
      categories,
      subcategories,
      ratings,
      ingredients,
      nations,
      time,
      cost,
      difficulty,
    }[key];

    const applied = appliedFiltersState[key];

    return JSON.stringify(current) !== JSON.stringify(applied);
  };
  const hasAnyUnsavedChanges = Object.keys(appliedFiltersState).some(haveUnsavedChanges);

  const noResults = () => {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-[var(--search-results-bg)] rounded-lg shadow-xl text-center space-y-4">
        {/* Optional Icon */}
        <div className="text-5xl text-[var(--search-results-subtext)]"> {/* Increased size for better visibility */}
          <FaSearch className="mx-auto mb-4" />
        </div>
        <p className="text-3xl text-[var(--other-text)] font-semibold">No results found</p> {/* Increased size */}
        <p className="text-lg text-[var(--search-results-subtext)]"> {/* Increased size */}
          We couldn&apos;t find any recipes matching your filters.
        </p>
        {/* Optional: Suggestion to clear filters */}
        <button
          onClick={handleClearAll}
          className="mt-4 py-3 px-6 bg-[var(--secondary)] text-[var(--main-text)] rounded-full hover:bg-[var(--secondary-dark)] transition-all text-lg"
        >
          Clear Filters
        </button>
      </div>
    );
  }

  const onPageChange = (newPage) => {
    setPage(newPage); // updates the page number
    setShouldSearch(true); // trigger new search when page changes
  };
  
  
  

  // Trigger automatic search if params exist
  useEffect(() => {
    if (nationFromParams || categoryFromParams || subcategoryFromParams || searchTermFromParams) {
      setShouldSearch(true);
    }
  }, [nationFromParams, categoryFromParams, subcategoryFromParams, searchTermFromParams]);

  // Add this useEffect: for updating and apply search
  useEffect(() => {
    if (searchTermFromParams !== searchTerm) {
      const updatedSearch = searchTermFromParams || "";
      setSearchTerm(updatedSearch);
      setAppliedFiltersState((prev) => ({
        ...prev,
        searchTerm: updatedSearch,
      }));
      setShouldSearch(true);
    }
  }, [searchTermFromParams, searchTerm]);

  // Fetch recipes
  useEffect(() => {
    if (shouldSearch) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const data = await fetchRecipes({
            page,
            search: searchTerm,
            categories,
            subcategories,
            nations,
            ingredients,
            time,
            cost,
            ratings,
            difficulty
          });
          setRecipes(data.results);
          setHasMore(data.results.length === recipesPerPage);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
          setShouldSearch(false); // reset search trigger
        }
      };

      fetchData();
    }
  }, [shouldSearch, page, searchTerm, categories, subcategories, nations, ingredients, time, cost, ratings, difficulty]);

  // Create filter display string
  const appliedFilters = [
    searchTerm && `Search: "${searchTerm}"`,
    categories.length > 0 && `Categories: ${categories.join(", ")}`,
    subcategories.length > 0 && `Subcategories: ${subcategories.join(", ")}`,
    ratings.length > 0 && `Ratings: ${ratings.join(", ")}`,
    ingredients.length > 0 && `Ingredients: ${ingredients.join(", ")}`,
    nations.length > 0 && `Nations: ${nations.join(", ")}`,
    time && `Time: ${time[0]} - ${time[1]} min`,
    cost && `Cost: $${cost[0]} - $${cost[1]}`,
    difficulty && `Difficulty: ${difficulty[0]} - ${difficulty[1]}`
  ]
    .filter(Boolean)
    .join(" | ");


    return (
      <div className="min-h-screen bg-[url('/images/bg/light1.png')] bg-cover bg-center bg-no-repeat">
        <PageContainer>
          {/* Responsive layout for mobile and desktop */}
          <div className="flex flex-col-reverse md:flex-row max-w-screen-xl mx-auto p-8 gap-8 min-h-screen bg-[var(--glass-bg)] backdrop-blur-lg border border-[var(--glass-border)] shadow-lg rounded-2xl shadow-xl backdrop-blur-sm">
            
            {/* Left side: Filters (visible on large screens, and toggleable on small screens) */}
            <div
              className={`w-full md:w-1/4 space-y-6 bg-[var(--bg-light)] border-l-4 border-[var(--secondary)] rounded-lg shadow-md p-6 transition-all duration-300 ${showFilters ? "block" : "hidden md:block"}`}
            >
              <div className="">
                {/* Filters heading with toggle button for small screens */}
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold md:hidden">Filters</h3> {/* Only visible on small screens */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="md:hidden py-3 px-6 bg-[var(--secondary-dark)] text-[var(--main-text)] rounded-full hover:bg-[var(--primary)] transition-all shadow-lg"
                  >
                    {showFilters ? (
                      <FaTimes className="" />
                    ) : (
                      <FaFilter className="" />
                    )}
                  </button>
                </div>
                
                {/* Clear Filters Button */}
                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleClearAll}
                    className="flex items-center justify-center py-2 px-4 bg-red-600 text-[var(--main-text)] rounded-full w-full hover:bg-red-700 transition-all"
                  >
                    <FaTrashAlt className="mr-2" /> Clear All
                  </button>
                </div>
        
                {/* Filters */}
                <GeneralFilter title="Categories" options={categoryOptions} selectedValues={categories} onChange={setCategories} isMultiSelect={true} allowCustomInput={true} onClear={() => setCategories([])} hasUnsavedChanges={haveUnsavedChanges("categories")} />
                <GeneralFilter title="Subcategories" options={subcategoryOptions} selectedValues={subcategories} onChange={setSubcategories} isMultiSelect={true} allowCustomInput={true} onClear={() => setSubcategories([])} hasUnsavedChanges={haveUnsavedChanges("subcategories")} />
                <GeneralFilter title="Ratings" options={ratingOptions} selectedValues={ratings} onChange={setRatings} isMultiSelect={true} onClear={() => setRatings([])} hasUnsavedChanges={haveUnsavedChanges("ratings")} />
                <GeneralFilter title="Ingredients" options={ingredientOptions} selectedValues={ingredients} onChange={setIngredients} isMultiSelect={true} allowCustomInput={true} onClear={() => setIngredients([])} hasUnsavedChanges={haveUnsavedChanges("ingredients")} />
                <GeneralFilter title="Nations" options={nationOptions} selectedValues={nations} onChange={setNations} isMultiSelect={false} allowCustomInput={true} onClear={() => setNations([])} hasUnsavedChanges={haveUnsavedChanges("nations")} />
                <RangeSlider label="Time" min={0} max={720} value={time} onChange={setTime} unit="min" hasUnsavedChanges={haveUnsavedChanges("time")} ticks={3} />
                <RangeSlider label="Cost" min={0} max={1000} value={cost} onChange={setCost} unit="$" hasUnsavedChanges={haveUnsavedChanges("cost")} ticks={3} />
                <RangeSlider label="Difficulty" min={1} max={10} value={difficulty} onChange={setDifficulty} unit="" hasUnsavedChanges={haveUnsavedChanges("difficulty")} ticks={2} />
        
                {/* Apply Filters Button */}
                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleSearch}
                    disabled={!hasAnyUnsavedChanges}
                    className={`flex items-center justify-center py-2 px-4 rounded-full w-full transition-all
                      ${hasAnyUnsavedChanges
                        ? "bg-[var(--secondary-dark)] text-[var(--main-text)] hover:bg-[var(--primary)]"
                        : "bg-[var(--sub-text)] text-[var(--bg-light)] cursor-not-allowed"}
                    `}
                  >
                    <FaCheckCircle className="mr-2" /> Apply Filters
                  </button>
                </div>
              </div>
            </div>
        
            {/* Right side: Search Results */}
            <div
              className={`w-full md:w-3/4 space-y-8 p-4 bg-[var(--bg-light)] border-l-4 border-[var(--secondary)] rounded-md shadow-sm transition-all duration-300 ${showFilters ? "hidden" : "block"}`}
            >
              <main className="flex flex-col items-center gap-12 m-2">
            
                <div className="w-full p-4 bg-[var(--search-results-bg)] rounded-md shadow-sm">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Search Results</h3>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="md:hidden py-3 px-6 bg-[var(--secondary-dark)] text-[var(--main-text)] rounded-full hover:bg-[var(--primary)] transition-all shadow-lg"
                  >
                    {showFilters ? (
                      <FaTimes className="" />
                    ) : (
                      <FaFilter className="" />
                    )}
                  </button>
                </div>
                  <p className="text-sm text-[var(--other-text)]">
                    {appliedFiltersState.searchTerm && `Showing results for: "${appliedFiltersState.searchTerm.replace(/'/g, "&#39;")}"`}
                    <span className="block mt-2 text-sm text-[var(--search-results-subtext)]">
                      Filters applied: {[
                        appliedFiltersState.categories.length > 0 && `Categories: ${appliedFiltersState.categories.join(", ")}`,
                        appliedFiltersState.subcategories.length > 0 && `Subcategories: ${appliedFiltersState.subcategories.join(", ")}`,
                        appliedFiltersState.ratings.length > 0 && `Ratings: ${appliedFiltersState.ratings.join(", ")}`,
                        appliedFiltersState.ingredients.length > 0 && `Ingredients: ${appliedFiltersState.ingredients.join(", ")}`,
                        appliedFiltersState.nations.length > 0 && `Nations: ${appliedFiltersState.nations.join(", ")}`,
                        appliedFiltersState.time && `Time: ${appliedFiltersState.time[0]} - ${appliedFiltersState.time[1]} min`,
                        appliedFiltersState.cost && `Cost: $${appliedFiltersState.cost[0]} - $${appliedFiltersState.cost[1]}`,
                        appliedFiltersState.difficulty && `Difficulty: ${appliedFiltersState.difficulty[0]} - ${appliedFiltersState.difficulty[1]}`
                      ].filter(Boolean).join(" | ").replace(/'/g, "&#39;")}
                    </span>
                  </p>
                </div>
        
                {/* Recipe Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full overflow-y-auto max-h-[60vh] md:max-h-none">
                  {loading ? (
                    [...Array(8)].map((_, idx) => (
                      <RecipeCardSkeleton key={idx} />
                    ))
                  ) : recipes.length > 0 ? (
                    recipes.map((recipe) => (
                      <RecipeCard key={recipe.id} recipe={recipe} />
                    ))
                  ) : error ? (
                    <p>{error}</p>
                  ) : null}
                </div>

                 {/* No Results Message */}
              {!loading && recipes.length === 0 && !error && <div>{noResults()}</div>}

        
                {/* Pagination */}
                <div className="w-full flex justify-center">
                  <Pagination
                    currentPage={page}
                    totalPages={Math.ceil(100 / 10)}
                    onPageChange={onPageChange}
                    hasMore={hasMore}
                  />
                </div>
              </main>
            </div>
          </div>
        </PageContainer>
      </div>
    );
}


/*
https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams
*/