"use client";

import Image from "next/image";
import useRecipeImage from "../hooks/useRecipeImage";
import Link from 'next/link';

const RecipeCard = ({ recipe, variant = "light" }) => {
  const imageUrl = useRecipeImage(recipe.id);

  const isDark = variant === "dark";

  const baseCardClasses = `rounded-lg shadow-md border-b-4 transition-shadow duration-300 ease-in-out cursor-pointer flex flex-col h-[400px] ${
    isDark
      ? "bg-teal-900 border-yellow-300 text-white hover:shadow-teal-700/50"
      : "bg-white border-yellow-400 text-gray-800 hover:shadow-lg"
  }`;

  const titleClasses = `text-2xl font-semibold line-clamp-2 ${
    isDark ? "text-white" : "text-gray-800"
  }`;

  const descClasses = `text-sm mt-2 line-clamp-3 ${
    isDark ? "text-gray-200" : "text-gray-600"
  }`;

  return (
    <Link href={`/recipe/${recipe.id}`}>
      <div className={baseCardClasses}>
        <div className="relative w-full h-48">
          <Image
            src={imageUrl}
            alt={`Image of ${recipe.name}`}
            fill
            className="object-cover rounded-t-lg"
          />
        </div>
        <div className="p-6 flex-1 flex flex-col justify-between">
          <h2 className={titleClasses}>{recipe.name}</h2>
          <p className={descClasses}>{recipe.description}</p>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;