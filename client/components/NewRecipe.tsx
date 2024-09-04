"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("flex flex-col w-full", className)}>{children}</div>;
};

export default function NewRecipe() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [categories, setCategories] = useState("");
  const [ingredients, setIngredients] = useState([{ name: "", quantity: "" }]);
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [useAI, setUseAI] = useState(false); // New state to toggle AI/manual input
  const [aiUrl, setAiUrl] = useState(""); // State to store the recipe URL
  const router = useRouter();

  // Add Ingredient Handling
  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "" }]);
  };

  // Handle Ingredient Change
  const handleIngredientChange = (index: number, field: string, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field as keyof typeof newIngredients[0]] = value;
    setIngredients(newIngredients);
  };

  // Handle Image Change
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImage(event.target.files[0]);
    }
  };

  // Handle AI recipe submission
  const handleAISubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    try {
      const response = await fetch("http://127.0.0.1:5555/parse-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: aiUrl }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error);
        return;
      }
  
      const recipeData = await response.json();
  
      // Auto-fill the form fields based on the AI-extracted data
      setTitle(recipeData.title || "");
      setDescription(recipeData.description || "");
      setInstructions(recipeData.instructions?.join("\n") || "");
      setIngredients(recipeData.ingredients || [{ name: "", quantity: "" }]);
      setCategories(recipeData.categories?.join(", ") || "");
  
      setSuccess("Recipe successfully retrieved from AI!");
  
    } catch (error) {
      console.error("Error fetching AI recipe:", error);
      setError("An unexpected error occurred while fetching the recipe.");
    }
  };

  // Handle Manual recipe submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("instructions", instructions);
    formData.append("categories", categories);
    ingredients.forEach((ingredient, index) => {
      formData.append(`ingredients[${index}][name]`, ingredient.name);
      formData.append(`ingredients[${index}][quantity]`, ingredient.quantity);
    });
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch("http://127.0.0.1:5555/recipes", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error);
        return;
      }

      setSuccess("Recipe created successfully!");
      setTimeout(() => {
        router.push("/"); // Redirect to the homepage after successful creation
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-6 shadow-lg bg-white/80 backdrop-blur-sm">
      <h2 className="font-bold text-2xl text-neutral-800 mb-2">Create a New Recipe</h2>
      <p className="text-neutral-600 text-sm mb-4">
        Fill out the form below to add a new recipe to your collection, or use AI to add a recipe automatically.
      </p>

      {/* Toggle between Manual Entry and AI Entry */}
      <div className="flex justify-between mb-4">
        <button
          type="button"
          className={`px-4 py-2 rounded-md font-medium transition ${useAI ? "bg-neutral-300" : "bg-purple-600 text-white"}`}
          onClick={() => setUseAI(false)}
        >
          Manual Entry
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-md font-medium transition ${useAI ? "bg-purple-600 text-white" : "bg-neutral-300"}`}
          onClick={() => setUseAI(true)}
        >
          Use AI
        </button>
      </div>

      {/* Conditionally Render the Form */}
      {useAI ? (
        <form className="space-y-4" onSubmit={handleAISubmit}>
          <LabelInputContainer>
            <Label htmlFor="aiUrl">Recipe URL</Label>
            <Input
              id="aiUrl"
              name="aiUrl"
              placeholder="Enter the recipe URL"
              type="url"
              className="mt-1 block w-full px-3 py-2 border rounded-md bg-white" // Ensure white background
              onChange={(e) => setAiUrl(e.target.value)}
              required
            />
          </LabelInputContainer>

          <button
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white w-full py-2 rounded-md font-medium shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            type="submit"
          >
            Retrieve Recipe from AI
          </button>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit} encType="multipart/form-data">
          <LabelInputContainer>
            <Label htmlFor="title">Recipe Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Recipe Title"
              type="text"
              className="mt-1 block w-full px-3 py-2 border rounded-md bg-white"
              value={title}
              required
              onChange={(e) => setTitle(e.target.value)}
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe the recipe"
              className="mt-1 block w-full px-3 py-2 border rounded-md bg-white"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="instructions">Instructions (Separate steps by new line)</Label>
            <textarea
              id="instructions"
              name="instructions"
              placeholder="Step 1: ..."
              className="mt-1 block w-full px-3 py-2 border rounded-md bg-white"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              required
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="categories">Categories (Separate by commas)</Label>
            <Input
              id="categories"
              name="categories"
              placeholder="Breakfast, Vegetarian"
              type="text"
              className="mt-1 block w-full px-3 py-2 border rounded-md bg-white"
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="ingredients">Ingredients</Label>
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex space-x-4 mb-2">
                <Input
                  placeholder="Ingredient Name"
                  value={ingredient.name}
                  className="bg-white"
                  onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                  required
                />
                <Input
                  placeholder="Quantity"
                  value={ingredient.quantity}
                  className="bg-white"
                  onChange={(e) => handleIngredientChange(index, "quantity", e.target.value)}
                  required
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddIngredient}
              className="text-blue-500 hover:underline"
            >
              + Add Another Ingredient
            </button>
          </LabelInputContainer>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <button
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white w-full py-2 rounded-md font-medium shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            type="submit"
          >
            Create Recipe
          </button>
        </form>
      )}
    </div>
  );
}
