import Link from "next/link";
import RecipeCard from "../components/RecipeCard"; // Component to display each recipe

// SectionCard Component (Reusable)
const SectionCard = ({ title, sectionRecipes, recipeImages, path }) => (
    <div className="mb-12">
      <h3 className="text-xl font-semibold text-teal-600 mb-4">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {sectionRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} recipeImage={recipeImages[recipe.id]} />
        ))}
      </div>
      <Link href={path} passHref>
        <button className="mt-4 text-teal-600 hover:text-teal-700 text-lg font-medium">See More</button>
      </Link>
    </div>
  );

  export default SectionCard;