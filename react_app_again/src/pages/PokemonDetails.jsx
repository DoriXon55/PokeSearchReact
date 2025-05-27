import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { pokemonApi, favoritesApi } from '../hooks/api';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import EvolutionChain from '../components/EvolutionChain'
import axios from 'axios'; 



//TODO dostosowanie tego pod graphql ze spring
const PokemonDetails = ({ darkMode }) => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null); 
  const [evolutionChain, setEvolutionChain] = useState(null); 
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await pokemonApi.getPokemonDetails(id);
        setPokemon(response.data);

        if (response.data.species?.url) {
          try {
            const speciesResponse = await axios.get(response.data.species.url);
            setSpecies(speciesResponse.data);
            
            if (speciesResponse.data.evolution_chain?.url) {
              try {
                const evolutionResponse = await axios.get(speciesResponse.data.evolution_chain.url);
                setEvolutionChain(evolutionResponse.data);
              } catch (err) {
                console.error("Błąd podczas pobierania łańcucha ewolucji:", err);
              }
            }
          } catch (err) {
            console.error("Błąd podczas pobierania danych gatunku:", err);
          }
        }

        if (isAuthenticated) {
          try {
            const favoriteResponse = await favoritesApi.checkIsFavorite(id);
            setIsFavorite(favoriteResponse.data);
          } catch (error) {
            console.error('Error checking favorite status:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching pokemon details:', error);
        setError('Wystąpił błąd podczas pobierania szczegółów pokemona');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPokemonDetails();
  }, [id, isAuthenticated]);

  const toggleFavorite = async () => {
    if (!isAuthenticated || isTogglingFavorite) return;
    
    setIsTogglingFavorite(true);
    try {
      if (isFavorite) {
        await favoritesApi.removeFromFavorites(id);
        setIsFavorite(false);
      } else {
        await favoritesApi.addToFavorites(id);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setError(error.response?.data || 'An error occurred while updating your favorites.');
    } finally {
      setIsTogglingFavorite(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner darkMode={darkMode} />
      </div>
    );
  }

  if (error && !pokemon) {
    return (
      <div className={`text-center p-8 ${darkMode ? 'text-red-300' : 'text-red-600'}`}>
        <p>{error}</p>
        <Link to="/" className={`mt-4 inline-block px-4 py-2 rounded ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}>
          Back to home page
        </Link>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className={`text-center p-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <p>No Pokemon with ID found: {id}</p>
        <Link to="/" className={`mt-4 inline-block px-4 py-2 rounded ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}>
          Back to home page
        </Link>
      </div>
    );
  }

  const formatId = (id) => {
    return `#${String(id).padStart(3, '0')}`;
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <Link to="/" className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
          &larr; Back to list
        </Link>
        
        {isAuthenticated && (
          <button
            onClick={toggleFavorite}
            disabled={isTogglingFavorite}
            className={`flex items-center px-4 py-2 rounded ${
              isFavorite
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            } ${isTogglingFavorite ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isFavorite ? 'Delete from favorites' : 'Add to favorites'}
            <svg 
              className={`ml-2 w-5 h-5 ${isFavorite ? 'text-white' : 'text-yellow-500'}`} 
              fill={isFavorite ? 'currentColor' : 'none'} 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </button>
        )}
      </div>

      {error && pokemon && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded">
          {error}
        </div>
      )}
      
      <div className={`rounded-lg overflow-hidden shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="p-6">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 mb-6 md:mb-0 flex justify-center items-start">
              <img 
                src={pokemon.sprites.other['official-artwork']?.front_default || pokemon.sprites.front_default} 
                alt={pokemon.name} 
                className="w-64 h-64 object-contain"
              />
            </div>
            
            <div className="md:w-2/3 md:pl-6">
              <div className="flex items-center mb-4">
                <h1 className={`text-3xl font-bold capitalize ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {pokemon.name}
                </h1>
                <span className={`ml-3 text-xl ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {formatId(pokemon.id)}
                </span>
              </div>
              
              <div className="mb-4">
                <h2 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Typy</h2>
                <div className="flex flex-wrap gap-2">
                  {pokemon.types.map(typeInfo => (
                    <span 
                      key={typeInfo.type.name}
                      className={`px-3 py-1 rounded text-white ${getTypeColor(typeInfo.type.name)} capitalize`}
                    >
                      {typeInfo.type.name}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h2 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Height
                  </h2>
                  <p className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {pokemon.height / 10} m
                  </p>
                </div>
                <div>
                  <h2 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Weight
                  </h2>
                  <p className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {pokemon.weight / 10} kg
                  </p>
                </div>
              </div>
              
              {species && species.flavor_text_entries?.find(entry => entry.language.name === "en") && (
                <div className="mb-4">
                  <h2 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Description
                  </h2>
                  <p className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {species.flavor_text_entries
                      .find(entry => entry.language.name === "en")
                      .flavor_text.replace(/\f/g, " ")}
                  </p>
                </div>
              )}
              
              <div>
                <h2 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Statystyki
                </h2>
                <div className="space-y-2">
                  {pokemon.stats.map(stat => (
                    <div key={stat.stat.name}>
                      <div className="flex justify-between mb-1">
                        <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {getStatName(stat.stat.name)}
                        </span>
                        <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {stat.base_stat}
                        </span>
                      </div>
                      <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        <div 
                          className={`h-2 rounded-full ${getStatColor(stat.stat.name)}`}
                          style={{ width: `${Math.min(100, (stat.base_stat / 255) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {evolutionChain && evolutionChain.chain && (
        <div className={`mt-8 rounded-lg overflow-hidden shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="p-6">
            <h2 className={`text-2xl font-bold mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Evolution Chain
            </h2>
            <EvolutionChain chain={evolutionChain.chain} darkMode={darkMode} />
          </div>
        </div>
      )}
    </div>
  );
};


// Funkcje pomocnicze do stylizacji
function getTypeColor(type) {
  const types = {
    normal: 'bg-gray-500',
    fire: 'bg-red-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-500',
    grass: 'bg-green-500',
    ice: 'bg-blue-300',
    fighting: 'bg-red-700',
    poison: 'bg-purple-500',
    ground: 'bg-yellow-700',
    flying: 'bg-indigo-400',
    psychic: 'bg-pink-500',
    bug: 'bg-green-600',
    rock: 'bg-yellow-800',
    ghost: 'bg-purple-700',
    dragon: 'bg-indigo-700',
    dark: 'bg-gray-800',
    steel: 'bg-gray-400',
    fairy: 'bg-pink-300',
  };
  
  return types[type] || 'bg-gray-500';
}

function getStatName(statName) {
  const stats = {
    'hp': 'HP',
    'attack': 'Attack',
    'defense': 'Defense',
    'special-attack': 'Sp. Attack',
    'special-defense': 'Sp. Defense',
    'speed': 'Speed'
  };
  
  return stats[statName] || statName;
}

function getStatColor(statName) {
  const stats = {
    'hp': 'bg-red-500',
    'attack': 'bg-orange-500',
    'defense': 'bg-yellow-500',
    'special-attack': 'bg-blue-500',
    'special-defense': 'bg-green-500',
    'speed': 'bg-pink-500'
  };
  
  return stats[statName] || 'bg-gray-500';
}

export default PokemonDetails;