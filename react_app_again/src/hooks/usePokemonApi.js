import { useState, useEffect } from "react";
import { pokemonApi } from "./api";

const usePokemonApi = (limit = 20) => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  const fetchPokemons = async (page = 0) => {
    try {
      setLoading(true);
      const offset = page * limit;
      const response = await pokemonApi.getPokemons(limit, offset);
      console.log('API response:', response.data);

      
      if (response.data && response.data.results && Array.isArray(response.data.results)) {
        setNextPage(response.data.next);
        setPrevPage(response.data.previous);
        
        const detailsPromises = response.data.results.map(async (pokemon) => {
          const id = pokemon.url.split('/').filter(Boolean).pop();
          return (await pokemonApi.getPokemonDetails(id)).data;
        });
        
        const pokemonDetails = await Promise.all(detailsPromises);
        setPokemons(pokemonDetails);
      }
      else if (Array.isArray(response.data)) {
        setPokemons(response.data);
        
        setNextPage(response.data.length === limit);
        setPrevPage(page > 0);
      }
      else {
        console.warn("Nieobsługiwany format odpowiedzi API:", response.data);
        setPokemons(response.data.content || []);
        setNextPage(false);
        setPrevPage(false);
      }
      
      setCurrentPage(page);
    } catch (err) {
      setError("Wystąpił błąd podczas pobierania danych o pokemonie");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    fetchPokemons(0);
  };

  const searchPokemon = async (nameOrId) => {
    if (!nameOrId) return;
    setLoading(true);
    setError(null);
    setPokemons([]); 
  
    try {
      const response = await pokemonApi.searchPokemon(nameOrId.toLowerCase());
      
      if (Array.isArray(response.data)) {
        setPokemons(response.data);
      } else {
        setPokemons([response.data]);
      }
      
      setNextPage(null);
      setPrevPage(null);
    } catch (err) {
      console.error("Error searching pokemon:", err);
      setError("Nie znaleziono pokemona o nazwie: " + nameOrId);
      setPokemons([]); 
    } finally {
      setLoading(false);
    }
  };

  const goToNextPage = () => {
    if (nextPage) {
      fetchPokemons(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (prevPage && currentPage > 0) {
      fetchPokemons(currentPage - 1);
    }
  };

  useEffect(() => {
    fetchPokemons(0);
  }, []);

  return {
    pokemons,
    loading,
    error,
    searchPokemon,
    resetSearch,
    goToNextPage,
    goToPrevPage,
    hasNextPage: Boolean(nextPage),
    hasPrevPage: Boolean(prevPage),
  };
};

export default usePokemonApi;