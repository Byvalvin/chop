"use client";

import Image from "next/image";
import useRecipeImage from "../hooks/useRecipeImage";
import Link from 'next/link';

const RecipeCard = ({ recipe }) => {
  const imageUrl = useRecipeImage(recipe.id);

  return (
<Link href={`/recipe/${recipe.id}`}>
  <div className="bg-white rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out cursor-pointer flex flex-col h-[400px]">
    <div className="relative w-full h-48">
      <Image
        src={imageUrl}
        alt={`Image of ${recipe.name}`}
        fill
        className="object-cover rounded-t-lg"
      />
    </div>
    <div className="p-6 flex-1 flex flex-col justify-between">
      <h2 className="text-2xl font-semibold text-gray-800 line-clamp-2">{recipe.name}</h2>
      <p className="text-sm text-gray-600 mt-2 line-clamp-3">{recipe.description}</p>
    </div>
  </div>
</Link>


  );
};

export default RecipeCard;


