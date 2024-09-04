"use client";
import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function DeleteRecipe() {
  const [confirmationText, setConfirmationText] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { id } = useParams();
  const router = useRouter();

  const handleDelete = async (event: React.FormEvent) => {
    event.preventDefault();

    if (confirmationText.toLowerCase() !== "delete") {
      setError("You must type 'delete' to confirm.");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:5555/recipes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Failed to delete recipe.");
        return;
      }

      setSuccess("Recipe deleted successfully!");
      setTimeout(() => {
        router.push("/"); // Redirect to homepage after deletion
      }, 2000);
    } catch (error) {
      console.error("Error deleting recipe:", error);
      setError("An unexpected error occurred while deleting the recipe.");
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-6 shadow-lg bg-white/80 backdrop-blur-sm">
      <h2 className="font-bold text-2xl text-neutral-800 mb-2">Delete Recipe</h2>
      <p className="text-neutral-600 text-sm mb-4">
        Are you sure you want to delete this recipe? Type <strong>delete</strong> below to confirm.
      </p>

      <form className="space-y-4" onSubmit={handleDelete}>
        <input
          type="text"
          placeholder="Type 'delete' to confirm"
          value={confirmationText}
          onChange={(e) => setConfirmationText(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border rounded-md bg-white"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        <button
          className="bg-red-500 hover:bg-red-600 text-white w-full py-2 rounded-md font-medium shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          type="submit"
        >
          Confirm Deletion
        </button>
      </form>
    </div>
  );
}
