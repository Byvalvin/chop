"use client";

import { useState, useEffect } from "react";
import { fetchRecipes, fetchNations, fetchCategories, fetchSubcategories } from "../utils/api";
import SectionCard from "../components/Section";
import { FaFolder, FaGlobe, FaTags } from "react-icons/fa";
import PageContainer from "../components/PageContainer";
import SectionCardSkeleton from "../components/skeletons/SectionSkeleton";
import { useSwipeable } from 'react-swipeable'; // For swipe functionality
import TabContainer from "../components/responsive/TabContainer"; // Import TabContainer component

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedNation, setSelectedNation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [sectionRecipes, setSectionRecipes] = useState({
    nation: [],
    category: [],
    subcategory: [],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("nation"); // Active tab state

  useEffect(() => {
    const getSectionData = async () => {
      setLoading(true);
      const storedData = localStorage.getItem("sectionData");

      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setSectionRecipes(parsedData.sectionRecipes);
        setSelectedNation(parsedData.selectedNation);
        setSelectedCategory(parsedData.selectedCategory);
        setSelectedSubcategory(parsedData.selectedSubcategory);
        setHasMore(parsedData.hasMore);
        setLoading(false);
      } else {
        try {
          const nationsData = await fetchNations();
          const categoriesData = await fetchCategories();
          const subcategoriesData = await fetchSubcategories();

          const randomNation = nationsData.results[Math.floor(Math.random() * nationsData.results.length)];
          const randomCategory = categoriesData.results[Math.floor(Math.random() * categoriesData.results.length)];
          const randomSubcategory = subcategoriesData.results[Math.floor(Math.random() * subcategoriesData.results.length)];

          setSelectedNation(randomNation);
          setSelectedCategory(randomCategory);
          setSelectedSubcategory(randomSubcategory);

          const nationData = await fetchRecipes({ page, nations: [randomNation.name] });
          const categoryData = await fetchRecipes({ page, categories: [randomCategory.name] });
          const subcategoryData = await fetchRecipes({ page, subcategories: [randomSubcategory.name] });

          const nation = nationData.results.slice(0, 3),
                category = categoryData.results.slice(0, 3),
                subcategory = subcategoryData.results.slice(0, 3);

          const sections = { nation, category, subcategory };

          setSectionRecipes(sections);
          setHasMore(nationData.results.length === 10);

          localStorage.setItem("sectionData", JSON.stringify({
            sectionRecipes: sections,
            selectedNation: randomNation,
            selectedCategory: randomCategory,
            selectedSubcategory: randomSubcategory,
            hasMore
          }));
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    getSectionData();
  }, [page]);

  const paths = {
    nation: `/explore?nation=${selectedNation?.name}`,
    category: `/explore?category=${selectedCategory?.name}`,
    subcategory: `/explore?subcategory=${selectedSubcategory?.name}`,
  };

  // Handle swipe gestures
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setActiveTab(prev => prev === "nation" ? "category" : prev === "category" ? "subcategory" : prev),
    onSwipedRight: () => setActiveTab(prev => prev === "subcategory" ? "category" : prev === "category" ? "nation" : prev),
  });

  const tabs = [
    { id: 'nation', label: 'Nation' },
    { id: 'category', label: 'Category' },
    { id: 'subcategory', label: 'Subcategory' },
  ];

  // the bg images for each section
  const sectionBg = [
    "/images/bg/light4.png",
    "/images/bg/light5.png",
    "/images/bg/light7.png"

  ]
  // Common function to render SectionCard
  const renderSectionCard = (sectionKey, title, IconType, backgroundImage, selectedValue) => {
    return (
      <SectionCard
        key={sectionKey}
        title={title}
        sectionRecipes={sectionRecipes[sectionKey]}
        path={paths[sectionKey]}
        sectionType={sectionKey}
        bgColor="bg-cream"
        titleColor="text-[var(--primary)]"
        IconType={IconType}
        selectedValue={selectedValue}
        backgroundImage={backgroundImage}
      />
    );
  };

  return (
    <div className="min-h-screen bg-[url('/images/bg/light1.png')] bg-cover bg-center bg-no-repeat">
      <PageContainer>
        <div className="relative z-10">
          <div className="w-full">
            
            {/* Tabs for Mobile */}
            <div className="block sm:hidden">
              <TabContainer
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tabs={tabs}
                swipeHandlers={swipeHandlers}
              >
                {loading ? (
                  // Display skeletons for mobile
                  <>
                    {[...Array(sectionBg.length)].map((_, idx)=> <SectionCardSkeleton key={idx} backgroundImage={sectionBg[idx]} />)}
                  </>
                ) : (
                  // Actual content when loading is done
                  <>
                    {activeTab === "nation" && renderSectionCard("nation", "Nation", FaGlobe, "/images/bg/light4.png", selectedNation?.name)}
                    {activeTab === "category" && renderSectionCard("category", "Category", FaTags, "/images/bg/light5.png", selectedCategory?.name)}
                    {activeTab === "subcategory" && renderSectionCard("subcategory", "Subcategory", FaFolder, "/images/bg/light7.png", selectedSubcategory?.name)}
                  </>
                )}
              </TabContainer>
            </div>

            {/* Default Section Layout for Larger Screens */}
            <div className="hidden sm:block">
              {loading ? (
                // Show skeletons for larger screens
                <>
                  {[...Array(sectionBg.length)].map((_, idx)=> <SectionCardSkeleton key={idx} backgroundImage={sectionBg[idx]} />)}
                </>
              ) : (
                // Show actual content for larger screens
                <>
                  {renderSectionCard("nation", "Nation", FaGlobe, sectionBg[0], selectedNation?.name)}
                  {renderSectionCard("category", "Category", FaTags, sectionBg[1], selectedCategory?.name)}
                  {renderSectionCard("subcategory", "Subcategory", FaFolder, sectionBg[2], selectedSubcategory?.name)}
                </>
              )}
            </div>

            {error && <p className="text-red-500 text-lg">{error}</p>}
          </div>
        </div>
      </PageContainer>
    </div>
  );
}











/*
https://nextjs.org/docs/pages/api-reference/components/image#priority
https://www.vecteezy.com/free-png/leaf-icon
https://www.google.com/search?q=leaf+icon&client=ubuntu&hs=GA1&sca_esv=c09d48c2a0d898e8&channel=fs&ei=hzHzZ-m5Go3-p84P5_-6gQg&ved=0ahUKEwipmYO06cSMAxUN_8kDHee_LoAQ4dUDCBA&uact=5&oq=leaf+icon&gs_lp=Egxnd3Mtd2l6LXNlcnAiCWxlYWYgaWNvbjILEAAYgAQYkQIYigUyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgARIxQtQjwVYiwpwAXgBkAEAmAG9AaABsAWqAQMwLjW4AQPIAQD4AQGYAgagAusFwgIKEAAYsAMY1gQYR8ICDRAAGIAEGLADGEMYigXCAg4QABiwAxjkAhjWBNgBAcICExAuGIAEGLADGEMYyAMYigXYAQHCAhYQLhiABBiwAxhDGOUEGMgDGIoF2AEBwgIKEAAYgAQYQxiKBcICCBAuGIAEGLEDwgILEAAYgAQYsQMYgwHCAggQABiABBixA8ICBRAuGIAEmAMAiAYBkAYTugYGCAEQARgJkgcFMS40LjGgB4cssgcFMC40LjG4B94F&sclient=gws-wiz-serp#vhid=uVTuOpn59Dg7rM&vssid=_ASv3Z_XyN6Tfp84PhbyLGA_78
https://nextjs.org/docs/messages/next-router-not-mounted
https://www.bestbuy.ca/en-ca/search?path=category%253AComputers%2B%2526%2BTablets%253Bcategory%253ALaptops%2B%2526%2BMacBooks&search=laptops
https://react-icons.github.io/react-icons/search/#q=menu
*/