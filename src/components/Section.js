import Link from "next/link";
import RecipeCard from "../components/RecipeCard"; // Component to display each recipe
  
// SectionCard Component (Reusable)
const SectionCard = ({ title, sectionRecipes, recipeImages, path, bgColor = "bg-white", titleColor = "text-teal-600" }) => (
    <div className={`mb-12 ${bgColor} p-6 rounded-lg shadow-lg`}>
        {/* Title with improved styling */}
        <h3 className={`text-4xl font-extrabold ${titleColor} mb-6 text-left bg-clip-text bg-gradient-to-r from-teal-500 to-teal-300`}>
        {title}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {sectionRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} recipeImage={recipeImages[recipe.id]} />
        ))}
        </div>

        {/* Right-aligned "See More" Button */}
        <div className="flex justify-end mt-6">
        <Link href={path} passHref>
        {/* className="mt-6 w-full sm:w-auto shadow-md hover:shadow-lg" */}
            <button className="text-lg font-medium text-white border-2 border-teal-600 bg-teal-600 hover:bg-teal-500 hover:text-white transition-all py-2 px-6 rounded-full shadow-lg hover:shadow-lg">
            See More
            </button>
        </Link>
        </div>
    </div>
);

export default SectionCard;
  