import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const usePokemonApi = (limit = 20) => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}`
  );
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  const searchPokemon = async (nameOrId) => {
    if (!nameOrId) return;
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${nameOrId.toLowerCase()}`
      );
      setPokemons([response.data]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(url);
        setNextPage(response.data.next);
        setPrevPage(response.data.previous);

        const pokemonDetails = await Promise.all(
          response.data.results.map(async (pokemon) => {
            const detailResponse = await axios.get(pokemon.url);
            return detailResponse.data;
          })
        );
        setPokemons(pokemonDetails);
      } catch (err) {
        setError("Wystąpił błąd podczas pobierania danych o pokemonie");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);

  const goToNextPage = () => nextPage && setUrl(nextPage);
  const goToPrevPage = () => prevPage && setUrl(prevPage);

  return {
    pokemons,
    loading,
    error,
    searchPokemon,
    goToNextPage,
    goToPrevPage,
    hasNextPage: Boolean(nextPage),
    hasPrevPage: Boolean(prevPage),
  };
};

export default usePokemonApi;
