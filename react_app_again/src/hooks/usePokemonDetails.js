import { useState, useEffect } from "react";
import axios from "axios";

const usePokemonDetails = (pokemonId) => {
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [evolutionChain, setEvolutionChain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      if (!pokemonId) return;
      setLoading(true);
      setError(null);

      try {
        const pokemonResponse = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
        );

        try {
          const speciesResponse = await axios.get(
            pokemonResponse.data.species.url
          );

          if (speciesResponse.data.evolution_chain) {
            try {
              const evolutionResponse = await axios.get(
                speciesResponse.data.evolution_chain.url 
              );
              setEvolutionChain(evolutionResponse.data);
            } catch (evolErr) {
              console.error(
                "Błąd podczas pobierania danych o ewolucji:",
                evolErr
              );
            }
          }
          setSpecies(speciesResponse.data);
        } catch (spiecesErr) {
          console.error(
            "Błąd podczas pobeirania danych o gatunku: ",
            spiecesErr
          );
        }
        setPokemon(pokemonResponse.data);
      } catch (err) {
        setError("Nie udało się pobrać szczegółów pokemona");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPokemonDetails();
  }, [pokemonId]);

  return { pokemon, species, evolutionChain, loading, error };
};

export default usePokemonDetails;
