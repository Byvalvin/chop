"use client";

import Image from "next/image";
import useRecipeImage from "../hooks/useRecipeImage";

const RecipeCard = ({ recipe }) => {
  const imageUrl = useRecipeImage(recipe.id);

  return (
    <div className="bg-white rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out">
      <Image
        src={imageUrl}
        alt={`Image of ${recipe.name}`}
        width={500}
        height={300}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800">{recipe.name}</h2>
        <p className="text-sm text-gray-600 mt-2">{recipe.description}</p>
      </div>
    </div>
  );
};

export default RecipeCard;
