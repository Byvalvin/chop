// src/utils/api.js

const base = 'https://chop-api-nine.vercel.app/chop/api';

export const fetchRecipes = async (page,category,subcategory,nation) => {
    const limit = 10;  // Number of recipes per page
    
    const categoryQuery = category ? `&category=${category}` : "",
        subcategoryQuery = subcategory ? `&subcategory=${subcategory}` : "",
        nationQuery = nation ? `&nation=${nation}` : "";
    const response = await fetch(`${base}/recipes?page=${page}&limit=${limit}${categoryQuery}${subcategoryQuery}${nationQuery}`);
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