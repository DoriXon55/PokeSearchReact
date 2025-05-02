import React from 'react';
import PokemonCard from './pokemonCard';

// Add darkMode to props
const PokemonList = ({ 
  pokemons, 
  loading, 
  error, 
  goToNextPage, 
  goToPrevPage, 
  hasNextPage, 
  hasPrevPage,
  darkMode 
}) => {
  if (loading)
    return <p className="text-center text-xl">Loading Pokemons...</p>;
  if (error) return <p className="text-center text-red-500 text-xl">{error}</p>;

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 justify-items-center">
        {pokemons.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} darkMode={darkMode} />
        ))}
      </div>
      
      {/* Przyciski paginacji - bez zmian */}
      <div className="flex justify-center gap-4 my-6">
        <button
          onClick={goToPrevPage}
          disabled={!hasPrevPage}
          className={`px-4 py-2 rounded ${
            hasPrevPage
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Poprzednia strona
        </button>

        <button
          onClick={goToNextPage}
          disabled={!hasNextPage}
          className={`px-4 py-2 rounded ${
            hasNextPage
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Następna strona
        </button>
      </div>
    </div>
  );
};

export default PokemonList;