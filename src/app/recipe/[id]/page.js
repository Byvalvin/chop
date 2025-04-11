'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import useRecipeImage from '@/hooks/useRecipeImage';
import {
  fetchRecipe,
  fetchRecipeIngredients,
  fetchRecipeInstructions,
  fetchRecipeImages,
  fetchRecipeCategories,
  fetchRecipeSubcategories,
  fetchRecipeNames,
} from '@/utils/api';

export default function RecipeDetailPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [aliases, setAliases] = useState([]);
  const [loading, setLoading] = useState(true);

  const imageUrl = useRecipeImage(id);

  useEffect(() => {
    const loadRecipeDetails = async () => {
      try {
        const baseData = await fetchRecipe(id);
        const [ingredients, instructions, categories, subcategories, aliases] = await Promise.all([
          fetchRecipeIngredients(id),
          fetchRecipeInstructions(id),
          fetchRecipeCategories(id),
          fetchRecipeSubcategories(id),
          fetchRecipeNames(id),
        ]);

        setRecipe(baseData);
        setIngredients(ingredients);
        setInstructions(instructions);
        setCategories(categories);
        setSubcategories(subcategories);
        setAliases(aliases);
      } catch (err) {
        console.error('Failed to load recipe:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadRecipeDetails();
  }, [id]);

  if (loading) return <p className="p-8 text-center">Loading recipe...</p>;
  if (!recipe) return <p className="p-8 text-center">Recipe not found.</p>;

  return (
    <div className="max-w-screen-lg mx-auto p-8 space-y-6">
      {/* Title */}
      <h1 className="text-4xl font-bold text-teal-700">{recipe.name}</h1>

      {/* Main Image */}
      <img
        src={imageUrl}
        alt={recipe.name}
        className="w-full h-96 object-cover rounded-lg shadow-lg"
      />

      {/* Description */}
      <p className="text-lg text-gray-700">{recipe.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-2">
        {categories.map((cat) => (
          <span key={cat} className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm">{cat}</span>
        ))}
        {subcategories.map((sub) => (
          <span key={sub} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">{sub}</span>
        ))}
      </div>

      {/* Ingredients */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-2">Ingredients</h2>
        <ul className="list-disc ml-6 text-gray-700 space-y-1">
          {ingredients.map((item, index) => (
            <li key={index}>
              {item.quantity} {item.unit} {item.name}
            </li>
          ))}
        </ul>
      </section>

      {/* Instructions */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-2">Instructions</h2>
        <ol className="list-decimal ml-6 text-gray-700 space-y-2">
          {instructions.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </section>

      {/* Meta Info */}
      <section className="text-sm text-gray-500 mt-6 space-y-1">
        <p><strong>Nation ID:</strong> {recipe.nationId}</p>
        <p><strong>Region ID:</strong> {recipe.regionId}</p>
        <p><strong>Time:</strong> {recipe.time} minutes</p>
        <p><strong>Cost:</strong> ${recipe.cost}</p>
        {aliases.length > 0 && (
          <p><strong>Also known as:</strong> {aliases.join(', ')}</p>
        )}
      </section>
    </div>
  );
}
