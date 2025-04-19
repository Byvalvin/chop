"use client";

const RecipeCardSkeleton = () => {
  // Skeleton card styles matching RecipeCard's layout
  const baseCardClasses = `rounded-lg shadow-md border-b-4 animate-pulse flex flex-col h-auto sm:h-[400px] 
    bg-[var(--primary)] border-[var(--primary-cmpmt)] text-[var(--main-text)]`; // Matching card size and shape
  const titleClasses = `h-6 mb-2 rounded bg-[var(--sub-text)] bg-opacity-50`; // Title skeleton
  const descClasses = `h-4 rounded bg-[var(--sub-text)] mt-2 bg-opacity-40`; // Description skeleton
  const smallDescClasses = `h-4 rounded bg-[var(--sub-text)] mt-1 w-2/3 bg-opacity-30`; // Smaller description on mobile

  return (
    <div className={baseCardClasses}>
      {/* Image Skeleton */}
      <div className="relative w-full h-32 sm:h-48">
        <div className="bg-[var(--sub-text)] rounded-t-lg h-full" />
      </div>

      {/* Text Skeleton */}
      <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
        {/* Title */}
        <div className={titleClasses} />
        {/* Description */}
        <div className={descClasses} />
        {/* Small description for mobile */}
        <div className={smallDescClasses} />
      </div>
    </div>
  );
};

export default RecipeCardSkeleton;
