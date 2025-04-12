'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import useRecipeImage from '@/hooks/useRecipeImage';
import {
  fetchRecipe,
  fetchRecipeIngredients,
  fetchRecipeInstructions,
  fetchRecipeCategories,
  fetchRecipeSubcategories,
  fetchRecipeNames,
  fetchNation,
  fetchRegion
} from '@/utils/api';
import { getCountryCode, getRegionEmoji } from '@/utils/countryUtils';

import { FaClock, FaDollarSign } from 'react-icons/fa';
import { toTitleCase } from '@/utils/string';

export default function RecipeDetailPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [aliases, setAliases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nationName, setNationName] = useState('');
  const [regionName, setRegionName] = useState('');
  const [expandedSteps, setExpandedSteps] = useState({});

  const imageUrl = useRecipeImage(id);

  const toggleStep = (index) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    const loadRecipeDetails = async () => {
      try {
        const baseData = await fetchRecipe(id);
        const [
          ingredients,
          instructions,
          categories,
          subcategories,
          aliases,
          nationName,
          regionName
        ] = await Promise.all([
          fetchRecipeIngredients(id),
          fetchRecipeInstructions(id),
          fetchRecipeCategories(id),
          fetchRecipeSubcategories(id),
          fetchRecipeNames(id),
          fetchNation(baseData.nationId),
          fetchRegion(baseData.regionId),
        ]);

        setNationName(nationName);
        setRegionName(regionName);
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

  const flagCode = getCountryCode(nationName);

  return (
    <article className="max-w-screen-lg mx-auto p-8 space-y-10 text-[1.05rem] leading-relaxed text-gray-800">
      {/* Title Section */}
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          {flagCode && (
            <img
              src={`https://flagcdn.com/w80/${flagCode}.png`}
              alt={`${nationName} flag`}
              className="w-10 h-6 md:w-12 md:h-8 rounded-sm shadow-sm"
              title={toTitleCase(nationName)}
            />
          )}
          <h1 className="text-3xl md:text-4xl font-bold">{recipe.name}</h1>
        </div>
      </header>

      {/* Info Row */}
      <section className="flex flex-wrap gap-6 text-base md:text-lg">
        <div className="flex items-center gap-2">
          <FaClock className="text-teal-600" />
          <span>{recipe.time} minutes</span>
        </div>
        <div className="flex items-center gap-2">
          <FaDollarSign className="text-green-600" />
          <span>{recipe.cost} USD</span>
        </div>
        {regionName && (
          <div className="flex items-center gap-2 capitalize text-gray-700">
            <span className="text-xl">{getRegionEmoji(regionName)}</span>
            <span>{regionName}</span>
          </div>
        )}

      </section>

      {/* CTA Button */}
      <div className="sticky top-4 z-10">
        <a
          href="#instructions-heading"
          className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-md shadow transition"
        >
          🍽️ Start Cooking
        </a>
      </div>


      {/* Image */}
      <figure className="w-full h-96 relative rounded-lg overflow-hidden shadow-md">
        <img
          src={imageUrl}
          alt={`Dish of ${recipe.name}`}
          className="w-full h-full object-cover"
        />
      </figure>

      {/* Categories */}
      <section aria-label="Tags">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <span
              key={cat}
              className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm"
            >
              {cat}
            </span>
          ))}
          {subcategories.map((sub) => (
            <span
              key={sub}
              className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm"
            >
              {sub}
            </span>
          ))}
        </div>
      </section>

      {/* Ingredients */}
      <section aria-labelledby="ingredients-heading" className="space-y-4">
        <h2
          id="ingredients-heading"
          className="text-2xl font-semibold"
        >
          Ingredients
        </h2>
        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
          {ingredients.map((item, index) => (
            <li key={index} className="flex items-center gap-3">
              <input
                type="checkbox"
                id={`ingredient-${index}`}
                className="accent-teal-600 w-4 h-4"
              />
              <label
                htmlFor={`ingredient-${index}`}
                className={`cursor-pointer select-none transition ${
                  document?.getElementById(`ingredient-${index}`)?.checked ? 'line-through text-gray-400' : ''
                }`}
              >
                <strong>
                  {item.quantity} {item.unit}
                </strong>{' '}
                {item.name}
              </label>
            </li>
          ))}
        </ul>
      </section>

      {/* Instructions */}
      <section
        aria-labelledby="instructions-heading"
        className="space-y-4"
      >
        <h2
          id="instructions-heading"
          className="text-2xl font-semibold"
        >
          Instructions
        </h2>
        <ol className="space-y-4">
          {instructions.map((step, index) => {
            const isOpen = expandedSteps[index];
            return (
              <li
                key={index}
                className="bg-gray-50 border-l-4 border-teal-500 rounded-md shadow-sm"
              >
                <button
                  className="w-full text-left px-4 py-3 flex justify-between items-center font-semibold text-teal-700 hover:bg-gray-100 transition"
                  onClick={() => toggleStep(index)}
                  aria-expanded={isOpen}
                  aria-controls={`step-${index}`}
                >
                  <span>Step {index + 1}</span>
                  <span className="text-lg">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div
                    id={`step-${index}`}
                    className="px-4 pb-4 text-gray-700"
                  >
                    {step}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      {/* Aliases */}
      {aliases.length > 0 && (
        <section
          aria-label="Aliases"
          className="text-sm text-gray-500 pt-4"
        >
          <p>
            <strong>Also known as:</strong> {aliases.join(', ')}
          </p>
        </section>
      )}
    </article>
  );
}
