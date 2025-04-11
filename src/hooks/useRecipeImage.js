"use client";

import { useEffect, useState } from "react";
import { fetchRecipeImages } from "../utils/api";
import { checkImageExists } from "../utils/checkImageExists";

const emptyImage = "/images/empty.jpg";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const useRecipeImage = (recipeId) => {
  const [imageUrl, setImageUrl] = useState(emptyImage);

  useEffect(() => {
    if (!recipeId) return;

    const cacheKey = `recipeImage_${recipeId}`;

    const loadImage = async () => {
      // 1. Check cached image with TTL
      const cachedRaw = localStorage.getItem(cacheKey);
      if (cachedRaw) {
        try {
          const { url, cachedAt } = JSON.parse(cachedRaw); // 🔥 Fails if JSON is invalid
          const now = Date.now();
          const isExpired = now - cachedAt > CACHE_DURATION;
      
          if (!isExpired && await checkImageExists(url)) {
            setImageUrl(url);
            return;
          }
        } catch (err) {
          console.warn("⚠️ Invalid cache format for", cacheKey, err);
          localStorage.removeItem(cacheKey); // 🔥 Remove bad cache so it doesn’t keep breaking
        }
      }
      

      // 2. Fetch new image data from API
      try {
        const imageData = await fetchRecipeImages(recipeId);
        const urls = imageData?.results?.map((img) => img.url).filter(Boolean);

        // 3. Try each URL until one works
        for (const url of urls) {
          const isValid = await checkImageExists(url);
          if (isValid) {
            localStorage.setItem(cacheKey, JSON.stringify({
              url,
              cachedAt: Date.now()
            }));
            setImageUrl(url);
            return;
          }
        }
      } catch (err) {
        console.error(`Error loading image for recipe ${recipeId}:`, err);
      }

      // 4. Fallback
      setImageUrl(emptyImage);
    };

    loadImage();
  }, [recipeId]);

  return imageUrl;
};

export default useRecipeImage;
