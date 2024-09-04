import Link from "next/link";
import { ButtonsProps } from "@/types";
  
  export function Buttons({
    showInput,
    setShowInput,
    handleCategorySearch,
    handleLogout,
    categoryName,
    setCategoryName,
    isSearchMode,
    searchQuery,
    setSearchQuery,
    setIsSearchMode,
  }: ButtonsProps) {
    return (
      <div className="absolute top-2 right-4 flex space-x-4">
        {/* Delete Category */}
        <div className="flex items-center space-x-2">
          {showInput ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="px-3 py-2 rounded-md"
              />
              <button
                onClick={handleCategorySearch}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowInput(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowInput(true)}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Delete Category
            </button>
          )}
        </div>
  
        {/* Search Button */}
        <div className="flex items-center space-x-2">
          {isSearchMode ? (
            <>
              <input
                type="text"
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-2 rounded-md"
              />
              <button
                onClick={() => setIsSearchMode(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsSearchMode(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Search
            </button>
          )}
        </div>
  
        {/* New Recipe */}
        <Link href="/new-recipe">
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
            New Recipe
          </button>
        </Link>
  
        {/* Add Category */}
        <Link href="/add-category">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Add Category
          </button>
        </Link>
  
        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
    );
  }