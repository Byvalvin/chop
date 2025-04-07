"use client";

import { useState, useEffect } from "react";
import { fetchRecipes, fetchRecipeImages, fetchNations, fetchCategories, fetchSubcategories } from "../utils/api"; // Utility function to handle API calls
import RecipeCard from "../components/RecipeCard"; // Component to display each recipe
import Pagination from "../components/Pagination"; // Pagination component

import Link from "next/link";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // For pagination
  const [totalPages, setTotalPages] = useState(1); // Total pages for pagination
  const [hasMore, setHasMore] = useState(true); // Track if there are more pages
  const [recipeImages, setRecipeImages] = useState({}); // Store images for each recipe
  const [selectedNation, setSelectedNation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [sectionRecipes, setSectionRecipes] = useState({
    nation: [],
    category: [],
    subcategory: [],
  }); // Store section-wise recipes

  // Search term state
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch Nations, Categories, and Subcategories for initial section data
  useEffect(() => {
    const getSectionData = async () => {
      setLoading(true);
      try {
        // Step 1: Fetch Nations
        const nationsData = await fetchNations();

        // Step 2: Fetch Categories
        const categoriesData = await fetchCategories();

        // Step 3: Fetch Subcategories
        const subcategoriesData = await fetchSubcategories();

        // Randomly select one from each list
        const randomNation = nationsData.results[Math.floor(Math.random() * nationsData.results.length)];
        const randomCategory = categoriesData.results[Math.floor(Math.random() * categoriesData.results.length)];
        const randomSubcategory = subcategoriesData.results[Math.floor(Math.random() * subcategoriesData.results.length)];

        // Store selected values for display or use later
        setSelectedNation(randomNation);
        setSelectedCategory(randomCategory);
        setSelectedSubcategory(randomSubcategory);

        // Step 4: Fetch recipes based on selected Nation, Category, and Subcategory
        const nationData = await fetchRecipes(page, "", "", randomNation);
        const categoryData = await fetchRecipes(page, randomCategory, "", "");
        const subcategoryData = await fetchRecipes(page, "", randomSubcategory, "");

        // Store the recipes for display
        const nation = nationData.results.slice(0, 3), // Limiting to 3 items
        category = categoryData.results.slice(0, 3),
        subcategory = subcategoryData.results.slice(0, 3);
        setSectionRecipes({
          nation,
          category,
          subcategory,
        });

        // Fetch images for each recipe (just the first image for now)
        const images = {};
        [...nation, ...category, ...subcategory].forEach(async (recipe) => {
          const recipeImageData = await fetchRecipeImages(recipe.id);
          images[recipe.id] = recipeImageData.results.length > 0 ? recipeImageData.results[0].url : "/images/empty.jpg"; // Fallback to empty.jpg if no image
        });

        setRecipeImages(images);

        setHasMore(nationData.results.length === 10); // Check if there are more recipes
        setTotalPages(1); // Assuming only 1 page for now, adjust if needed
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getSectionData();
  }, [page]); // Fetch data on page change

  const handleSearch = async () => {
    setLoading(true);
    try {
      const searchData = await fetchRecipes(page, "", "", searchTerm); // Search with term
      setRecipes(searchData.results); // Update the recipes
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-500 via-teal-400 to-teal-300">
      <header className="flex items-center justify-between p-6 bg-white shadow-md">
        <div className="flex items-center space-x-2">
          <img src="/images/leaf-icon.png" alt="Chop Logo" className="w-12 h-12" />
          <h1 className="text-3xl font-bold text-teal-600">Chop</h1>
        </div>
        <nav className="flex space-x-6 text-gray-700">
          <a href="/" className="hover:text-teal-600">Home</a>
          <a href="/explore" className="hover:text-teal-600">Explore</a>
          <a href="/about" className="hover:text-teal-600">About</a>
        </nav>
        <div className="flex items-center space-x-4">
          <button className="bg-teal-600 text-white px-4 py-2 rounded-full hover:bg-teal-500 transition">Sign Up</button>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto flex flex-col items-center gap-12 p-8">
        <div className="w-full flex justify-center space-x-4 mb-8">
          {/* Search Bar and Filter Icon */}
          <div className="flex items-center border border-teal-500 rounded-full px-4 py-2 space-x-2 w-1/2 sm:w-1/3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-full focus:outline-none"
              placeholder="Search for recipes..."
            />
            <button className="bg-teal-600 text-white p-2 rounded-full hover:bg-teal-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 18l6-6-6-6" />
              </svg>
            </button>
            <button className="bg-teal-600 text-white p-2 rounded-full hover:bg-teal-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 3v18M18 3v18" />
              </svg>
            </button>
          </div>
        </div>
        <div className="w-full mb-12">
          <h2 className="text-2xl font-bold text-teal-600 mb-4">Discover Recipes by Section</h2>

          {/* Nation Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-teal-600 mb-4">Nation: {selectedNation?.name}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {sectionRecipes.nation.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} recipeImage={recipeImages[recipe.id]} />
              ))}
            </div>
            <Link href="/results/nation" passHref>
              <button className="mt-4 text-teal-600 hover:text-teal-700">See More</button>
            </Link>
          </div>

          {/* Category Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-teal-600 mb-4">Category: {selectedCategory?.name}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {sectionRecipes.category.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} recipeImage={recipeImages[recipe.id]} />
              ))}
            </div>
            <Link href="/results/category" passHref>
              <button className="mt-4 text-teal-600 hover:text-teal-700">See More</button>
            </Link>
          </div>

          {/* Subcategory Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-teal-600 mb-4">Subcategory: {selectedSubcategory?.name}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {sectionRecipes.subcategory.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} recipeImage={recipeImages[recipe.id]} />
              ))}
            </div>
            <Link href="/results/subcategory" passHref>
              <button className="mt-4 text-teal-600 hover:text-teal-700">See More</button>
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {loading && <p className="text-lg text-white">Loading recipes...</p>}
        {error && <p className="text-red-400 text-lg">{error}</p>}

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          hasMore={hasMore}
        />
      </main>

      <footer className="py-4 text-center text-gray-500">
        <p className="text-sm">Powered by ChopAPI</p>
      </footer>
    </div>
  );
}





