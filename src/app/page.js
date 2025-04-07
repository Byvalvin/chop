"use client";

import { useState, useEffect } from "react";
import { fetchRecipes, fetchRecipeImages, fetchNations, fetchCategories, fetchSubcategories } from "../utils/api"; // Utility function to handle API calls
import SectionCard from "../components/Section";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // For pagination
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

      // Try to get data from localStorage
      const storedData = localStorage.getItem("sectionData");
      console.log(storedData);
      //localStorage.clear();

      if (storedData) {
        // If data exists, use it from localStorage
        const parsedData = JSON.parse(storedData);
        setSectionRecipes(parsedData.sectionRecipes);
        setSelectedNation(parsedData.selectedNation);
        setSelectedCategory(parsedData.selectedCategory);
        setSelectedSubcategory(parsedData.selectedSubcategory);
        setRecipeImages(parsedData.recipeImages);
        setHasMore(parsedData.hasMore);
        setLoading(false);
      } else {
        // If no data in localStorage, fetch data from the API
        try {
          const nationsData = await fetchNations();
          const categoriesData = await fetchCategories();
          const subcategoriesData = await fetchSubcategories();

          const randomNation = nationsData.results[Math.floor(Math.random() * nationsData.results.length)];
          const randomCategory = categoriesData.results[Math.floor(Math.random() * categoriesData.results.length)];
          const randomSubcategory = subcategoriesData.results[Math.floor(Math.random() * subcategoriesData.results.length)];

          setSelectedNation(randomNation);
          setSelectedCategory(randomCategory);
          setSelectedSubcategory(randomSubcategory);

          const nationData = await fetchRecipes(page, "", "", randomNation.name);
          const categoryData = await fetchRecipes(page, randomCategory.name, "", "");
          const subcategoryData = await fetchRecipes(page, "", randomSubcategory.name, "");

          const nation = nationData.results.slice(0, 3),
          category = categoryData.results.slice(0, 3),
          subcategory = subcategoryData.results.slice(0, 3);

          const sections = { nation, category, subcategory };

          setSectionRecipes(sections);

          // Create an array of promises for fetching recipe images
          const imagePromises = [...nationData.results, ...categoryData.results, ...subcategoryData.results].map(async (recipe) => {
            const recipeImageData = await fetchRecipeImages(recipe.id);
            return {
              [recipe.id]: recipeImageData.results.length > 0 ? recipeImageData.results[0].url : "/images/empty.jpg"
            };
          });

          // Wait for all image fetches to complete
          const imagesArray = await Promise.all(imagePromises);
          
          // Convert array of objects into a single object
          const images = imagesArray.reduce((acc, imgObj) => {
            return { ...acc, ...imgObj };
          }, {});
          console.log(images);

          setRecipeImages(images);
          setHasMore(nationData.results.length === 10);

          // Save fetched data to localStorage
          localStorage.setItem("sectionData", JSON.stringify({
            sectionRecipes: sections,
            selectedNation: randomNation,
            selectedCategory: randomCategory,
            selectedSubcategory: randomSubcategory,
            recipeImages: images,
            hasMore
          }));

        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    getSectionData();
  }, [page]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const searchData = await fetchRecipes(page, "", "", searchTerm);
      setRecipes(searchData.results);
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
          {/* Search Bar */}
          <div className="flex items-center border border-teal-500 rounded-full px-4 py-2 space-x-2 w-1/2 sm:w-1/3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-full focus:outline-none"
              placeholder="Search for recipes..."
            />
            <button
              className="bg-teal-600 text-white p-2 rounded-full hover:bg-teal-500"
              onClick={handleSearch}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        <div className="w-full">
          <h2 className="text-2xl font-bold text-teal-600 mb-4">Discover Recipes by Section</h2>

          {/* Sections */}
          <SectionCard 
            title={`Nation: ${selectedNation?.name}`}
            sectionRecipes={sectionRecipes.nation}
            recipeImages={recipeImages}
            path="/results/nation"
            bgColor="bg-teal-50" // Custom background color for this section
            titleColor="text-teal-700" // Custom title color
          />
          <SectionCard 
            title={`Category: ${selectedCategory?.name}`}
            sectionRecipes={sectionRecipes.category}
            recipeImages={recipeImages}
            path="/results/category"
            bgColor="bg-teal-100" // Custom background color for this section
            titleColor="text-teal-800" // Custom title color
          />
          <SectionCard 
            title={`Subcategory: ${selectedSubcategory?.name}`}
            sectionRecipes={sectionRecipes.subcategory}
            recipeImages={recipeImages}
            path="/results/subcategory"
            bgColor="bg-teal-200" // Custom background color for this section
            titleColor="text-teal-900" // Custom title color
          />

        </div>

        {/* Loading State */}
        {loading && <p className="text-lg text-white">Loading recipes...</p>}
        {error && <p className="text-red-400 text-lg">{error}</p>}
      </main>

      <footer className="py-4 text-center text-gray-500">
        <p className="text-sm">Powered by ChopAPI</p>
      </footer>
    </div>
  );
}
