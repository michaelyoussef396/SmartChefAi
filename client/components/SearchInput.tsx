import { SearchInputProps } from "@/types";

  
  export function SearchInput({
    isSearchMode,
    searchQuery,
    setSearchQuery,
    setIsSearchMode,
  }: SearchInputProps) {
    return (
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
    );
  }
  