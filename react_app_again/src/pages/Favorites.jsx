import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pokemonApi, favoritesApi } from '../hooks/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Favorites = ({ darkMode }) => {
  const [favoritePokemons, setFavoritePokemons] = useState([]);
  const [pokemonDetails, setPokemonDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const formatDate = (dateString) => {
    if (!dateString) return 'Date unavailable';
    
    const date = new Date(dateString);
    if (date.toString() === 'Invalid Date') return 'Date unavailable';
    
    return date.toLocaleDateString();
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const favoritesResponse = await favoritesApi.getFavoritePokemons();
        console.log('API favorite:', favoritesResponse.data);
        setFavoritePokemons(favoritesResponse.data);
        
        const details = {};
        await Promise.all(
          favoritesResponse.data.map(async (favorite) => {
            try {
              const pokemonResponse = await pokemonApi.getPokemonDetails(favorite.pokemonId);
              details[favorite.pokemonId] = pokemonResponse.data;
            } catch (err) {
              console.error(`Error getting Pokemon ID details: ${favorite.pokemonId}`, err);
            }
          })
        );
        
        setPokemonDetails(details);
      } catch (err) {
        setError('Error - cannot download favorite pokemons');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFavorites();
  }, []);

  const handleRemoveFromFavorites = async (pokemonId) => {
    try {
      await favoritesApi.removeFromFavorites(pokemonId);
      setFavoritePokemons(favoritePokemons.filter(fav => fav.pokemonId !== pokemonId));
    } catch (err) {
      setError('Error - cannot delete Pokemon');
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner darkMode={darkMode} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Favorite Pokemons
      </h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded">
          {error}
        </div>
      )}
      
      {favoritePokemons.length === 0 ? (
        <div className={`text-center py-10 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <p>You don't have any favorite Pokémon yet.</p>
          <p className="mt-2">
          Browse Pokemon and add them to your favorites by clicking the star!
          </p>
          <Link 
            to="/"
            className={`inline-block mt-4 px-4 py-2 rounded ${
              darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
            }`}
          >
            Browse Pokemons
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favoritePokemons.map(favorite => {
            const pokemon = pokemonDetails[favorite.pokemonId];
            
            if (!pokemon) {
              return (
                <div 
                  key={favorite.id}
                  className={`rounded-lg shadow-md p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                >
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Loading... (ID: {favorite.pokemonId})
                  </p>
                </div>
              );
            }
            
            return (
              <div 
                key={favorite.id}
                className={`rounded-lg shadow-md overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                <div className="relative">
                  <Link to={`/pokemon/${favorite.pokemonId}`}>
                    <img 
                      src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default} 
                      alt={pokemon.name}
                      className="w-full h-40 object-contain bg-gray-100"
                    />
                  </Link>
                  <button
                    onClick={() => handleRemoveFromFavorites(favorite.pokemonId)}
                    className="absolute top-2 right-2 p-2 rounded-full bg-white bg-opacity-70 hover:bg-red-100 text-red-500"
                    title="Usuń z ulubionych"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                <div className="p-4">
                  <h3 className={`text-lg font-medium capitalize ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {pokemon.name}
                  </h3>
                  <div className="flex gap-2 mt-2">
                    {pokemon.types.map(typeInfo => (
                      <span 
                        key={typeInfo.type.name}
                        className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-800 capitalize"
                      >
                        {typeInfo.type.name}
                      </span>
                    ))}
                  </div>
                  <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Dodano: {formatDate(favorite.createdAt || favorite.addedAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Favorites;