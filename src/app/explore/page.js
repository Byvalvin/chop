"use client";

import { useState, useEffect, Suspense } from "react";  // Import Suspense
import { useSearchParams } from "next/navigation";
import { fetchRecipes } from "../../utils/api";
import RecipeCard from "../../components/RecipeCard";
import Pagination from "../../components/Pagination";
import GeneralFilter from "../../components/filtration/GeneralFilter";
import RangeSlider from "../../components/filtration/RangeSlider";
import { FaTrashAlt, FaCheckCircle, FaSearch } from 'react-icons/fa'; // Import icons for the buttons
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
    searchParams.set("searchTerm", ""); // Set the searchTerm to empty in the URL
    window.history.replaceState({}, "", window.location.pathname); // Update the URL without reloading the page
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
      <div className="flex flex-col items-center justify-center p-8 bg-gray-100 rounded-lg shadow-xl text-center space-y-4">
        {/* Optional Icon */}
        <div className="text-5xl text-gray-500"> {/* Increased size for better visibility */}
          <FaSearch className="mx-auto mb-4" />
        </div>
        <p className="text-3xl text-gray-700 font-semibold">No results found</p> {/* Increased size */}
        <p className="text-lg text-gray-500"> {/* Increased size */}
          We couldn&apos;t find any recipes matching your filters.
        </p>
        {/* Optional: Suggestion to clear filters */}
        <button
          onClick={handleClearAll}
          className="mt-4 py-3 px-6 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-all text-lg"
        >
          Clear Filters
        </button>
      </div>
    );
  }
  
  

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
          setHasMore(data.results.length === 10);
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
      {/* Add spacing below sticky Navbar */}
      <PageContainer>
      <div className="flex max-w-screen-xl mx-auto p-8 gap-8 min-h-screen bg-white/60 backdrop-blur-lg border border-white/20 shadow-lg rounded-2xl shadow-xl backdrop-blur-sm">

          {/* Left side: Filters */}
          <div className="w-1/4 space-y-6 bg-gray-50 border-l-4 border-teal-300 rounded-lg shadow-md p-6">
          <div className="">
            {/* Clear Filters Button - at the top */}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleClearAll}
                className="flex items-center justify-center py-2 px-4 bg-red-600 text-white rounded-full w-full hover:bg-red-700 transition-all"
              >
                <FaTrashAlt className="mr-2" /> Clear All
              </button>
            </div>

            {/* Filters */}
            <GeneralFilter title="Categories" options={categoryOptions} selectedValues={categories} onChange={setCategories} isMultiSelect={true} allowCustomInput={true} onClear={() => setCategories([])} hasUnsavedChanges={haveUnsavedChanges("categories")} variant = "dark"/>
            <GeneralFilter title="Subcategories" options={subcategoryOptions} selectedValues={subcategories} onChange={setSubcategories} isMultiSelect={true} allowCustomInput={true} onClear={() => setSubcategories([])} hasUnsavedChanges={haveUnsavedChanges("subcategories")} variant = "dark"/>
            <GeneralFilter title="Ratings" options={ratingOptions} selectedValues={ratings} onChange={setRatings} isMultiSelect={true} onClear={() => setRatings([])} hasUnsavedChanges={haveUnsavedChanges("ratings")} variant = "dark"/>
            <GeneralFilter title="Ingredients" options={ingredientOptions} selectedValues={ingredients} onChange={setIngredients} isMultiSelect={true} allowCustomInput={true} onClear={() => setIngredients([])} hasUnsavedChanges={haveUnsavedChanges("ingredients")} variant = "dark"/>
            <GeneralFilter title="Nations" options={nationOptions} selectedValues={nations} onChange={setNations} isMultiSelect={false} allowCustomInput={true} onClear={() => setNations([])} hasUnsavedChanges={haveUnsavedChanges("nations")} variant = "dark"/>
            <RangeSlider label="Time" min={0} max={720} value={time} onChange={setTime} unit="min" hasUnsavedChanges={haveUnsavedChanges("time")} ticks={3} variant = "dark"/>
            <RangeSlider label="Cost" min={0} max={1000} value={cost} onChange={setCost} unit="$" hasUnsavedChanges={haveUnsavedChanges("cost")} ticks={3} variant = "dark"/>
            <RangeSlider label="Difficulty" min={1} max={10} value={difficulty} onChange={setDifficulty} unit="" hasUnsavedChanges={haveUnsavedChanges("difficulty")} ticks={2} variant = "dark"/>

            {/* Apply Filters Button - at the bottom */}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleSearch}
                disabled={!hasAnyUnsavedChanges}
                className={`flex items-center justify-center py-2 px-4 rounded-full w-full transition-all
                  ${hasAnyUnsavedChanges
                    ? "bg-teal-600 text-white hover:bg-teal-700"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"}
                `}
              >
                <FaCheckCircle className="mr-2" /> Apply Filters
              </button>
            </div>
            </div>
          </div>

          {/* Separator */}
          <div className="w-[px] bg-gray-300 rounded-md"></div>

          {/* Right side: Results */}

          <div className="w-3/4 space-y-8 p-4 bg-gray-50 border-l-4 border-teal-300 rounded-md shadow-sm">
            <main className="flex flex-col items-center gap-12 m-2">
              {/* Search Summary */}
              <div className="w-full p-4 bg-gray-100 rounded-md shadow-sm">
                <h3 className="text-xl font-semibold">Search Results</h3>
                <p className="text-sm text-gray-600">
                  {appliedFiltersState.searchTerm && `Showing results for: "${appliedFiltersState.searchTerm.replace(/'/g, "&#39;")}"`}
                  <span className="block mt-2 text-sm text-gray-500">
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
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full">
                  {[...Array(8)].map((_, idx) => (
                    <RecipeCardSkeleton key={idx} variant="dark" />
                  ))}
                </div>
              ) : recipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full">
                  {recipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} variant="dark" />
                  ))}
                </div>
              ) : error ? (
                <p>{error}</p>
              ) : (
                noResults() // Show the No Results message if no recipes after search
              )}



              {/* Pagination */}
              <Pagination currentPage={page} totalPages={Math.ceil(100 / 10)} onPageChange={setPage} hasMore={hasMore} />
            </main>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
