"use client";

import Image from "next/image";
import useRecipeImage from "../hooks/useRecipeImage";
import Link from 'next/link';

const RecipeCard = ({ recipe }) => {
  const imageUrl = useRecipeImage(recipe.id);

  const baseCardClasses = `rounded-lg shadow-md border-b-4 transition-shadow duration-300 ease-in-out cursor-pointer flex flex-col h-auto sm:h-[400px] 
    bg-[var(--primary)] border-[var(--primary-cmpmt)] text-[var(--main-text)] hover:shadow-teal-700`; // Made height auto on smaller screens
  const titleClasses = `text-xl sm:text-2xl font-semibold line-clamp-2 text-[var(--main-text)]`; // Responsively adjusted text size
  const descClasses = `text-sm sm:text-base mt-2 line-clamp-3 text-[var(--sub-text)]`; // Adjusted description size on mobile

  return (
    <Link href={`/recipe/${recipe.id}`} aria-label={`View recipe for ${recipe.name}`}>
      <div className={baseCardClasses}>
        <div className="relative w-full h-32 sm:h-48">  {/* Made image container height responsive */}
          <Image
            src={imageUrl}
            alt={`Image of ${recipe.name}`}
            fill
            className="object-cover rounded-t-lg"
            title={`Image of ${recipe.name}`} // Added title for the image
          />
        </div>
        <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between"> {/* Adjusted padding for small screens */}
          <h2 className={titleClasses}>{recipe.name}</h2>
          <p className={descClasses}>{recipe.description}</p>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
