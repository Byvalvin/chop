import Link from "next/link";
import RecipeCard from "../components/RecipeCard";
import { FaTags } from 'react-icons/fa';

const SectionCard = ({
  title,
  sectionRecipes,
  path,
  bgColor = "bg-white",
  titleColor = "text-teal-600",
  IconType = FaTags,
  sectionType,
  selectedValue,
  backgroundImage, // <-- NEW prop
}) => {
  const getIcon = () => <IconType className="text-yellow-600 text-2xl" />;

  const capitalizeFirstLetter = (value) =>
    value ? value.charAt(0).toUpperCase() + value.slice(1) : value;

  return (
    <div
      className={`mb-12 ${bgColor} p-8 rounded-lg shadow-lg bg-cover bg-center bg-no-repeat relative`}
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}
    >
      {/* Optional semi-transparent overlay */}
      {backgroundImage && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-md rounded-lg z-0" />

      )}

      <div className="relative z-10">
        <h3
          className={`text-4xl font-extrabold ${titleColor} mb-12 text-center bg-clip-text bg-gradient-to-r from-teal-500 to-teal-300 relative flex justify-between items-center`}
        >
          <span className="text-teal-800">{title}</span>
          <span className="mx-4 flex-grow text-center" >{getIcon()}</span>
          <span className="text-teal-500">{capitalizeFirstLetter(selectedValue)}</span>
          <span className="absolute left-0 bottom-[-8px] w-full h-[6px] bg-teal-600 mt-8 rounded-full"></span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {sectionRecipes.map((recipe) => (
            <RecipeCard  key={recipe.id} recipe={recipe} variant="dark" />
          ))}
        </div>

        <div className="flex justify-end mt-8">
          <Link href={path} passHref>
            <button className="text-lg font-medium text-white border-2 border-teal-600 bg-teal-600 hover:bg-teal-500 hover:text-white transition-all py-2 px-6 rounded-full shadow-lg hover:shadow-lg">
              See More
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SectionCard;
