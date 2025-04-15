// components/skeletons/SectionCardSkeleton.js
import RecipeCardSkeleton from "./RecipeCardSkeleton";

const SectionCardSkeleton = ({ backgroundImage = "/images/bg/light4.png" }) => {
  return (
    <div
      className="mb-12 bg-cream p-8 rounded-lg shadow-lg bg-cover bg-center bg-no-repeat relative animate-pulse"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Overlay like real card */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-md rounded-lg z-0" />

      <div className="relative z-10">
        {/* Header */}
        <div className="text-4xl font-extrabold text-center relative flex justify-between items-center mb-10 ">
            {/* Title and Icon placeholder */}
            <div className="flex gap-x-4">
                <div className="h-10 w-24 bg-gray-300 rounded-md" />
                <div className="h-10 w-10 bg-gray-400 rounded-full" />
            </div>

            {/* Selected value placeholder */}
            <div className="h-10 w-24 bg-gray-300 rounded-md" />

            {/* Underline bar */}
            <span className="absolute left-0 bottom-[-8px] w-full h-[6px] bg-teal-600 mt-8 rounded-full"></span>
        </div>


        {/* Recipe skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {[...Array(3)].map((_, idx) => (
            <RecipeCardSkeleton key={idx} variant="dark" />
          ))}
        </div>

        {/* "See More" button skeleton */}
        <div className="flex justify-end mt-8">
          <div className="w-36 h-10 bg-gray-300 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default SectionCardSkeleton;
