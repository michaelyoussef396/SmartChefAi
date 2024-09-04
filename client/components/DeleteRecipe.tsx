"use client";
import ManageResourceForm from "@/components/ManageResourceForm";
import { useParams } from "next/navigation";

export default function DeleteRecipe() {
  const { id } = useParams();

  return (
    <ManageResourceForm
      actionType="delete"
      resourceType="recipe"
      formTitle="Delete Recipe"
      confirmPlaceholder="Type 'delete' to confirm"
      successMessage="Recipe deleted successfully!"
      submitEndpoint={(id) => `http://127.0.0.1:5555/recipes/${id}`}
      redirectUrl="/"
    />
  );
}
