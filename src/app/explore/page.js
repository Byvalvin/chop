"use client"; // Ensure this is at the top to mark the file as client-side

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { fetchRecipes } from "../../utils/api";
import RecipeCard from "../../components/RecipeCard";
import Pagination from "../../components/Pagination";
import SearchBar from "../../components/SearchBar";
import GeneralFilter from "../../components/filtration/GeneralFilter";
import RangeSlider from "../../components/filtration/RangeSlider";

export default function Results() {
  const searchParams = useSearchParams();
  const searchTermFromParams = searchParams.get("searchTerm");

  const [searchTerm, setSearchTerm] = useState(searchTermFromParams || "");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [shouldSearch, setShouldSearch] = useState(false); // Flag to trigger search

  // Filters
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [nation, setNation] = useState("");
  const [time, setTime] = useState([0, 720]);
  const [cost, setCost] = useState([0, 1000]);
  const [difficulty, setDifficulty] = useState([1, 10]);

  // Filter options
  const categoryOptions = ["Vegetarian", "Vegan", "Dessert"];
  const subcategoryOptions = ["Stew"];
  const ratingOptions = ["1", "2", "3", "4", "5", "unrated"];
  const ingredientOptions = ["Tomato", "Cheese", "Chicken", "Lettuce", "Rice"];
  const nationOptions = ["Italy", "India", "Mexico", "Nigeria", "United States of America"];

  // Handle search button click or Enter key press
  const handleSearch = () => {
    setShouldSearch(true); // Trigger the search
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setShouldSearch(true); // Trigger search on Enter key press
    }
  };

  // Fetch recipes when search is triggered
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
        }
      };

      fetchData();
      setShouldSearch(false);
    }
  }, [shouldSearch, page, categories, subcategories, nation, ingredients, time, cost, ratings, difficulty]);

  // Create a string showing applied filters
  const appliedFilters = [
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
        {/* Filters */}
        <GeneralFilter title="Categories" options={categoryOptions} selectedValues={categories} onChange={setCategories} isMultiSelect={true} />
        <GeneralFilter title="Subcategories" options={subcategoryOptions} selectedValues={subcategories} onChange={setSubcategories} isMultiSelect={true} />
        <GeneralFilter title="Ratings" options={ratingOptions} selectedValues={ratings} onChange={setRatings} isMultiSelect={true} />
        <GeneralFilter title="Ingredients" options={ingredientOptions} selectedValues={ingredients} onChange={setIngredients} isMultiSelect={true} />
        <GeneralFilter title="Nation" options={nationOptions} selectedValues={nation ? [nation] : []} onChange={setNation} isMultiSelect={false} />
        <RangeSlider label="Time" min={0} max={720} value={time} onChange={setTime} unit="min" />
        <RangeSlider label="Cost" min={0} max={1000} value={cost} onChange={setCost} unit="$" />
        <RangeSlider label="Difficulty" min={1} max={10} value={difficulty} onChange={setDifficulty} unit="" />

        {/* Search Button */}
        <button onClick={handleSearch} className="mt-6 py-2 px-4 bg-teal-500 text-white rounded-full w-full hover:bg-teal-600">
          Search
        </button>
      </div>

      {/* Separator between filter and results */}
      <div className="w-px bg-gray-300 mx-8"></div>

      {/* Right side: Recipes and Pagination */}
      <div className="w-3/4 space-y-8">
        <main className="flex flex-col items-center gap-12">
          {/* Search summary */}
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

          {/* Recipe Cards */}
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
