"use client";

import { useState, useEffect } from "react";
import { fetchRecipes, fetchRecipeImages, fetchNations, fetchCategories, fetchSubcategories } from "../utils/api"; // Utility function to handle API calls
import SectionCard from "../components/Section";
import Navbar from "../components/Navbar"; // Import the Navbar component

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
      {/* <Navbar /> Include Navbar here */}
      
      <main className="max-w-screen-xl mx-auto flex flex-col items-center gap-12 p-8">
        <div className="w-full">
          {/* Sections */}
          <SectionCard 
            title={`Nation `}
            sectionRecipes={sectionRecipes.nation}
            recipeImages={recipeImages}
            path="/results/nation"
            sectionType="nation"
            bgColor="bg-teal-100"
            titleColor="text-teal-800"
            selectedValue={selectedNation?.name}
          />

          <SectionCard 
            title={`Category `}
            sectionRecipes={sectionRecipes.category}
            recipeImages={recipeImages}
            path="/results/category"
            sectionType="category"
            bgColor="bg-teal-200"
            titleColor="text-teal-900"
            selectedValue={selectedCategory?.name}
          />

          <SectionCard 
            title={`Subcategory `}
            sectionRecipes={sectionRecipes.subcategory}
            recipeImages={recipeImages}
            path="/results/subcategory"
            sectionType="subcategory"
            bgColor="bg-teal-300"
            titleColor="text-teal-900"
            selectedValue={selectedSubcategory?.name}
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
