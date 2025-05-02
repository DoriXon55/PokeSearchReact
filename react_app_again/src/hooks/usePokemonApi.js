import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'

const usePokemonApi = () => {
    const [pokemon, setPokemon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

   useEffect(() => {
    const fetchData = async () =>
    {
      try {
        setLoading(true);
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon/1");
        setPokemon(response.data)
      } catch(err)
      {
        setError("Wystąpił błąd podczas pobierania danych o pokemonie");
        console.error(err);
      } finally {
        setLoading(false)
      }
    } 
    fetchData()
  }, [])

  

   
  

    return { pokemon, loading, error }
}

export default usePokemonApi
