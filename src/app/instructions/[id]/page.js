'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { fetchRecipeInstructions, fetchRecipe, fetchNation } from '@/utils/api'; 
import { toTitleCase } from '@/utils/string';
import { getCountryCode } from '@/utils/countryUtils';
import { recipe404 } from '@/app/recipe/[id]/page'; // Import the 404 page
import RecipeInstructionSkeleton from '@/components/skeletons/RecipeInstructionSkeletion';
import PageContainer from '@/components/PageContainer';
import Link from 'next/link'; // Import Link component


export default function InstructionsPage() {
  const { id } = useParams();  // Extract route params using useParams
  const sp = useSearchParams();
  const queryName = sp.get("name"), queryNation = sp.get("nation");

  const [instructions, setInstructions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recipeName, setRecipeName] = useState(queryName || '');  // Fallback for name
  const [nation, setNation] = useState(queryNation || '');  // Fallback for nation
  const [recipeNotFound, setRecipeNotFound] = useState(false); // Flag to check if recipe is not found

  const [expandedSteps, setExpandedSteps] = useState({});

  const toggleStep = (index) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Fetch recipe instructions
  useEffect(() => {
    const fetchInstructions = async () => {
      setLoading(true);
      try {
        const instructionsData = await fetchRecipeInstructions(id);
        setInstructions(instructionsData || []);
      } catch (error) {
        console.error('Failed to fetch instructions:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRecipeDetails = async () => {
      if (id && (!queryName || !queryNation)) {
        try {
          const recipeData = await fetchRecipe(id);
          if (!recipeData || !recipeData.id) {
            setRecipeNotFound(true);  // If the recipe doesn't exist
            return; // Exit early if no recipe is found
          }
          setRecipeName(recipeData.name || '');
          // Fetch the nation using the nationId from the recipe data
          const nationData = await fetchNation(recipeData.nationId);
          setNation(nationData || '');
        } catch (error) {
          console.error('Failed to fetch recipe details:', error);
          setRecipeNotFound(true);  // Set the flag if there was an error fetching the recipe
        }
      }
    };

    // If recipe data is found, fetch instructions and details
    if (!recipeNotFound) {
      fetchInstructions();
      fetchRecipeDetails();
    }
  }, [id, queryName, queryNation, recipeNotFound]);


  if (loading) return <RecipeInstructionSkeleton/>;  // If loading, show a loading message
  if (recipeNotFound) return recipe404(); // If the recipe is not found, show the 404 page
  const flagCode = getCountryCode(nation);
  return (
    <div className="min-h-screen bg-[url('/images/bg/light1.png')] bg-cover bg-center bg-no-repeat">
        <PageContainer>
          <div className="max-w-screen-lg mx-auto p-8 bg-[var(--glass-bg)] backdrop-blur-lg border border-[var(--glass-border)] shadow-xl rounded-2xl">
            {/* Title Section */}
            <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                {flagCode && (
                  <img
                    src={`https://flagcdn.com/w80/${flagCode}.png`}
                    alt={`${nation} flag`}
                    className="w-10 h-6 sm:w-12 sm:h-8 rounded-sm shadow-sm"
                    title={toTitleCase(nation)}
                  />
                )}
                <h1 className="text-3xl sm:text-4xl font-bold">{recipeName}</h1>
              </div>
            </header>

            <section className="my-8">
              <p className="text-lg">
                Make sure you have your 
                <Link 
                  href={`/recipe/${id}#ingredients`} // Link to the recipe page with ingredients section anchor
                  className="text-[var(--primary)] underline ml-1 mr-1" // Adding left and right margin
                >
                  ingredients
                </Link> 
                ready before you start!
              </p>
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

          </div>
      </PageContainer>
    </div>
  );
}
