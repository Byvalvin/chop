"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const emptyImage = '/images/empty.jpg';

const checkImageExists = async (imageUrl, setImageUrl, setImageValid) => {
  try {
    const res = await fetch(imageUrl, { method: 'HEAD' }); // Use HEAD request to check if the image exists
    if (res.ok) {
      setImageUrl(imageUrl); // If the image is valid, set the proxy URL
      setImageValid(true);
    } else {
      setImageValid(false);
    }
  } catch (error) {
    console.error('Error checking image:', error); // Log the error
    setImageValid(false); // Fall back to placeholder on error
  }
};

const RecipeCard = ({ recipe, recipeImage }) => {
  const [imageValid, setImageValid] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (recipeImage && recipeImage !== emptyImage) {
      checkImageExists(recipeImage, setImageUrl, setImageValid);
    } else {
      setImageValid(false);
    }
  }, [recipeImage]);

  return (
    <div className="bg-white rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out">
      <Image
        src={imageValid && imageUrl ? imageUrl : emptyImage}
        alt={`image of ${recipe.name}`}
        placeholder="empty" 
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
