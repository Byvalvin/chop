'use client';

import { useState, useEffect } from 'react';
import { 
  FaClock, FaDollarSign, FaChevronDown, FaChevronUp, FaCarrot, FaPlusCircle,
  FaGlobe, FaFlag, FaImage,
} from 'react-icons/fa';
import PageContainer from '@/components/PageContainer';
import { getCountryCode, getRegionEmoji } from '../../../utils/countryUtils';
import Table from '@/components/Table'; // Import the Table component
import InstructionEditor from '@/components/InstructionEditor';
import Pill from '@/components/Pill';

import { addRecipe } from '../../../utils/api'; // Make sure the import path is correct
import { useRouter } from 'next/navigation'; // Client-side routing


function useLocalStorage(key, defaultValue) {
  const [state, setState] = useState(defaultValue);

  // Load from localStorage
  useEffect(() => {
    const stored = window.localStorage.getItem(key);
    if (stored) setState(JSON.parse(stored));
  }, [key]);

  // Save to localStorage
  useEffect(() => {
    if (state) {
      window.localStorage.setItem(key, JSON.stringify(state));
    }
  }, [key, state]);

  return [state, setState];
}

export default function AddRecipePage() {
  const router = useRouter(); // use this instead of window.location
  const [recipe, setRecipe] = useLocalStorage('draftRecipe', {
    name: '',
    time: 0,
    cost: 0.0,
    description: '',
    categories: [],
    subcategories: [],
    ingredients: [],
    instructions: [],
    nationName: '',
    regionName: '',
    newCategory: '',
    newSubcategory: '',
    imageUrl: '', // New state for image URL
  });

  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
  const toggleDescription = () => setIsDescriptionOpen(prevState => !prevState);


  // Handle image URL drag and drop
  const handleImageDrop = (e) => {
    e.preventDefault();
    const items = e.dataTransfer.items;
    console.log("Dropped items:", items);
  
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
  
      // Attempt to get image URL from dragged HTML content
      if (item.type === "text/html") {
        item.getAsString((html) => {
          // Create a temporary DOM element to extract the image src
          const doc = new DOMParser().parseFromString(html, "text/html");
          const img = doc.querySelector("img");
          if (img && isValidImageUrl(img.src)) {
            console.log("Extracted image URL from HTML:", img.src);
            setRecipe((prevRecipe) => ({
              ...prevRecipe,
              imageUrl: img.src,
            }));
          }
        });
        return;
      }
  
      // Alternatively, try plain text (like dragging a URL)
      if (item.type === "text/plain") {
        item.getAsString((url) => {
          console.log("Dropped plain text:", url);
          if (isValidImageUrl(url)) {
            setRecipe((prevRecipe) => ({
              ...prevRecipe,
              imageUrl: url,
            }));
          }
        });
        return;
      }
  
      // If the item is a file (e.g., downloaded image dragged in), skip it
      if (item.kind === "file") {
        console.log("Dropped file, ignoring:", item.getAsFile());
        return;
      }
    }
  };

  // Handle the image URL paste event
  const handleImagePaste = (e) => {
    const imageUrl = e.clipboardData.getData('text/plain'); // Get the pasted URL
    console.log("Pasted URL:", imageUrl);

    if (isValidImageUrl(imageUrl)) {
      setRecipe((prevRecipe) => ({
        ...prevRecipe,
        imageUrl,
      }));
    }
  };

  // Validate if the URL is an image (you can customize the regex for more checks)
  const isValidImageUrl = (url) => {
    const regex = /\.(jpg|jpeg|png|gif|bmp)$/i;
    return regex.test(url);
  };

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedIngredients = [...recipe.ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [name]: name === 'quantity' ? parseFloat(value) || 0 : value,
    };
    setRecipe(prevRecipe => ({
      ...prevRecipe,
      ingredients: updatedIngredients,
    }));
  };

  const addIngredient = () => {
    setRecipe(prevRecipe => ({
      ...prevRecipe,
      ingredients: [...prevRecipe.ingredients, { name: '', quantity: 0, unit: '' }],
    }));
  };
  const removeIngredient = (index) => {
    const updatedIngredients = [...recipe.ingredients];
    updatedIngredients.splice(index, 1);
    setRecipe(prevRecipe => ({
      ...prevRecipe,
      ingredients: updatedIngredients,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format the payload to match what backend expects
      const payload = {
        name: recipe.name,
        description: recipe.description,
        nation: recipe.nationName,
        region: recipe.regionName,
        time: parseInt(recipe.time),
        cost: parseFloat(recipe.cost),
        ingredients: recipe.ingredients,
        instructions: recipe.instructions.filter(step => step.trim() !== ''),
        aliases: [],
        categories: recipe.categories,
        subcategories: recipe.subcategories,
        images: recipe.imageUrl
          ? [{ url: recipe.imageUrl, caption: recipe.name, type: 'full-size' }]
          : [], // Default to full-size if image URL exists
      };

      const result = await addRecipe(payload);

      // Save in local storage just for temporary "user data" simulation
      const userRecipes = JSON.parse(localStorage.getItem('userRecipes') || '[]');
      userRecipes.push({ id: result.id, name: recipe.name });
      localStorage.setItem('userRecipes', JSON.stringify(userRecipes));

      router.push('/user'); // Redirect to the user page
    } catch (error) {
      console.error('Failed to add recipe:', error.message);
      alert(error.message);
    }
  };


  const ingredientHeaders = ['Ingredient', 'Quantity', 'Unit'];

  // Handle adding categories or subcategories from comma-separated input
  const handleCategoryInput = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // prevent form submit
      const categoriesToAdd = recipe.newCategory.split(',').map(item => item.trim()).filter(item => item);
      if (categoriesToAdd.length) {
        setRecipe(prevRecipe => ({
          ...prevRecipe,
          categories: [...prevRecipe.categories, ...categoriesToAdd],
          newCategory: '', // Reset the input field after adding
        }));
      }
    }
  };
  const handleSubcategoryInput = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // prevent form submit
      const subcategoriesToAdd = recipe.newSubcategory.split(',').map(item => item.trim()).filter(item => item);
      if (subcategoriesToAdd.length) {
        setRecipe(prevRecipe => ({
          ...prevRecipe,
          subcategories: [...prevRecipe.subcategories, ...subcategoriesToAdd],
          newSubcategory: '', // Reset the input field after adding
        }));
      }
    }
  };

  const handleDeleteCategory = (category) => {
    setRecipe(prevRecipe => ({
      ...prevRecipe,
      categories: prevRecipe.categories.filter(item => item !== category),
    }));
  };
  const handleDeleteSubcategory = (subcategory) => {
    setRecipe(prevRecipe => ({
      ...prevRecipe,
      subcategories: prevRecipe.subcategories.filter(item => item !== subcategory),
    }));
  };

  const countryCode = getCountryCode(recipe.nationName); // Get the country code or null if not found
  return (
    <div className="min-h-screen bg-[url('/images/bg/light1.png')] bg-cover bg-center bg-no-repeat">
      <PageContainer>
        <form
          onSubmit={handleSubmit}
          className="bg-[var(--glass-bg)] backdrop-blur-lg border border-[var(--glass-border)] shadow-lg rounded-2xl max-w-screen-lg mx-auto p-8 space-y-10 text-[1.05rem] leading-relaxed text-[var(--other-text)]"
        >
        {/* Title Section */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Nation flag and name */}
            <div className="flex items-center gap-2">
              {recipe.nationName && countryCode ? (
                <img
                  src={`https://flagcdn.com/w80/${countryCode}.png`}
                  alt={`${recipe.nationName} flag`}
                  className="w-10 h-6 sm:w-12 sm:h-8 rounded-sm shadow-sm"
                  title={recipe.nationName}
                />
              ) : (
                <FaFlag className="w-10 h-6 sm:w-12 sm:h-8 text-gray-500" />
              )}
              <input
                type="text"
                name="nationName"
                value={recipe.nationName}
                onChange={(e) => setRecipe({ ...recipe, nationName: e.target.value })}
                placeholder="Nation of Origin"
                className="bg-transparent border-b border-[var(--other-text)] outline-none w-32 text-lg"
              />
            </div>

            {/* Recipe name */}
            <input
              type="text"
              name="name"
              value={recipe.name}
              onChange={(e) => setRecipe({ ...recipe, name: e.target.value })}
              placeholder="Recipe Name"
              className="text-3xl sm:text-4xl font-bold bg-transparent border-none outline-none focus:ring-0"
            />
          </div>
        </header>

  
          {/* Info Row */}
          <section className="flex flex-wrap gap-x-6 gap-y-4 text-base sm:text-lg">
            <div className="flex items-center gap-2">
              <FaClock className="text-[var(--secondary-dark)]" />
              <input
                type="number"
                name="time"
                value={recipe.time}
                onChange={(e) => setRecipe({ ...recipe, time: e.target.value })}
                placeholder="Time(mins)"
                className="bg-transparent border-b border-[var(--other-text)] outline-none w-16 text-lg"
              />
            </div>
            <div className="flex items-center gap-2">
              <FaDollarSign className="text-green-600" />
              <input
                type="number"
                name="cost"
                value={recipe.cost}
                onChange={(e) => setRecipe({ ...recipe, cost: e.target.value })}
                placeholder="Cost(US)"
                className="bg-transparent border-b border-[var(--other-text)] outline-none w-24 text-lg text-green-600"
              />
            </div>
            <div className="flex items-center gap-2 capitalize">
              {getRegionEmoji(recipe.regionName)}
              <input
                type="text"
                name="regionName"
                value={recipe.regionName}
                onChange={(e) => setRecipe({ ...recipe, regionName: e.target.value })}
                placeholder="Region"
                className="bg-transparent border-b border-[var(--other-text)] outline-none w-32 text-lg"
              />
            </div>
          </section>
  
          {/* Image Upload Section */}
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">Image</h2>
            <div
              className="border-2 border-dashed border-[var(--other-text)] p-6 cursor-pointer rounded-md relative"
              onDrop={handleImageDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <p className="text-center mb-2">
                {recipe.imageUrl
                  ? "Image Added — You can replace it"
                  : "Drag and Drop an Image from the web, or Paste Image URL"}
              </p>
  
              {!recipe.imageUrl && (
                <div className="flex flex-col items-center gap-2">
                  <FaImage className="w-12 h-12 text-[var(--other-text)] opacity-40" />
                  <input
                    type="text"
                    name="imageUrl"
                    value={recipe.imageUrl}
                    onChange={(e) => setRecipe({ ...recipe, imageUrl: e.target.value })}
                    onPaste={handleImagePaste}
                    placeholder="Paste Image URL"
                    className="bg-transparent outline-none w-full text-lg text-center"
                  />
                </div>
              )}
  
              {recipe.imageUrl && (
                <div className="border-t border-gray-300 w-full mt-4 pt-4 flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2 bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm max-w-full">
                    <span className="truncate max-w-[200px]">{recipe.imageUrl}</span>
                    <button
                      onClick={() => setRecipe((prev) => ({ ...prev, imageUrl: "" }))}
                      className="text-red-500 hover:text-red-700 font-bold text-base leading-none"
                      aria-label="Remove image URL"
                    >
                      &times;
                    </button>
                  </div>
                  <img
                    src={recipe.imageUrl}
                    alt="Recipe"
                    className="w-48 h-48 object-cover rounded-md shadow"
                  />
                </div>
              )}
            </div>
          </section>
  
          {/* Description Section */}
          <section>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">Description</h2>
              <button
                type="button"
                className="text-sm text-[var(--secondary-dark)] hover:text-[var(--primary)] flex items-center gap-2"
                onClick={toggleDescription}
              >
                {isDescriptionOpen ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>
            {isDescriptionOpen && (
              <textarea
                name="description"
                value={recipe.description}
                onChange={(e) => setRecipe({ ...recipe, description: e.target.value })}
                placeholder="Recipe Description (max 20 words)"
                className="w-full text-base md:text-lg mt-2 bg-transparent border-b border-[var(--other-text)] outline-none"
              />
            )}
          </section>
  
          {/* Categories and Subcategories */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Categories & Subcategories</h2>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* Categories Block */}
              <div>
                {/* <h3 className="text-lg font-medium mb-2 text-[var(--other-text)]">Categories</h3> */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    name="newCategory"
                    value={recipe.newCategory}
                    onChange={(e) => setRecipe({ ...recipe, newCategory: e.target.value })}
                    onKeyDown={handleCategoryInput}
                    placeholder="Add Categories (comma separated)"
                    className="bg-transparent border-b border-[var(--other-text)] outline-none w-full text-lg"
                  />
                  <button
                    type="button"
                    onClick={handleCategoryInput}
                    className="text-[var(--secondary-dark)] hover:text-[var(--primary)]"
                  >
                    <FaPlusCircle />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {recipe.categories.map((category, index) => (
                    <Pill
                      key={index}
                      text={category}
                      onDelete={() => handleDeleteCategory(category)}
                      bgColor="[var(--recipe-detail-category)]"
                      textColor="[var(--recipe-detail-category-text)]"
                    />
                  ))}
                </div>
              </div>

              {/* Subcategories Block */}
              <div>
                {/* <h3 className="text-lg font-medium mb-2 text-[var(--other-text)]">Subcategories</h3> */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    name="newSubcategory"
                    value={recipe.newSubcategory}
                    onChange={(e) => setRecipe({ ...recipe, newSubcategory: e.target.value })}
                    onKeyDown={handleSubcategoryInput}
                    placeholder="Add Subcategories (comma separated)"
                    className="bg-transparent border-b border-[var(--other-text)] outline-none w-full text-lg"
                  />
                  <button
                    type="button"
                    onClick={handleSubcategoryInput}
                    className="text-[var(--secondary-dark)] hover:text-[var(--primary)]"
                  >
                    <FaPlusCircle />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {recipe.subcategories.map((subcategory, index) => (
                    <Pill
                      key={index}
                      text={subcategory}
                      onDelete={() => handleDeleteSubcategory(subcategory)}
                      bgColor="[var(--recipe-detail-subcategory)]"
                      textColor="[var(--recipe-detail-subcategory-text)]"
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
  
          {/* Ingredients Table */}
          <section className="mt-8">
            <Table
              title="Ingredients"
              headers={ingredientHeaders}
              rows={recipe.ingredients.map((ingredient) => [
                ingredient.name,
                ingredient.quantity,
                ingredient.unit,
              ])}
              handleChange={handleChange}
              removeRow={removeIngredient}
              addItem={addIngredient}
              inputName="ingredient"
              buttonIcon={
                <>
                  <FaCarrot className="inline-block mr-2" /> +
                </>
              }
            />
          </section>

          {/* Instructions Section */}
          <InstructionEditor
            instructions={recipe.instructions}
            setInstructions={(newInstructions) =>
              setRecipe((prev) => ({ ...prev, instructions: newInstructions }))
            }
          />

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-block bg-[var(--secondary-dark)] hover:bg-[var(--primary)] text-[var(--main-text)] font-medium py-2 px-6 rounded-md shadow transition"
            >
              Submit Recipe
            </button>
          </div>
        </form>
      </PageContainer>
    </div>
  );
}


/*
https://react-icons.github.io/react-icons/search/#q=image
https://reactnative.dev/docs/running-on-device?os=windows
*/