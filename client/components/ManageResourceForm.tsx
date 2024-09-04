"use client";
import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ManageResourceFormProps } from "@/types";

export default function ManageResourceForm({
  actionType,
  resourceType,
  formTitle,
  inputPlaceholder,
  confirmPlaceholder,
  successMessage,
  submitEndpoint,
  redirectUrl,
}: ManageResourceFormProps) {
  const { id } = useParams(); // For delete cases where the resource ID is needed
  const [inputValue, setInputValue] = useState("");
  const [confirmationText, setConfirmationText] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  // Ensure id is a string (handle string[] case)
  const resourceId = Array.isArray(id) ? id[0] : id;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (actionType === "delete" && confirmationText.toLowerCase() !== "delete") {
      setError("You must type 'delete' to confirm.");
      return;
    }

    if (actionType === "create" && !inputValue) {
      setError(`You must provide a ${resourceType} name.`);
      return;
    }

    try {
      const response = await fetch(submitEndpoint(resourceId), {
        method: actionType === "delete" ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: actionType === "create" ? JSON.stringify({ name: inputValue }) : undefined,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || `Failed to ${actionType} ${resourceType}.`);
        return;
      }

      setSuccess(successMessage);
      setTimeout(() => {
        router.push(redirectUrl); // Redirect after success
      }, 2000);
    } catch (error) {
      console.error(`Error ${actionType} ${resourceType}:`, error);
      setError(`An unexpected error occurred while trying to ${actionType} the ${resourceType}.`);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-6 shadow-lg bg-white/80 backdrop-blur-sm">
      <h2 className="font-bold text-2xl text-neutral-800 mb-2">{formTitle}</h2>

      {actionType === "create" ? (
        <>
          <p className="text-neutral-600 text-sm mb-4">Enter the new {resourceType} name:</p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder={inputPlaceholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded-md bg-white"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded-md font-medium shadow-md transition duration-300 ease-in-out transform hover:scale-105"
              type="submit"
            >
              Add {resourceType}
            </button>
          </form>
        </>
      ) : (
        <>
          <p className="text-neutral-600 text-sm mb-4">
            Are you sure you want to delete this {resourceType}? Type <strong>delete</strong> below to confirm.
          </p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder={confirmPlaceholder}
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
        </>
      )}
    </div>
  );
}
