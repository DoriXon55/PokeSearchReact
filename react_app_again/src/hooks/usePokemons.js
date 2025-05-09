import { useState, useCallback, useEffect } from "react";
import { pokemonApi } from "./api";

const usePokemons = () => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const limit = 20;  
  const [hasNextPage, setHasNextPage] = useState(true);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  const fetchPokemons = useCallback(async (page = 0) => {
    setLoading(true);
    setError(null);
    try {
      const offset = page * limit;
      const response = await pokemonApi.getPokemons(limit, offset);
      
      const pokemonList = response.data.results || []; 
      
      setPokemons(pokemonList);
      setCurrentPage(page);
      
      setHasNextPage(!!response.data.next);
      
      setHasPrevPage(!!response.data.previous);
    } catch (err) {
      setError("Wystąpił błąd podczas pobierania listy pokemonów");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const searchPokemon = useCallback(async (nameOrId) => {
    if (!nameOrId) return;
    setLoading(true);
    setError(null);

    try {
      const response = await pokemonApi.searchPokemon(nameOrId.toLowerCase());
      const result = response.data;
      
      // Obsługa zarówno pojedynczych wyników jak i list
      setPokemons(Array.isArray(result) ? result : [result]);
      setHasNextPage(false);
      setHasPrevPage(false);
    } catch (err) {
      setError("Nie znaleziono pokemona");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const resetSearch = useCallback(() => {
    fetchPokemons(0);
  }, [fetchPokemons]);

  const goToNextPage = useCallback(() => {
    if (hasNextPage) {
      fetchPokemons(currentPage + 1);
    }
  }, [fetchPokemons, hasNextPage, currentPage]);

  const goToPrevPage = useCallback(() => {
    if (hasPrevPage) {
      fetchPokemons(currentPage - 1);
    }
  }, [fetchPokemons, hasPrevPage, currentPage]);

  // Przy pierwszym rendrowaniu pobierz pokemony
  useEffect(() => {
    fetchPokemons(0);
  }, [fetchPokemons]);

  return {
    pokemons,
    loading,
    error,
    searchPokemon,
    resetSearch,
    goToNextPage,
    goToPrevPage,
    hasNextPage,
    hasPrevPage,
  };
};

export default usePokemons;