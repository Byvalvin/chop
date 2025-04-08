"use client"; // Ensure this is at the top to mark the file as client-side

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // Use useSearchParams for query parameters
import { fetchRecipes, fetchRecipeImages } from "../../utils/api"; // Fetch API utility
import RecipeCard from "../../components/RecipeCard"; 
import Pagination from "../../components/Pagination"; // Import Pagination component
import SearchBar from "../../components/SearchBar"; // Import SearchBar component

export default function Results() {
  const searchParams = useSearchParams(); // Get query params using useSearchParams
  const searchTermFromParams = searchParams.get("searchTerm"); // Extract searchTerm from query params
  
  const [searchTerm, setSearchTerm] = useState(searchTermFromParams || ""); // Define searchTerm and setSearchTerm here
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [recipeImages, setRecipeImages] = useState({});
  const [category, setCategory] = useState(""); // New state for category filter
  const [cuisine, setCuisine] = useState(""); // New state for cuisine filter

  // Fetch recipes when any of the filters or search term changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const recipesData = await fetchRecipes(page, category, cuisine, "", searchTerm);
        setRecipes(recipesData.results);
        setHasMore(recipesData.results.length === 10); // Adjust based on API response length
        const images = await fetchRecipeImages(recipesData.results.map(recipe => recipe.id));
        setRecipeImages(images);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (searchTerm || category || cuisine) {
      fetchData(); // Fetch when searchTerm, category, or cuisine changes
    }
  }, [searchTerm, page, category, cuisine]); // Run when searchTerm, page, category, or cuisine change

  // Handle page change from Pagination
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-500 via-teal-400 to-teal-300">
      <div className="flex max-w-screen-xl mx-auto p-8">
        {/* Left side: Filter and Search options */}
        <div className="w-1/4 pr-8">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          
          <div className="mt-8">
            <h2 className="text-lg text-white">Filter by Category</h2>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full mt-2 p-2 rounded-md"
            >
              <option value="">All Categories</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Dessert">Dessert</option>
              {/* Add more categories as needed */}
            </select>
          </div>

          <div className="mt-8">
            <h2 className="text-lg text-white">Filter by Cuisine</h2>
            <select
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              className="w-full mt-2 p-2 rounded-md"
            >
              <option value="">All Cuisines</option>
              <option value="Italian">Italian</option>
              <option value="Indian">Indian</option>
              <option value="Mexican">Mexican</option>
              {/* Add more cuisines as needed */}
            </select>
          </div>
        </div>

        {/* Right side: Recipe Grid and Pagination */}
        <div className="flex-grow">
          <main className="flex flex-col items-center gap-12">
            {/* Recipe grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full">
              {loading ? (
                <p className="text-white text-lg">Loading results...</p>
              ) : error ? (
                <p className="text-red-400 text-lg">{error}</p>
              ) : (
                recipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} recipeImage={recipeImages[recipe.id]} />
                ))
              )}
            </div>

            {/* Pagination */}
            {hasMore && !loading && (
              <Pagination
                currentPage={page}
                totalPages={Math.ceil(recipes.length / 10)} // Assuming 10 items per page
                onPageChange={handlePageChange}
                hasMore={hasMore}
              />
            )}
          </main>
        </div>
      </div>

      <footer className="py-4 text-center text-gray-500">
        <p className="text-sm">Powered by ChopAPI</p>
      </footer>
    </div>
  );
}
