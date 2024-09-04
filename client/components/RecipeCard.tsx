import Link from "next/link";
import { BackgroundGradient } from "./ui/background-gradient";
import { Recipe, RecipeCardProps } from "@/types";


export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <BackgroundGradient className="rounded-[22px] max-w-md p-4 sm:p-10 bg-white dark:bg-zinc-900">
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
  );
}
