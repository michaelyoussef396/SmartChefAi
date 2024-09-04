export type RecipeDetail = {
    id: number;
    title: string;
    description: string;
    instructions: string[];
    ingredients: { name: string; quantity: string }[];
    categories: string[];
  };

  export type ButtonsProps = {
    showInput: boolean;
    setShowInput: (show: boolean) => void;
    handleCategorySearch: () => void;
    handleLogout: () => void;
    categoryName: string;
    setCategoryName: (name: string) => void;
    isSearchMode: boolean;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    setIsSearchMode: (mode: boolean) => void;
  };

export type Recipe = {
    id: number;
    title?: string;
    description?: string;
    instructions?: string[];
  };
  
export type Category = {
    id: number;
    name: string;
    recipes: Recipe[];
  };

export type ManageResourceFormProps = {
    actionType: "create" | "delete";
    resourceType: "category" | "recipe";
    formTitle: string;
    inputPlaceholder?: string;
    confirmPlaceholder?: string;
    successMessage: string;
    submitEndpoint: (id?: string) => string;
    redirectUrl: string;
  };
  
export type SearchInputProps = {
    isSearchMode: boolean;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    setIsSearchMode: (mode: boolean) => void;
  };
  
export type RecipeCardProps = {
    recipe: Recipe;
  };