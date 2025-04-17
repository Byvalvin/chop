// components/skeletons/RecipeCardSkeleton.js
export const RecipeCardSkeleton = () => {
    const cardClasses = "rounded-lg shadow-md border-b-4 transition-shadow duration-300 ease-in-out cursor-pointer flex flex-col h-[400px] animate-pulse bg-[var(--primary)] border-[var(--primary-cmpmt)] text-[var(--main-text)]";
  
    return (
      <div className={cardClasses}>
        <div className="relative w-full h-48 bg-[var(--sub-text)] rounded-t-lg" />
  
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div className="h-6 mb-2 rounded bg-[var(--sub-text)] bg-opacity-50" />
          <div className="h-4 rounded bg-[var(--sub-text)] mt-2 bg-opacity-40" />
          <div className="h-4 rounded bg-[var(--sub-text)] mt-1 w-2/3 bg-opacity-30" />
        </div>
      </div>
    );
  };

  
  export default RecipeCardSkeleton;
  