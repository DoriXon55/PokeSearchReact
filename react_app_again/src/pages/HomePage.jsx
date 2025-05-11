import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PokemonList from "../components/PokemonList";
import SearchBar from "../components/SearchBar";
import usePokemonApi from "../hooks/usePokemonApi";

const HomePage = ({ darkMode }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const {
    pokemons,
    loading,
    error,
    searchPokemon,
    resetSearch,
    goToNextPage,
    goToPrevPage,
    hasNextPage,
    hasPrevPage,
  } = usePokemonApi();

  useEffect(() => {
    const fetchData = async () => {
      if (searchQuery) {
        await searchPokemon(searchQuery);
      } else {
        resetSearch();
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleSearch = (query) => {
    setSearchParams({ search: query });
  };

  const handleReset = () => {
    setSearchParams({});
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Pokédex</h1>
      <SearchBar
        onSearch={handleSearch}
        onReset={handleReset}
        darkMode={darkMode}
      />
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
