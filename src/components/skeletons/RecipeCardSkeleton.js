// components/skeletons/RecipeCardSkeleton.js
export const RecipeCardSkeleton = ({ variant = "dark" }) => {
    const isDark = variant === "dark";
  
    const cardClasses = `rounded-lg shadow-md border-b-4 transition-shadow duration-300 ease-in-out cursor-pointer flex flex-col h-[400px] animate-pulse ${
      isDark
        ? "bg-teal-900 border-yellow-300 text-white"
        : "bg-white border-yellow-400 text-gray-800"
    }`;
  
    return (
      <div className={cardClasses}>
        <div className="relative w-full h-48 bg-gray-300 rounded-t-lg" />
  
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div className={`h-6 mb-2 rounded bg-gray-400 ${isDark ? "bg-opacity-50" : ""}`} />
          <div className={`h-4 rounded bg-gray-300 mt-2 ${isDark ? "bg-opacity-40" : ""}`} />
          <div className={`h-4 rounded bg-gray-300 mt-1 w-2/3 ${isDark ? "bg-opacity-30" : ""}`} />
        </div>
      </div>
    );
  };

  
  export default RecipeCardSkeleton;
  