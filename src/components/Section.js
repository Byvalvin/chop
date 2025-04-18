import Link from "next/link";
import RecipeCard from "../components/RecipeCard";
import { FaTags } from 'react-icons/fa';
import { toTitleCase } from "@/utils/string";

const SectionCard = ({
  title,
  sectionRecipes,
  path,
  bgColor = "bg-white",
  titleColor = "text-[var(--secondary-dark)]",
  IconType = FaTags,
  sectionType,
  selectedValue,
  backgroundImage, // <-- NEW prop
}) => {
  const getIcon = () => <IconType className="text-[var(--primary-cmpmt)] text-2xl" />;


  return (
    <div
      className={`mb-12 ${bgColor} p-8 rounded-lg shadow-lg bg-cover bg-center bg-no-repeat relative`}
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}
    >
      {/* Optional semi-transparent overlay */}
      {backgroundImage && (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--section-bg-gradient-start)] to-[var(--section-bg-gradient-end)] backdrop-blur-md rounded-lg z-0" />
      )}

      <div className="relative z-10">
        <h3
          className={`text-4xl font-extrabold ${titleColor} mb-12 text-center bg-clip-text bg-gradient-to-r from-[var(--secondary)] to-[var(--section-title-end-gradient)] relative flex justify-between items-center`}
        >
          <span className="text-[var(--primary)]">{title}</span>
          <span className="mx-4 flex-grow text-center" >{getIcon()}</span>
          <span className="text-[var(--secondary)]">{toTitleCase(selectedValue)}</span>
          <span className="absolute left-0 bottom-[-8px] w-full h-[6px] bg-[var(--secondary-dark)] mt-8 rounded-full"></span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {sectionRecipes.map((recipe) => <RecipeCard  key={recipe.id} recipe={recipe} />)}
        </div>

        <div className="flex justify-end mt-8">
          <Link href={path} passHref>
            <button className="text-lg font-medium text-[var(--main-text)] border-2 border-[var(--secondary-dark)] bg-[var(--secondary-dark)] hover:bg-[var(--secondary)] hover:text-[var(--main-text)] transition-all py-2 px-6 rounded-full shadow-lg hover:shadow-lg">
              See More
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SectionCard;
