import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import useTeams from '../hooks/useTeams';

const Teams = ({ darkMode }) => {
  const { teams, loading, error, createTeam, deleteTeam, fetchTeams } = useTeams();
  const [newTeamName, setNewTeamName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    setIsCreating(true);
    setCreateError('');

    try {
      await createTeam(newTeamName);
      setNewTeamName('');
      await fetchTeams();
    } catch (err) {
      setCreateError('Nie udało się utworzyć drużyny');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (window.confirm('Czy na pewno chcesz usunąć tę drużynę?')) {
      try {
        await deleteTeam(teamId);
      } catch (err) {
        console.error('Error deleting team:', err);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Moje Drużyny Pokemonów
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded">
          {error}
        </div>
      )}

      <div className="mb-8">
        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Utwórz nową drużynę
        </h2>

        <form onSubmit={handleCreateTeam} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            placeholder="Nazwa drużyny"
            className={`flex-grow px-4 py-2 rounded-lg border ${
              darkMode
                ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400'
                : 'bg-white text-gray-800 border-gray-300 placeholder-gray-500'
            }`}
            required
          />
          <button
            type="submit"
            disabled={isCreating || !newTeamName.trim()}
            className={`px-6 py-2 rounded-lg ${
              darkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            } ${(isCreating || !newTeamName.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isCreating ? 'Tworzenie...' : 'Utwórz drużynę'}
          </button>
        </form>

        {createError && (
          <p className="mt-2 text-red-500 text-sm">{createError}</p>
        )}
      </div>

      {teams.length === 0 ? (
        <div className={`text-center py-10 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <p>Nie masz jeszcze żadnych drużyn Pokemon.</p>
          <p className="mt-2">Utwórz swoją pierwszą drużynę, używając formularza powyżej!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div
              key={team.id}
              className={`rounded-lg shadow-md overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {team.name}
                  </h3>
                  <div className="flex space-x-2">
                    <Link
                      to={`/teams/${team.id}/edit`}
                      className={`p-2 rounded-full ${
                        darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                      title="Edytuj drużynę"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </Link>
                    <button
                      onClick={() => handleDeleteTeam(team.id)}
                      className={`p-2 rounded-full ${
                        darkMode ? 'bg-red-900 hover:bg-red-800' : 'bg-red-100 hover:bg-red-200'
                      } text-red-500`}
                      title="Usuń drużynę"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {team.pokemons && team.pokemons.length > 0 ? (
                    team.pokemons.map((pokemon, index) => (
                      <div
                        key={`${team.id}-position-${index}`}
                        className={`relative w-16 h-16 rounded-full ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-100'
                        } flex items-center justify-center`}
                      >
                        {pokemon ? (
                          <img
                            src={pokemon.imageUrl || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokemonId}.png`}
                            alt={pokemon.name}
                            className="w-12 h-12 object-contain"
                          />
                        ) : (
                          <span className={`text-3xl ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>?</span>
                        )}
                        <span className={`absolute bottom-0 right-0 w-5 h-5 flex items-center justify-center rounded-full text-xs ${
                          darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700 border border-gray-300'
                        }`}>
                          {index + 1}
                        </span>
                      </div>
                    ))
                  ) : (
                    Array(6).fill(null).map((_, index) => (
                      <div
                        key={`${team.id}-empty-${index}`}
                        className={`w-16 h-16 rounded-full ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-100'
                        } flex items-center justify-center`}
                      >
                        <span className={`text-3xl ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>?</span>
                        <span className={`absolute bottom-0 right-0 w-5 h-5 flex items-center justify-center rounded-full text-xs ${
                          darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700 border border-gray-300'
                        }`}>
                          {index + 1}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <Link
                  to={`/teams/${team.id}`}
                  className={`w-full flex justify-center items-center py-2 px-4 rounded-lg ${
                    darkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  Wyświetl szczegóły
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Teams;