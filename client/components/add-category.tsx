import ManageResourceForm from "@/components/ManageResourceForm";

export default function AddCategory() {
  return (
    <ManageResourceForm
      actionType="create"
      resourceType="category"
      formTitle="Add Category"
      inputPlaceholder="Category name"
      successMessage="Category added successfully!"
      submitEndpoint={() => `http://127.0.0.1:5555/categories`}
      redirectUrl="/"
    />
  );
}
