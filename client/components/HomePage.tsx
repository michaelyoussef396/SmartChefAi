"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs } from "@/components/ui/tabs";
import { RecipeCard } from "@/components/RecipeCard";
import { Buttons } from "@/components/Buttons";
import Image from "next/image"; // Import Image component
import { Category, Recipe } from "@/types";

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string>("");
  const [categoryName, setCategoryName] = useState(""); // State for input
  const [showInput, setShowInput] = useState(false); // Toggle input visibility
  const [isSearchMode, setIsSearchMode] = useState(false); // For search mode
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [activeTab, setActiveTab] = useState<string>("all"); // To track the selected tab
  const router = useRouter();

  useEffect(() => {
    // Fetch all recipes for the "All" tab
    const fetchAllRecipes = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5555/recipes", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || "Failed to fetch recipes");
          return;
        }

        const data: Recipe[] = await response.json();
        setAllRecipes(data);
        setFilteredRecipes(data); // Initially, show all recipes
      } catch (error) {
        setError("An unexpected error occurred while fetching all recipes.");
        console.error("Error fetching all recipes:", error);
      }
    };

    fetchAllRecipes();

    // Fetch categories and their recipes
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5555/categories", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || "Failed to fetch categories");
          return;
        }

        const data: Category[] = await response.json();
        setCategories(data);
      } catch (error) {
        setError("An unexpected error occurred while fetching categories.");
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleLogout = async () => {
    try {
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Handle searching for a category and navigating to the delete page
  const handleCategorySearch = () => {
    const category = categories.find(
      (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
    );

    if (category) {
      router.push(`/delete-category/${category.id}`);
    } else {
      setError(`Category '${categoryName}' not found.`);
    }
  };

  // Filter recipes by category
  const handleTabSelect = async (categoryId: string) => {
    setActiveTab(categoryId); // Set the active tab when clicked

    try {
      let url = "http://127.0.0.1:5555/recipes";
      if (categoryId !== "all") {
        url += `?category_id=${categoryId}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Failed to fetch recipes");
        return;
      }

      const data: Recipe[] = await response.json();
      setFilteredRecipes(data);
    } catch (error) {
      setError("An unexpected error occurred while fetching recipes.");
      console.error("Error fetching recipes:", error);
    }
  };

  // Filter recipes by title for search mode
  const searchedRecipes = filteredRecipes.filter((recipe) =>
    recipe.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabContent = [
    {
      title: "All",
      value: "all",
      content: (
        <div className="flex flex-wrap justify-center gap-6 mt-4">
          {filteredRecipes.length === 0 ? (
            <p className="text-center text-neutral-600 dark:text-neutral-400">
              No recipes available.
            </p>
          ) : (
            filteredRecipes.map((recipe, index) =>
              recipe ? <RecipeCard key={index} recipe={recipe} /> : null
            )
          )}
        </div>
      ),
    },
    ...categories.map((category) => ({
      title: category.name,
      value: category.id.toString(),
      content: (
        <div className="flex flex-wrap justify-center gap-6 mt-4">
          {category.recipes && category.recipes.length > 0 ? (
            category.recipes.map((recipe, index) =>
              recipe ? <RecipeCard key={index} recipe={recipe} /> : null
            )
          ) : null}
        </div>
      ),
    })),
  ];

  return (
    <div className="relative w-full min-h-screen">
      {/* Logo and Site Name */}
      <div className="absolute top-2 left-4 flex items-center space-x-2">
        <Image
          src="/logo.png" // Make sure your logo is in the public directory
          alt="Logo"
          width={40}
          height={40}
        />
        <span className="text-2xl font-bold text-white">Smart Chef AI</span>
      </div>

      {/* Buttons */}
      <Buttons
        showInput={showInput}
        setShowInput={setShowInput}
        handleCategorySearch={handleCategorySearch}
        handleLogout={handleLogout}
        categoryName={categoryName}
        setCategoryName={setCategoryName}
        isSearchMode={isSearchMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setIsSearchMode={setIsSearchMode}
      />

      {/* Tabs Component */}
      <div
        className={`flex flex-col items-center justify-center mt-4 pt-16 transition-opacity duration-500 ${
          isSearchMode ? "fade-out" : ""
        }`}
      >
        <Tabs
          tabs={tabContent}
          activeTab={activeTab} // Pass the active tab state
          onTabSelect={handleTabSelect}  // Pass the handler for tab selection
          containerClassName="flex flex-wrap justify-center"
          activeTabClassName="bg-purple-600 text-white"
          tabClassName="text-sm font-medium px-4 py-2 m-2"
          contentClassName="w-full"
        />
      </div>

      {/* Search Results */}
      {isSearchMode && (
        <div className="flex flex-wrap justify-center gap-6 mt-4">
          {searchedRecipes.length === 0 ? (
            <p className="text-center text-neutral-600 dark:text-neutral-400">
              No recipes found.
            </p>
          ) : (
            searchedRecipes.map((recipe, index) => (
              <RecipeCard key={index} recipe={recipe} />
            ))
          )}
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center mt-4">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
