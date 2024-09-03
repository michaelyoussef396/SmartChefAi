"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewRecipe() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [categories, setCategories] = useState("");
  const [ingredients, setIngredients] = useState([{ name: "", quantity: "" }]);
  const [image, setImage] = useState<File | null>(null);  // New state for image
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "" }]);
  };

  const handleIngredientChange = (index: number, field: string, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field as keyof typeof newIngredients[0]] = value;
    setIngredients(newIngredients);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImage(event.target.files[0]);
    }
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
    if (image) {
      formData.append("image", image);  // Attach image if available
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
        router.push("/"); // Redirect to the homepage after a successful creation
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="max-w-md w-full mx-auto mt-20 p-4 shadow-lg bg-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Create a New Recipe</h2>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Recipe Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Instructions (Separate steps by new line)
          </label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Categories (Separate by commas)
          </label>
          <input
            type="text"
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Ingredients
          </label>
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex space-x-4 mb-2">
              <input
                type="text"
                placeholder="Ingredient Name"
                value={ingredient.name}
                onChange={(e) =>
                  handleIngredientChange(index, "name", e.target.value)
                }
                className="block w-1/2 px-3 py-2 border rounded-md"
                required
              />
              <input
                type="text"
                placeholder="Quantity"
                value={ingredient.quantity}
                onChange={(e) =>
                  handleIngredientChange(index, "quantity", e.target.value)
                }
                className="block w-1/2 px-3 py-2 border rounded-md"
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
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Recipe Image
          </label>
          <input
            type="file"
            onChange={handleImageChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Create Recipe
        </button>
      </form>
    </div>
  );
}
