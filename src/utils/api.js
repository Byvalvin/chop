// src/utils/api.js

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
  const limit = 10; // Number of recipes per page

  const searchQuery = search ? `&search=${search}` : "";
  const categoryQuery = categories.length ? `&category=${categories.join(',')}` : "";
  const subcategoryQuery = subcategories.length ? `&subcategory=${subcategories.join(',')}` : "";
  const nationQuery = nations ? `&nation=${nations.join(',')}` : "";
  const ingredientQuery = ingredients.length ? `&ingredient=${ingredients.join(',')}` : "";
  const ratingQuery = ratings.length ? `&rating=${ratings.join(',')}` : "";
  const difficultyQuery = difficulty.length ? `&difficulty=${difficulty.join(',')}` : "";
  const timeQuery = time ? `&time=${time[1]}` : "";
  const costQuery = cost ? `&cost=${cost[1]}` : "";

  const response = await fetch(
    `${base}/recipes?page=${page}&limit=${limit}${searchQuery}${categoryQuery}${subcategoryQuery}${nationQuery}${ingredientQuery}${ratingQuery}${difficultyQuery}${timeQuery}${costQuery}`
  );
  
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


export const fetchNations = async () => {
    const limit = 10;  // Number of nations per page
    const page = 1;
    const response = await fetch(`${base}/nations/?page=${page}&limit=${limit}`);
    const data = await response.json();
    return data;
};
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