import React, { useState } from "react";

const SearchBar = ({onSearch, onReset, darkMode}) => {
  const [query, setQuery] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleReset = () => {
    setQuery(""); // Clear the input field
    onReset(); // Call the parent's reset function
  };
  

  return (
    <form onSubmit={handleSubmit} className="flex justify-center mb-8">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search pokemon with his name or ID"
        className={`border px-4 py-2 w-full max-w-md rounded-l
          ${darkMode
            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
            : 'bg-white border-gray-300 text-black placeholder-gray-500'
          }`}
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-r"
      >
        Szukaj
      </button>

      <button
        type="button"
        onClick={handleReset}
        className={`px-6 py-2 rounded-r
          ${darkMode
            ? 'bg-gray-600 hover:bg-gray-500 text-white'
            : 'bg-gray-300 hover:bg-gray-400 text-black'
          }`}
      >
        Reset
      </button>



    </form>
  );
};

export default SearchBar;
