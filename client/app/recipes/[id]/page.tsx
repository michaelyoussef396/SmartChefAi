"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

type RecipeDetail = {
  id: number;
  title: string;
  description: string;
  instructions: string[];
  ingredients: { name: string; quantity: string }[];
  categories: string[];
};

export default function RecipeDetailPage() {
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [error, setError] = useState<string>("");
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5555/recipes/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || "Failed to fetch recipe details.");
          return;
        }

        const data: RecipeDetail = await response.json();
        setRecipe(data);
      } catch (error) {
        setError("An unexpected error occurred while fetching the recipe details.");
        console.error("Error fetching recipe details:", error);
      }
    };

    fetchRecipe();
  }, [id]);

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  if (!recipe) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">{recipe.title}</h1>
      <p className="mt-4 text-neutral-600 dark:text-neutral-400">{recipe.description}</p>

      <h2 className="mt-8 text-2xl font-semibold text-neutral-800 dark:text-neutral-200">Instructions</h2>
      <ul className="list-disc pl-5 mt-2">
        {recipe.instructions.map((instruction, index) => (
          <li key={index} className="text-neutral-600 dark:text-neutral-400">{instruction}</li>
        ))}
      </ul>

      <h2 className="mt-8 text-2xl font-semibold text-neutral-800 dark:text-neutral-200">Ingredients</h2>
      <ul className="list-disc pl-5 mt-2">
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index} className="text-neutral-600 dark:text-neutral-400">
            {ingredient.quantity} of {ingredient.name}
          </li>
        ))}
      </ul>

      <h2 className="mt-8 text-2xl font-semibold text-neutral-800 dark:text-neutral-200">Categories</h2>
      <ul className="list-disc pl-5 mt-2">
        {recipe.categories.map((category, index) => (
          <li key={index} className="text-neutral-600 dark:text-neutral-400">{category}</li>
        ))}
      </ul>
    </div>
  );
}
