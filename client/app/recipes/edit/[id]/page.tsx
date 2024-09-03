"use client";
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter, useParams } from "next/navigation";

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("flex flex-col w-full", className)}>{children}</div>;
};

export default function EditRecipe() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [categories, setCategories] = useState("");
  const [ingredients, setIngredients] = useState([{ name: "", quantity: "" }]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { id } = useParams();
  const router = useRouter();

  // Fetch the recipe data when the component mounts
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

        const data = await response.json();

        // Pre-fill the form with the fetched data
        setTitle(data.title);
        setDescription(data.description);
        setInstructions(data.instructions.join("\n"));
        setCategories(data.categories.join(", "));
        setIngredients(
          data.ingredients.map((ingredient: any) => ({
            name: ingredient.name,
            quantity: ingredient.quantity,
          }))
        );
      } catch (error) {
        setError("An unexpected error occurred while fetching the recipe details.");
        console.error("Error fetching recipe details:", error);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "" }]);
  };

  const handleIngredientChange = (index: number, field: string, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field as keyof typeof newIngredients[0]] = value;
    setIngredients(newIngredients);
  };

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

    try {
      const response = await fetch(`http://127.0.0.1:5555/recipes/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'An error occurred');
        return;
      }

      setSuccess("Recipe updated successfully!");
      setTimeout(() => {
        router.push("/"); // Redirect to the homepage after a successful update
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-6 shadow-lg bg-white/80 backdrop-blur-sm">
      <h2 className="font-bold text-2xl text-neutral-800 mb-2">Edit Recipe</h2>
      <p className="text-neutral-600 text-sm mb-4">Update the form below to edit your recipe.</p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <LabelInputContainer>
          <Label htmlFor="title">Recipe Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="Recipe Title"
            type="text"
            className="mt-1 block w-full px-3 py-2 border rounded-md bg-white"
            required
            value={title}
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
          Update Recipe
        </button>
      </form>
    </div>
  );
}
