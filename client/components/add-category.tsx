"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddCategory() {
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleAddCategory = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!categoryName) {
      setError("You must provide a category name.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5555/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: categoryName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Failed to add category.");
        return;
      }

      setSuccess(`Category '${categoryName}' added successfully!`);
      setTimeout(() => {
        router.push("/"); // Redirect to homepage after adding category
      }, 2000);
    } catch (error) {
      console.error("Error adding category:", error);
      setError("An unexpected error occurred while adding the category.");
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-6 shadow-lg bg-white/80 backdrop-blur-sm">
      <h2 className="font-bold text-2xl text-neutral-800 mb-2">Add Category</h2>
      <p className="text-neutral-600 text-sm mb-4">
        Enter the new category name:
      </p>

      <form className="space-y-4" onSubmit={handleAddCategory}>
        <input
          type="text"
          placeholder="Category name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border rounded-md bg-white"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        <button
          className="bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded-md font-medium shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          type="submit"
        >
          Add Category
        </button>
      </form>
    </div>
  );
}
