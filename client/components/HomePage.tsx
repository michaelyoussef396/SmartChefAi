"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs } from "@/components/ui/tabs";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import Link from "next/link";

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
        console.log("Fetched all recipes:", data); // Debugging: Check the fetched data
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
        console.log("Fetched categories:", data); // Debugging: Check the fetched data
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
            allRecipes.map((recipe, index) => (
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
            ))
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
            category.recipes.map((recipe, index) => (
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
            ))
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
      <div className="absolute top-2 left-4 flex items-center space-x-4">
        <span className="text-2xl font-bold text-white">Smart Chef AI</span>
      </div>

      <div className="absolute top-2 right-28">
        <Link href="/new-recipe">
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
            New Recipe
          </button>
        </Link>
      </div>

      {/* Logout Button */}
      <div className="absolute top-2 right-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>

      {/* Tabs Component */}
      <div className="flex flex-col items-center justify-center mt-4 pt-16"> {/* Adjust margin and padding */}
        <Tabs
          tabs={tabContent}
          containerClassName="flex flex-wrap justify-center"
          activeTabClassName="bg-purple-600 text-white"
          tabClassName="text-sm font-medium px-4 py-2 m-2"
          contentClassName="w-full"
        />
      </div>

      {error && (
        <div className="text-red-500 text-center mt-4">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
