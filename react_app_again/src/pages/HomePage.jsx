import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PokemonList from '../components/PokemonList';
import SearchBar from '../components/SearchBar';
import usePokemonApi from '../hooks/usePokemonApi';

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const { 
    pokemons, 
    loading, 
    error, 
    searchPokemon,
    goToNextPage,
    goToPrevPage,
    hasNextPage,
    hasPrevPage,
    darkMode
  } = usePokemonApi();

  useEffect(() => {
    if (searchQuery)
    {
      searchPokemon(searchQuery);
    }
  }, [searchQuery]);

  const handleSearch = (query) => {
    searchPokemon(query);
    setSearchParams({search: query});
  };

  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Pokédex</h1>
      {/* Przekaż funkcję searchPokemon jako prop */}
      <SearchBar onSearch={handleSearch} darkMode={darkMode}/>
      {/* Przekaż dane i funkcje jako props */}
      <PokemonList 
        pokemons={pokemons}
        loading={loading}
        error={error}
        goToNextPage={goToNextPage}
        goToPrevPage={goToPrevPage}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        darkMode={darkMode}
      />
    </div>
  );
};

export default HomePage;
