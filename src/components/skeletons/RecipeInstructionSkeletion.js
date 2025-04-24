// components/skeletons/RecipeInstructionSkeleton.js
const RecipeInstructionSkeleton = () => {
  return (
    <div className="min-h-screen bg-[url('/images/bg/light1.png')] bg-cover bg-center bg-no-repeat">
      <div className="max-w-screen-lg mx-auto p-8 space-y-10">
        <div className="animate-pulse space-y-6 bg-[var(--glass-bg)] backdrop-blur-lg border border-[var(--glass-border)] shadow-lg rounded-2xl p-8">
          
          {/* Title Row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-6 md:w-12 md:h-8 bg-[var(--sub-text)] rounded-sm" />
              <div className="h-8 md:h-10 w-48 bg-[var(--sub-text)] rounded-md" />
            </div>
          </div>

          {/* Instruction Message */}
          <div className="h-6 w-full bg-[var(--sub-text)] rounded" />

          {/* Instructions */}
          <div className="space-y-4">
            <div className="h-6 w-40 bg-[var(--sub-text)] rounded" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-[var(--sub-text)] rounded-md" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeInstructionSkeleton;
