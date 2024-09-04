"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs } from "@/components/ui/tabs";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import Link from "next/link";
import Image from "next/image"; // Import Image component

type Recipe = {
  id: number;
  title?: string;
  description?: string;
  instructions?: string[];
};

type Category = {
  id: number;
  name: string;
  recipes: Recipe[];
};

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string>("");
  const [categoryName, setCategoryName] = useState(""); // State for input
  const [showInput, setShowInput] = useState(false); // Toggle input visibility
  const [isSearchMode, setIsSearchMode] = useState(false); // For search mode
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
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

  // Filter recipes by title for search mode
  const filteredRecipes = allRecipes.filter((recipe) =>
    recipe.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabContent = [
    {
      title: "All",
      value: "all",
      content: (
        <div className="flex flex-wrap justify-center gap-6 mt-4">
          {allRecipes.length === 0 ? (
            <p className="text-center text-neutral-600 dark:text-neutral-400">
              No recipes available.
            </p>
          ) : (
            allRecipes.map((recipe, index) =>
              recipe ? (
                <BackgroundGradient
                  key={index}
                  className="rounded-[22px] max-w-md p-4 sm:p-10 bg-white dark:bg-zinc-900"
                >
                  <h3 className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
                    {recipe.title || "No Title"}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {recipe.description || "No description available"}
                  </p>
                  <Link href={`/recipes/${recipe.id}`}>
                    <button className="mt-2 text-white bg-green-500 hover:bg-green-600 font-bold py-2 px-4 rounded">
                      View Recipe
                    </button>
                  </Link>
                </BackgroundGradient>
              ) : null
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
              recipe ? (
                <BackgroundGradient
                  key={index}
                  className="rounded-[22px] max-w-md p-4 sm:p-10 bg-white dark:bg-zinc-900"
                >
                  <h3 className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
                    {recipe.title || "No Title"}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {recipe.description || "No description available"}
                  </p>
                  <Link href={`/recipes/${recipe.id}`}>
                    <button className="mt-2 text-white bg-green-500 hover:bg-green-600 font-bold py-2 px-4 rounded">
                      View Recipe
                    </button>
                  </Link>
                </BackgroundGradient>
              ) : null
            )
          ) : (
            <p className="text-center text-neutral-600 dark:text-neutral-400">
              No recipes available in this category.
            </p>
          )}
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
      <div className="absolute top-2 right-4 flex space-x-4">
        {/* Search Button */}
        <div className="flex items-center space-x-2">
          {isSearchMode ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-2 rounded-md"
              />
              <button
                onClick={() => setIsSearchMode(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsSearchMode(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Search
            </button>
          )}
        </div>

        {/* Delete Category Toggle */}
        <div className="flex items-center space-x-2">
          {showInput ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="px-3 py-2 rounded-md"
              />
              <button
                onClick={handleCategorySearch}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowInput(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowInput(true)}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Delete Category
            </button>
          )}
        </div>

        <Link href="/new-recipe">
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
            New Recipe
          </button>
        </Link>

        <Link href="/add-category">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Add Category
          </button>
        </Link>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>

      {/* Tabs Component */}
      <div
        className={`flex flex-col items-center justify-center mt-4 pt-16 transition-opacity duration-500 ${
          isSearchMode ? "fade-out" : ""
        }`}
      >
        <Tabs
          tabs={tabContent}
          containerClassName="flex flex-wrap justify-center"
          activeTabClassName="bg-purple-600 text-white"
          tabClassName="text-sm font-medium px-4 py-2 m-2"
          contentClassName="w-full"
        />
      </div>

      {/* Search Results */}
      {isSearchMode && (
        <div className="flex flex-wrap justify-center gap-6 mt-4">
          {filteredRecipes.length === 0 ? (
            <p className="text-center text-neutral-600 dark:text-neutral-400">
              No recipes found.
            </p>
          ) : (
            filteredRecipes.map((recipe, index) => (
              <BackgroundGradient
                key={index}
                className="rounded-[22px] max-w-md p-4 sm:p-10 bg-white dark:bg-zinc-900"
              >
                <h3 className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
                  {recipe.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {recipe.description}
                </p>
                <Link href={`/recipes/${recipe.id}`}>
                  <button className="mt-2 text-white bg-green-500 hover:bg-green-600 font-bold py-2 px-4 rounded">
                    View Recipe
                  </button>
                </Link>
              </BackgroundGradient>
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
