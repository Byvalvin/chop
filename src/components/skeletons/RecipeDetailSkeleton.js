// components/skeletons/RecipeDetailSkeleton.js
const RecipeDetailSkeleton = () => {
    return (
      <div className="min-h-screen bg-[url('/images/bg/light1.png')] bg-cover bg-center bg-no-repeat">
        <div className="max-w-screen-lg mx-auto p-8 space-y-10">
          <div className="animate-pulse space-y-6 bg-white/60 backdrop-blur-lg border border-white/20 shadow-lg rounded-2xl p-8">
            
            {/* Title Row */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-6 md:w-12 md:h-8 bg-gray-300 rounded-sm" />
                <div className="h-8 md:h-10 w-48 bg-gray-300 rounded-md" />
              </div>
            </div>
  
            {/* Info Row */}
            <div className="flex flex-wrap gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-gray-300 rounded-full" />
                  <div className="h-5 w-24 bg-gray-200 rounded-md" />
                </div>
              ))}
            </div>
  
            {/* CTA Button */}
            <div className="w-40 h-10 bg-teal-200 rounded-md" />
  
            {/* Image Placeholder */}
            <div className="w-full h-96 bg-gray-300 rounded-lg" />
  
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-6 w-20 bg-teal-100 rounded-full" />
              ))}
            </div>
  
            {/* Ingredients */}
            <div className="space-y-4">
              <div className="h-6 w-40 bg-gray-300 rounded" />
              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
                {[...Array(6)].map((_, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-gray-400 rounded-sm" />
                    <div className="h-4 w-48 bg-gray-200 rounded" />
                  </li>
                ))}
              </ul>
            </div>
  
            {/* Instructions */}
            <div className="space-y-4">
              <div className="h-6 w-40 bg-gray-300 rounded" />
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-md" />
              ))}
            </div>
  
            {/* Aliases */}
            <div className="h-4 w-64 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  };
  
  export default RecipeDetailSkeleton;
  