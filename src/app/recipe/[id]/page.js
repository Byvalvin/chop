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

import { FaClock, FaDollarSign, FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Importing arrow icons} from 'react-icons/fa';
import { toTitleCase } from '@/utils/string';
import PageContainer from '@/components/PageContainer';

import RecipeDetailSkeleton from "@/components/skeletons/RecipeDetailSkeleton";
import Link from 'next/link'; // Import Link component


const recipe404 = () => 
    <div className="min-h-screen bg-[url('/images/bg/light1.png')] bg-cover bg-center bg-no-repeat flex items-center justify-center px-4">
      <div className="bg-[var(--glass-bg)] backdrop-blur-lg border border-[var(--glass-border)] shadow-xl rounded-2xl max-w-xl w-full p-10 text-center space-y-6">
        <h1 className="text-4xl font-bold text-[var(--other-text)]">🥄 404 - Recipe Not Found</h1>
        <p className="text-[var(--other-text)] text-lg">
          Sorry! We couldn&apos;t find a recipe with that ID. It might have been removed, renamed, or just doesn&apos;t exist.
        </p>

        {/*Redirect user buttons*/}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
          <Link href="/" passHref className="inline-block bg-[var(--secondary-dark)] hover:bg-[var(--primary)] text-[var(--main-text)] font-semibold py-2 px-6 rounded-md shadow transition">
            ← Back to Home
          </Link>
          <Link href="/explore" passHref className="inline-block bg-white/80 hover:bg-[var(--main-text)] text-[var(--secondary-dark)] hover:text-[var(--primary)] font-semibold py-2 px-6 rounded-md border border-[var(--secondary-dark)] transition shadow">
              🍳 Browse Recipes
          </Link>
        </div>
      </div>
    </div>;


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
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);


  const imageUrl = useRecipeImage(id);

  const toggleStep = (index) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  const toggleDescription = () => {
    setIsDescriptionOpen(prevState => !prevState);
  };
  

  useEffect(() => {
    const loadRecipeDetails = async () => {
      try {
        const baseData = await fetchRecipe(id);
    
        // If no baseData (bad ID or fetch failed), exit early
        if (!baseData || !baseData.id) {
          setRecipe(null);
          return;
        }
    
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
        setIngredients(ingredients ?? []);
        setInstructions(instructions ?? []);
        setCategories(categories ?? []);
        setSubcategories(subcategories ?? []);
        setAliases(aliases ?? []);
      } catch (err) {
        console.error('Failed to load recipe:', err);
        setRecipe(null); // Ensures graceful fallback
      } finally {
        setLoading(false);
      }
    };
    
    if (id) loadRecipeDetails();
  }, [id]);

  if (loading) return <RecipeDetailSkeleton />;
  if (!recipe) return recipe404();

  const flagCode = getCountryCode(nationName);

  return (
    <div className="min-h-screen bg-[url('/images/bg/light1.png')] bg-cover bg-center bg-no-repeat">
    <PageContainer>
      
    <article className="bg-[var(--glass-bg)] backdrop-blur-lg border border-[var(--glass-border)] shadow-lg
      rounded-2xl shadow-md max-w-screen-lg mx-auto p-8 space-y-10 text-[1.05rem] leading-relaxed text-[var(--other-text)]">

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
            <FaClock className="text-[var(--secondary-dark)]" />
            <span>{recipe.time} minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <FaDollarSign className="text-green-600" />
            <span>{recipe.cost} USD</span>
          </div>
          {regionName && (
            <div className="flex items-center gap-2 capitalize text-[var(--other-text)]">
              <span className="text-xl">{getRegionEmoji(regionName)}</span>
              <span>{regionName}</span>
            </div>
          )}
        </section>

        {/* CTA Button */}
        <div className="sticky top-4 z-10">
          <Link href="#instructions-heading" className="inline-block bg-[var(--secondary-dark)] hover:bg-[var(--secondary)] text-[var(--main-text)] font-medium py-2 px-4 rounded-md shadow transition">
              🍽️ Start Cooking
          </Link>
        </div>

        {/* Image */}
        <figure className="w-full h-96 relative rounded-lg overflow-hidden shadow-md">
          <img
            src={imageUrl}
            alt={`Dish of ${recipe.name}`}
            className="w-full h-full object-cover"
          />
        </figure>

        {/* Recipe Description */}
        {recipe.description && (
          <section
            aria-labelledby="description-heading"
            className="space-y-4"
          >
            <div className="flex justify-end items-center"> {/* Aligns button to the right */}
              <button
                className="text-sm text-[var(--secondary-dark)] hover:text-[var(--primary)] flex items-center gap-2"
                onClick={toggleDescription}
              >
                {isDescriptionOpen ? (
                  <FaChevronUp className="text-[var(--secondary-dark)]" />
                ) : (
                  <FaChevronDown className="text-[var(--secondary-dark)]" />
                )}
              </button>
            </div>
            {isDescriptionOpen && (
              <p className="text-[var(--other-text)] text-base md:text-lg mt-2">
                {recipe.description}
              </p>
            )}
          </section>
        )}

        {/* Categories */}
        <section aria-label="Tags">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <span
                key={cat}
                className="bg-[var(--recipe-detail-category)] text-[var(--recipe-detail-category-text)] px-3 py-1 rounded-full text-sm"
              >
                {cat}
              </span>
            ))}
            {subcategories.map((sub) => (
              <span
                key={sub}
                className="bg-[var(--recipe-detail-subcategory)] text-[var(--recipe-detail-subcategory-text)] px-3 py-1 rounded-full text-sm"
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
                  className="accent-[var(--secondary-dark)] w-4 h-4"
                />
                <label
                  htmlFor={`ingredient-${index}`}
                  className={`cursor-pointer select-none transition ${
                    document?.getElementById(`ingredient-${index}`)?.checked ? 'line-through text-[var(--sub-text)]' : ''
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
                  className="bg-[var(--bg-light)] border-l-4 border-[var(--secondary)] rounded-md shadow-sm"
                >
                  <button
                    className="w-full text-left px-4 py-3 flex justify-between items-center font-semibold text-[var(--secondary-dark)] hover:bg-[var(--sub-text)] transition"
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
                      className="px-4 pb-4 text-[var(--other-text)]"
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
        {aliases.length > 1 && (
          <section
            aria-label="Aliases"
            className="text-sm text-[var(--secondary-dark)] pt-4"
          >
            <p>
              <strong>Also known as:</strong> {aliases.slice(1).join(', ')}
            </p>
          </section>
        )}
      </article>
    </PageContainer>
    </div>
  );
}
