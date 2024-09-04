"use client";
import ManageResourceForm from "@/components/ManageResourceForm";
import { useParams } from "next/navigation";

export default function DeleteCategory() {
  const { id } = useParams();

  return (
    <ManageResourceForm
      actionType="delete"
      resourceType="category"
      formTitle="Delete Category"
      confirmPlaceholder="Type 'delete' to confirm"
      successMessage="Category deleted successfully!"
      submitEndpoint={(id) => `http://127.0.0.1:5555/categories/${id}`}
      redirectUrl="/"
    />
  );
}
