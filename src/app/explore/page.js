"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { fetchRecipes } from "../../utils/api";
import RecipeCard from "../../components/RecipeCard";
import Pagination from "../../components/Pagination";
import GeneralFilter from "../../components/filtration/GeneralFilter";
import RangeSlider from "../../components/filtration/RangeSlider";
import { FaTrashAlt, FaCheckCircle } from 'react-icons/fa'; // Import icons for the buttons

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
  const [nation, setNation] = useState(nationFromParams || "");
  const [time, setTime] = useState([0, 720]);
  const [cost, setCost] = useState([0, 1000]);
  const [difficulty, setDifficulty] = useState([1, 10]);

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
    setNation("");
    setTime([0, 720]);
    setCost([0, 1000]);
    setDifficulty([1, 10]);
    setSearchTerm("");
  };

  // Handle search button click or Enter key press
  const handleSearch = () => {
    setShouldSearch(true); // Trigger the search
  };

  // Trigger automatic search if params exist
  useEffect(() => {
    if (nationFromParams || categoryFromParams || subcategoryFromParams || searchTermFromParams) {
      setShouldSearch(true);
    }
  }, [nationFromParams, categoryFromParams, subcategoryFromParams, searchTermFromParams]);

  // Fetch recipes
  useEffect(() => {
    if (shouldSearch) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const data = await fetchRecipes(
            page,
            categories,
            subcategories,
            nation,
            ingredients,
            time,
            cost,
            ratings,
            difficulty
          );
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
  }, [shouldSearch, page, categories, subcategories, nation, ingredients, time, cost, ratings, difficulty]);

  // Create filter display string
  const appliedFilters = [
    searchTerm && `Search: "${searchTerm}"`,
    categories.length > 0 && `Categories: ${categories.join(", ")}`,
    subcategories.length > 0 && `Subcategories: ${subcategories.join(", ")}`,
    ratings.length > 0 && `Ratings: ${ratings.join(", ")}`,
    ingredients.length > 0 && `Ingredients: ${ingredients.join(", ")}`,
    nation && `Nation: ${nation}`,
    time && `Time: ${time[0]} - ${time[1]} min`,
    cost && `Cost: $${cost[0]} - $${cost[1]}`,
    difficulty && `Difficulty: ${difficulty[0]} - ${difficulty[1]}`
  ]
    .filter(Boolean)
    .join(" | ");

  return (
    <div className="flex max-w-screen-xl mx-auto p-8 gap-8">
      {/* Left side: Filters */}
      <div className="w-1/4 space-y-6">
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
        <GeneralFilter title="Categories" options={categoryOptions} selectedValues={categories} onChange={setCategories} isMultiSelect={true} allowCustomInput={true} onClear={() => setCategories([])} />
        <GeneralFilter title="Subcategories" options={subcategoryOptions} selectedValues={subcategories} onChange={setSubcategories} isMultiSelect={true} allowCustomInput={true} onClear={() => setSubcategories([])} />
        <GeneralFilter title="Ratings" options={ratingOptions} selectedValues={ratings} onChange={setRatings} isMultiSelect={true} onClear={() => setRatings([])} />
        <GeneralFilter title="Ingredients" options={ingredientOptions} selectedValues={ingredients} onChange={setIngredients} isMultiSelect={true} allowCustomInput={true} onClear={() => setIngredients([])} />
        <GeneralFilter title="Nation" options={nationOptions} selectedValues={nation ? [nation] : []} onChange={setNation} isMultiSelect={false} allowCustomInput={true} onClear={() => setNation("")} />
        <RangeSlider label="Time" min={0} max={720} value={time} onChange={setTime} unit="min" />
        <RangeSlider label="Cost" min={0} max={1000} value={cost} onChange={setCost} unit="$" />
        <RangeSlider label="Difficulty" min={1} max={10} value={difficulty} onChange={setDifficulty} unit="" />

        {/* Apply Filters Button - at the bottom */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSearch}
            className="flex items-center justify-center py-2 px-4 bg-teal-600 text-white rounded-full w-full hover:bg-teal-700 transition-all"
          >
            <FaCheckCircle className="mr-2" /> Apply Filters
          </button>
        </div>
      </div>

      {/* Separator */}
      <div className="w-px bg-gray-300 mx-8"></div>

      {/* Right side: Results */}
      <div className="w-3/4 space-y-8">
        <main className="flex flex-col items-center gap-12">
          {/* Search Summary */}
          <div className="w-full p-4 bg-gray-100 rounded-md shadow-sm">
            <h3 className="text-xl font-semibold">Search Results</h3>
            <p className="text-sm text-gray-600">
              {searchTerm && `Showing results for: "${searchTerm}"`}
              {appliedFilters && (
                <span className="block mt-2 text-sm text-gray-500">
                  Filters applied: {appliedFilters}
                </span>
              )}
            </p>
          </div>

          {/* Recipe Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : recipes.length === 0 ? (
              <p className="text-center text-xl text-gray-500">No results found. Please try adjusting your filters.</p>
            ) : (
              recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))
            )}
          </div>

          {/* Pagination */}
          <Pagination currentPage={page} totalPages={Math.ceil(100 / 10)} onPageChange={setPage} hasMore={hasMore} />
        </main>
      </div>
    </div>
  );
}
