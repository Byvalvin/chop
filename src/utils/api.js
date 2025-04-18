// src/utils/api.js
import { recipesPerPage } from "@/components/Pagination";

const base = 'https://chop-api-nine.vercel.app/chop/api';


export const fetchRecipes = async ({
  page,
  search = "",
  categories = [],
  subcategories = [],
  nations = [],
  ingredients = [],
  time = [],
  cost = [],
  ratings = [],
  difficulty = []
}) => {
  const limit = recipesPerPage; // Number of recipes per page

  const searchQuery = search ? `&search=${search}` : "";
  const categoryQuery = categories.length ? `&category=${categories.join(',')}` : "";
  const subcategoryQuery = subcategories.length ? `&subcategory=${subcategories.join(',')}` : "";
  const nationQuery = nations ? `&nation=${nations.join(',')}` : "";
  const ingredientQuery = ingredients.length ? `&ingredient=${ingredients.join(',')}` : "";
  const ratingQuery = ratings.length ? `&rating=${ratings.join(',')}` : "";
  const difficultyQuery = difficulty.length ? `&difficulty=${difficulty.join(',')}` : "";
  const timeQuery = time && time[0] && time[1] ? `&time=${time[1]}` : "";
  const costQuery = cost && cost[0] && cost[1] ? `&cost=${cost[1]}` : "";

  const response = await fetch(
    `${base}/recipes?page=${page}&limit=${limit}${searchQuery}${categoryQuery}${subcategoryQuery}${nationQuery}${ingredientQuery}${ratingQuery}${difficultyQuery}${timeQuery}${costQuery}`
  );
  
  const data = await response.json();
  return data;
};

export const fetchRecipe = async (recipeId) => {
    const response = await fetch(`${base}/recipes/${recipeId}`);
    const data = await response.json();
    return data;
};
export const fetchRecipeImages = async (recipeId) => {
    const limit = 10;  // Number of recipes per page
    const page = 1;
    const response = await fetch(`${base}/recipes/${recipeId}/images?page=${page}&limit=${limit}`);
    const data = await response.json();
    return data;
};
export const fetchRecipeInstructions = async(recipeId) => {
    const response = await fetch(`${base}/recipes/${recipeId}/instructions`);
    const data = await response.json();
    return data.instructions;
}
export const fetchRecipeIngredients = async(recipeId) => {
    const response = await fetch(`${base}/recipes/${recipeId}/ingredients`);
    const data = await response.json();
    return data.ingredients;
}
export const fetchRecipeCategories = async(recipeId) => {
    const response = await fetch(`${base}/recipes/${recipeId}/categories`);
    const data = await response.json();
    return data.categories;
}
export const fetchRecipeSubcategories = async(recipeId) => {
    const response = await fetch(`${base}/recipes/${recipeId}/subcategories`);
    const data = await response.json();
    return data.subcategories;
}
export const fetchRecipeNames = async(recipeId) => {
    const response = await fetch(`${base}/recipes/${recipeId}/names`);
    const data = await response.json();
    return data.names;
}


export const fetchNations = async () => {
    const limit = 10;  // Number of nations per page
    const page = 1;
    const response = await fetch(`${base}/nations/?page=${page}&limit=${limit}`);
    const data = await response.json();
    return data;
};
export const fetchNation = async(nationId) => {
  const response = await fetch(`${base}/nations/${nationId}`);
  const data = await response.json();
  return data.name;
}
export const fetchRegion = async(regionId) => {
  const response = await fetch(`${base}/regions/${regionId}`);
  const data = await response.json();
  return data.name;
}
export const fetchCategories = async () => {
    const limit = 10;  // Number of categories per page
    const page = 1;
    const response = await fetch(`${base}/categories/?page=${page}&limit=${limit}`);
    const data = await response.json();
    return data;
};
export const fetchSubcategories = async () => {
    const limit = 10;  // Number of subcategories per page
    const page = 1;
    const response = await fetch(`${base}/subcategories/?page=${page}&limit=${limit}`);
    const data = await response.json();
    return data;
};



