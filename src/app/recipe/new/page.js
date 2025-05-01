'use client';

import { useState } from 'react';
import { FaClock, FaDollarSign, FaChevronDown, FaChevronUp, FaCarrot, FaPlusCircle, FaGlobe, FaFlag } from 'react-icons/fa';
import PageContainer from '@/components/PageContainer';
import { getCountryCode, getRegionEmoji } from '../../../utils/countryUtils';
import Table from '@/components/Table'; // Import the Table component
import Pill from '@/components/Pill';

export default function AddRecipePage() {
  const [recipe, setRecipe] = useState({
    name: '',
    time: '',
    cost: '',
    description: '',
    categories: [],
    subcategories: [],
    ingredients: [],
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
    console.log("Drop event triggered");

    // Check the dataTransfer object to understand the structure of the dropped data
    const data = e.dataTransfer.items;

    console.log("Dropped items:", data);

    // Loop through the items and check for image types
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      console.log("Item type:", item.type);  // Check item type

      // If the item is an image, attempt to extract its URL
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        console.log("Dropped image file:", file);

        // If it's a valid file, use its URL (or handle it accordingly)
        const imageUrl = URL.createObjectURL(file);
        console.log("Extracted image URL:", imageUrl);

        setRecipe((prevRecipe) => ({
          ...prevRecipe,
          imageUrl,
        }));
        return; // Exit after handling the image
      }
    }

    // If it's not a valid image file, attempt to get the URL
    const imageUrl = e.dataTransfer.getData('text/plain');
    console.log("Dropped text data (URL):", imageUrl);

    if (isValidImageUrl(imageUrl)) {
      setRecipe((prevRecipe) => ({
        ...prevRecipe,
        imageUrl,
      }));
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
    updatedIngredients[index] = { ...updatedIngredients[index], [name]: value };
    setRecipe(prevRecipe => ({
      ...prevRecipe,
      ingredients: updatedIngredients,
    }));
  };


  const addIngredient = () => {
    setRecipe(prevRecipe => ({
      ...prevRecipe,
      ingredients: [...prevRecipe.ingredients, { name: '', quantity: '', unit: '' }],
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting new recipe:', recipe);
  };

  const ingredientHeaders = ['Ingredient', 'Quantity', 'Unit'];

  // Handle adding categories or subcategories from comma-separated input
  const handleCategoryInput = (e) => {
    if (e.key === 'Enter') {
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
        <form onSubmit={handleSubmit} className="bg-[var(--glass-bg)] backdrop-blur-lg border border-[var(--glass-border)] shadow-lg rounded-2xl shadow-md max-w-screen-lg mx-auto p-8 space-y-10 text-[1.05rem] leading-relaxed text-[var(--other-text)]">

          {/* Title Section */}
          <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {recipe.nationName && countryCode ? (
                <img
                  src={`https://flagcdn.com/w80/${countryCode}.png`}
                  alt={`${recipe.nationName} flag`}
                  className="w-10 h-6 sm:w-12 sm:h-8 rounded-sm shadow-sm"
                  title={recipe.nationName}
                />
              ) : (
                // Default flag when no country is found
                <FaFlag className="w-10 h-6 sm:w-12 sm:h-8 text-gray-500" />
              )}
              <input
                type="text"
                name="nationName"
                value={recipe.nationName}
                onChange={(e) => setRecipe({ ...recipe, nationName: e.target.value })}
                placeholder="Nation of Origin"
                className="bg-transparent border-b border-[var(--other-text)] outline-none w-32 text-lg text-[var(--other-text)]"
              />
              <input
                type="text"
                name="name"
                value={recipe.name}
                onChange={(e) => setRecipe({ ...recipe, name: e.target.value })}
                placeholder="Recipe Name"
                className="text-3xl sm:text-4xl font-bold text-[var(--other-text)] bg-transparent border-none outline-none focus:ring-0"
              />
            </div>
          </header>

          {/* Info Row */}
          <section className="flex flex-wrap gap-6 text-base sm:text-lg">
            <div className="flex items-center gap-2">
              <FaClock className="text-[var(--secondary-dark)]" />
              <input
                type="number"
                name="time"
                value={recipe.time}
                onChange={(e) => setRecipe({ ...recipe, time: e.target.value })}
                placeholder="Time(mins)"
                className="bg-transparent border-b border-[var(--other-text)] outline-none w-16 text-lg text-[var(--other-text)]"
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
            <div className="flex items-center gap-2 capitalize text-[var(--other-text)]">
              {/* {recipe.regionName && (getRegionEmoji(recipe.regionName))} */}
              {getRegionEmoji(recipe.regionName)}
              <input
                type="text"
                name="regionName"
                value={recipe.regionName}
                onChange={(e) => setRecipe({ ...recipe, regionName: e.target.value })}
                placeholder="Region"
                className="bg-transparent border-b border-[var(--other-text)] outline-none w-32 text-lg text-[var(--other-text)]"
              />
            </div>
          </section>
          {/* Image Upload Section */}
          <section className="flex flex-col gap-4">
            <label htmlFor="imageUrl" className="text-lg font-semibold text-[var(--other-text)]">
              Recipe Image
            </label>
            <div
              className="border-2 border-dashed border-[var(--other-text)] p-4 text-center cursor-pointer"
              onDrop={handleImageDrop}
              onDragOver={(e) => {
                e.preventDefault(); // Ensure the drop zone allows dropping
                console.log("Drag over event triggered");
              }} // Logging drag over event
            >
              <p>Drag and Drop an Image URL here, or Paste an Image URL</p>
              <input
                type="text"
                name="imageUrl"
                value={recipe.imageUrl}
                onChange={(e) => setRecipe({ ...recipe, imageUrl: e.target.value })}
                onPaste={handleImagePaste}
                placeholder="Paste Image URL"
                className="bg-transparent outline-none w-full text-lg text-[var(--other-text)]"
              />
            </div>
            {recipe.imageUrl && (
              <img
                src={recipe.imageUrl}
                alt="Recipe"
                className="w-64 h-64 object-cover mt-4 rounded-md shadow-md"
              />
            )}
          </section>

          {/* Categories and Subcategories */}
          <section className="flex justify-between gap-6">
            {/* Category Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                name="newCategory"
                value={recipe.newCategory}
                onChange={(e) => setRecipe({ ...recipe, newCategory: e.target.value })}
                onKeyDown={handleCategoryInput}
                placeholder="Add Categories (comma separated)"
                className="bg-transparent border-b border-[var(--other-text)] outline-none w-64 text-lg text-[var(--other-text)]"
              />
              <button type="button" onClick={handleCategoryInput} className="text-[var(--secondary-dark)] hover:text-[var(--primary)]">
                <FaPlusCircle /> 
              </button>
            </div>

            {/* Subcategory Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                name="newSubcategory"
                value={recipe.newSubcategory}
                onChange={(e) => setRecipe({ ...recipe, newSubcategory: e.target.value })}
                onKeyDown={handleSubcategoryInput}
                placeholder="Add Subcategories (comma separated)"
                className="bg-transparent border-b border-[var(--other-text)] outline-none w-64 text-lg text-[var(--other-text)]"
              />
              <button type="button" onClick={handleSubcategoryInput} className="text-[var(--secondary-dark)] hover:text-[var(--primary)]">
                <FaPlusCircle />
              </button>
            </div>

          </section>

          {/* Display Pills for Categories */}
          <div className="flex flex-wrap gap-2 mt-4">
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

          {/* Display Pills for Subcategories */}
          <div className="flex flex-wrap gap-2 mt-4">
            {recipe.subcategories.map((subcategory, index) => (
              <Pill
                key={index}
                text={subcategory}
                onDelete={() => handleDeleteSubcategory(subcategory)}
                bgColor="[var(--recipe-detail-subcategory)]"
                textColor="var(--recipe-detail-subcategory-text)]"
              />
            ))}
          </div>


          {/* Recipe Description */}
          <section aria-labelledby="description-heading" className="space-y-4">
            <div className="flex justify-end items-center">
              <button
                type="button"
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
              <textarea
                name="description"
                value={recipe.description}
                onChange={(e) => setRecipe({ ...recipe, description: e.target.value })}
                placeholder="Recipe Description (max 20 words)"
                className="w-full text-[var(--other-text)] text-base md:text-lg mt-2 bg-transparent border-b border-[var(--other-text)] outline-none"
              />
            )}
          </section>

          {/* Ingredients Table */}
          <Table
            title="Ingredients"
            headers={ingredientHeaders}
            rows={recipe.ingredients.map((ingredient, index) => [
              ingredient.name, 
              ingredient.quantity, 
              ingredient.unit
            ])}
            handleChange={handleChange}
            removeRow={removeIngredient}
            addItem={addIngredient}
            inputName="ingredient" // Adjust according to your state properties
            buttonIcon={<><FaCarrot className="inline-block mr-2" /> +</>} 
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
