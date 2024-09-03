"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs } from "@/components/ui/tabs";
import { ParallaxScroll } from "@/components/ui/parallax-scroll";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import Image from "next/image";
import Link from "next/link";

type Recipe = {
  id: number;
  title: string;
  image: string;
  description: string;
  instructions: string[];
};

type Category = {
  id: number;
  name: string;
  recipes: Recipe[];
};

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
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
        setError("An unexpected error occurred.");
        console.error(error);
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

  const tabContent = categories.map((category) => ({
    title: category.name,
    value: category.id.toString(),
    content: (
      <div className="flex flex-wrap justify-center gap-6 mt-4">
        {category.recipes && category.recipes.length > 0 ? (
          category.recipes.map((recipe) => (
            <BackgroundGradient
              key={recipe.id}
              className="rounded-[22px] max-w-md p-4 sm:p-10 bg-white dark:bg-zinc-900"
            >
              <Image
                src={recipe.image || `/default-image.jpg`} // Provide a default image if none is available
                alt={recipe.title}
                height="200"
                width="200"
                className="object-cover rounded-md"
              />
              <h3 className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
                {recipe.title || "No Title"}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {recipe.description || "No description available"}
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                {recipe.instructions
                  ? recipe.instructions.join(" ")
                  : "No instructions provided."}
              </p>
            </BackgroundGradient>
          ))
        ) : (
          <p className="text-center text-neutral-600 dark:text-neutral-400">
            No recipes available in this category.
          </p>
        )}
      </div>
    ),
  }));

  const imageSources = tabContent
    .map((tab) => {
      if (
        tab.content &&
        typeof tab.content === "object" &&
        "props" in tab.content
      ) {
        const children = tab.content.props.children;
        if (Array.isArray(children) && children[0]?.props?.src) {
          return children[0].props.src;
        }
      }
      return null;
    })
    .filter((src) => src !== null);

  return (
    <div className="relative w-full h-full">
      {/* Logo and Site Name */}
      <div className="absolute top-4 left-4 flex items-center space-x-4">
        <Image
          src="/logo.png"
          alt="Smart Chef AI Logo"
          width={40}
          height={40}
          className="object-contain"
        />
        <span className="text-2xl font-bold text-white">Smart Chef AI</span>
      </div>

      <div className="absolute top-4 right-28"> {/* Adjusted right margin */}
        <Link href="/new-recipe">
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
            New Recipe
          </button>
        </Link>
      </div>

      {/* Logout Button */}
      <div className="absolute top-4 right-4"> {/* This stays at right 4 */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>

      {/* Tabs Component */}
      <div className="flex flex-col items-center justify-center mt-12">
        <Tabs
          tabs={tabContent}
          containerClassName="flex flex-wrap justify-center"
          activeTabClassName="bg-purple-600 text-white"
          tabClassName="text-sm font-medium px-4 py-2 m-2"
          contentClassName="w-full"
        />
      </div>

      {/* Parallax Scroll Component */}
      <ParallaxScroll
        images={imageSources as string[]}
        className="mt-8"
      />

      {error && (
        <div className="text-red-500 text-center mt-4">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
