import Link from "next/link";
import RecipeCard from "../components/RecipeCard"; // Component to display each recipe
import { FaGlobe, FaTags, FaFolder } from 'react-icons/fa'; // Import icons for section types

// SectionCard Component (Reusable)
const SectionCard = ({ title, sectionRecipes, recipeImages, path, bgColor = "bg-white", titleColor = "text-teal-600", sectionType, selectedValue }) => {
  // Function to return the correct icon based on section type
  const getIcon = (type) => {
    switch (type) {
      case "nation":
        return <FaGlobe className="text-teal-600 text-2xl" />; // Slightly larger icon size
      case "category":
        return <FaTags className="text-teal-600 text-2xl" />; // Slightly larger icon size
      case "subcategory":
        return <FaFolder className="text-teal-600 text-2xl" />; // Slightly larger icon size
      default:
        return null;
    }
  };

  // Capitalize the first letter of selectedValue
  const capitalizeFirstLetter = (value) => value? value.charAt(0).toUpperCase()+value.slice(1) : value;

  return (
    <div className={`mb-12 ${bgColor} p-8 rounded-lg shadow-lg`}>
      {/* Title with improved styling */}
      <h3 className={`text-4xl font-extrabold ${titleColor} mb-12 text-center bg-clip-text bg-gradient-to-r from-teal-500 to-teal-300 relative flex justify-between items-center`}>
        {/* Section name */}
        <span className="text-teal-800">{title}</span>
        
        {/* Icon between section name and selected value */}
        <span className="mx-4 flex-grow text-center">{getIcon(sectionType)}</span> {/* Icon now centered */}

        {/* Selected value */}
        <span className="text-teal-600">{capitalizeFirstLetter(selectedValue)}</span>

        {/* Title underline (line) */}
        <span className="absolute left-0 bottom-[-8px] w-full h-[6px] bg-teal-600 mt-8 rounded-full"></span> {/* Thicker, rounded line with full width */}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {sectionRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} recipeImage={recipeImages[recipe.id]} />
        ))}
      </div>

      {/* Right-aligned "See More" Button */}
      <div className="flex justify-end mt-8">
        <Link href={path} passHref>
          <button className="text-lg font-medium text-white border-2 border-teal-600 bg-teal-600 hover:bg-teal-500 hover:text-white transition-all py-2 px-6 rounded-full shadow-lg hover:shadow-lg">
            See More
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SectionCard;
