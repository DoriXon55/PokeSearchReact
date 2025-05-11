import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { teamsApi, pokemonApi } from '../hooks/api';
import LoadingSpinner from '../components/LoadingSpinner';

const TeamDetail = ({ darkMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        setLoading(true);
        // Pobierz informacje o drużynie
        const teamResponse = await teamsApi.getTeam(id);
        setTeam(teamResponse.data);

        // Pobierz pokemony w drużynie
        const pokemonsResponse = await teamsApi.getTeamPokemons(id);
        
        // Tworzenie tablicy 6 slotów (null oznacza pusty slot)
        const pokemonSlots = Array(6).fill(null);
        
        // Wypełnij sloty pokemonami z odpowiedzi API
        for (const pokemon of pokemonsResponse.data) {
          if (pokemon.position >= 0 && pokemon.position < 6) {
            // Pobierz szczegóły pokemona, jeśli mamy tylko ID
            try {
              const pokemonDetails = await pokemonApi.getPokemonDetails(pokemon.pokemonId);
              pokemonSlots[pokemon.position] = {
                ...pokemon,
                details: pokemonDetails.data
              };
            } catch (err) {
              console.error(`Error fetching details for pokemon ${pokemon.pokemonId}:`, err);
              pokemonSlots[pokemon.position] = pokemon;
            }
          }
        }
        
        setPokemons(pokemonSlots);
      } catch (err) {
        console.error('Error fetching team details:', err);
        setError('Nie udało się pobrać szczegółów drużyny.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamDetails();
  }, [id]);

  const handleRemovePokemon = async (position) => {
    if (!pokemons[position]) return;
    
    if (window.confirm('Czy na pewno chcesz usunąć tego Pokemona z drużyny?')) {
      try {
        setLoading(true);
        await teamsApi.removePokemonFromTeam(id, position);
        
        // Aktualizuj lokalnie
        const updatedPokemons = [...pokemons];
        updatedPokemons[position] = null;
        setPokemons(updatedPokemons);
      } catch (err) {
        console.error('Error removing pokemon from team:', err);
        setError('Nie udało się usunąć Pokemona z drużyny.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner darkMode={darkMode} />
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className={`text-center p-8 ${darkMode ? 'text-red-300' : 'text-red-600'}`}>
          <p>{error || 'Nie znaleziono drużyny'}</p>
          <Link to="/teams" className={`mt-4 inline-block px-4 py-2 rounded ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}>
            Wróć do listy drużyn
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <Link to="/teams" className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
            &larr; Wróć do listy drużyn
          </Link>
          <h1 className={`text-3xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {team.name}
          </h1>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Link
            to={`/teams/${id}/edit`}
            className={`px-4 py-2 rounded-lg ${
              darkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Edytuj drużynę
          </Link>
        </div>
      </div>

      <div className={`rounded-lg shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="p-6">
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Pokemony w drużynie
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-6">
            {pokemons.map((pokemon, index) => (
              <div 
                key={`slot-${index}`} 
                className={`rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 flex flex-col items-center relative`}
              >
                <span className={`absolute top-1 left-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Slot {index + 1}
                </span>
                
                {pokemon ? (
                  <>
                    <div className="w-24 h-24 flex items-center justify-center">
                      <img 
                        src={pokemon.details?.sprites?.front_default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokemonId}.png`} 
                        alt={pokemon.details?.name || `Pokemon #${pokemon.pokemonId}`} 
                        className="w-20 h-20 object-contain"
                      />
                    </div>
                    <h3 className={`text-center capitalize mt-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {pokemon.details?.name || `Pokemon #${pokemon.pokemonId}`}
                    </h3>
                    <div className="mt-2 flex justify-center">
                      <button 
                        onClick={() => handleRemovePokemon(index)}
                        className={`px-2 py-1 rounded text-sm ${
                          darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-700'
                        } hover:${darkMode ? 'bg-red-800' : 'bg-red-200'}`}
                      >
                        Usuń
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-32 flex flex-col items-center justify-center">
                    <div className={`text-5xl ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>?</div>
                    <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Pusty slot</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-6">
            <Link
              to={`/teams/${id}/edit`}
              className={`px-6 py-3 rounded-lg ${
                darkMode
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              Edytuj skład drużyny
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetail;