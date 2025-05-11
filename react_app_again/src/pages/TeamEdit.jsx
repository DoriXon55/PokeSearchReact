import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { teamsApi, pokemonApi } from "../hooks/api";
import LoadingSpinner from "../components/LoadingSpinner";
import SearchBar from "../components/SearchBar";

const TeamEdit = ({ darkMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [team, setTeam] = useState(null);
  const [pokemons, setPokemons] = useState(Array(6).fill(null));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teamName, setTeamName] = useState("");

  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        setLoading(true);
        const teamResponse = await teamsApi.getTeam(id);
        setTeam(teamResponse.data);
        setTeamName(teamResponse.data.name);

        const pokemonsResponse = await teamsApi.getTeamPokemons(id);
        console.log("Otrzymane pokemony z API:", pokemonsResponse.data);

        const pokemonSlots = Array(6).fill(null);

        if (pokemonsResponse.data && Array.isArray(pokemonsResponse.data)) {
          for (const pokemon of pokemonsResponse.data) {
            if (typeof pokemon.position !== "number" || !pokemon.pokemonId) {
              console.warn("Pokemon bez poprawnej pozycji lub ID:", pokemon);
              continue;
            }

            const frontendPosition = pokemon.position - 1;

            if (frontendPosition >= 0 && frontendPosition < 6) {
              try {
                const pokemonDetails = await pokemonApi.getPokemonDetails(
                  pokemon.pokemonId
                );
                console.log(
                  `Szczegóły pokemona ${pokemon.pokemonId} na pozycji ${frontendPosition}:`,
                  pokemonDetails.data
                );

                if (pokemonDetails.data) {
                  pokemonSlots[frontendPosition] = {
                    ...pokemon,
                    position: frontendPosition,
                    details: pokemonDetails.data,
                  };
                } else {
                  console.warn(`Brak danych dla pokemona ${pokemon.pokemonId}`);
                  pokemonSlots[frontendPosition] = {
                    ...pokemon,
                    position: frontendPosition,
                    details: { name: `Pokemon #${pokemon.pokemonId}` },
                  };
                }
              } catch (err) {
                console.error(
                  `Error fetching details for pokemon ${pokemon.pokemonId}:`,
                  err
                );
                pokemonSlots[frontendPosition] = {
                  ...pokemon,
                  position: frontendPosition,
                  details: { name: `Pokemon #${pokemon.pokemonId}` },
                };
              }
            } else {
              console.warn(
                `Pozycja pokemona poza zakresem: ${pokemon.position} (frontend: ${frontendPosition})`
              );
            }
          }
        }

        console.log("Przetworzone sloty pokemonów:", pokemonSlots);
        setPokemons(pokemonSlots);
      } catch (err) {
        console.error("Error fetching team details:", err);
        setError("Nie udało się pobrać szczegółów drużyny.");
      } finally {
        setLoading(false);
      }
    };
    fetchTeamDetails();
  }, [id]);

  const handleSearchPokemon = async (query) => {
    try {
      setSearchLoading(true);
      setSearchError("");
      const response = await pokemonApi.searchPokemon(query.toLowerCase());

      // Obsługa różnych formatów odpowiedzi
      if (Array.isArray(response.data)) {
        setSearchResults(response.data);
      } else {
        setSearchResults([response.data]);
      }

      if (response.data.error) {
        setSearchError(response.data.message || "Nie znaleziono pokemona");
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Error searching pokemon:", err);
      setSearchError("Nie znaleziono pokemona o podanej nazwie lub ID");
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleResetSearch = () => {
    setSearchResults([]);
    setSearchError("");
  };

  const selectPokemonForPosition = (position) => {
    setSelectedPosition(position);
    handleResetSearch();
  };

  const addPokemonToTeam = async (pokemon) => {
    if (selectedPosition === null) return;

    try {
      setIsUpdating(true);

      console.log("Próbuję dodać pokemona:", {
        teamId: id,
        pokemonId: pokemon.id,
        position: selectedPosition,
        backendPosition: selectedPosition + 1,
      });

      const response = await teamsApi.addPokemonToTeam(
        id,
        pokemon.id,
        selectedPosition
      );
      console.log("Odpowiedź z serwera:", response.data);

      const updatedPokemons = [...pokemons];
      updatedPokemons[selectedPosition] = {
        pokemonId: pokemon.id,
        position: selectedPosition,
        details: pokemon,
      };
      setPokemons(updatedPokemons);

      setSelectedPosition(null);
      setSearchResults([]);
    } catch (err) {
      console.error("Error adding pokemon to team:", err);
      const errorMsg = err.response?.data || err.message || "Nieznany błąd";
      console.log("Szczegóły błędu:", errorMsg);
      setError(
        `Nie udało się dodać Pokemona do drużyny: ${
          typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg)
        }`
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const removePokemon = async (position) => {
    if (!pokemons[position]) return;

    try {
      setIsUpdating(true);
      console.log(
        "Próba usunięcia pokemona z pozycji:",
        position,
        "backend position:",
        position + 1
      );

      await teamsApi.removePokemonFromTeam(id, position);

      const updatedPokemons = [...pokemons];
      updatedPokemons[position] = null;
      setPokemons(updatedPokemons);
    } catch (err) {
      console.error("Error removing pokemon from team:", err);
      const errorMsg = err.response?.data || err.message || "Nieznany błąd";
      setError(
        `Nie udało się usunąć Pokemona z drużyny: ${
          typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg)
        }`
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const updateTeamName = async () => {
    if (!teamName.trim() || teamName === team.name) return;

    try {
      setIsUpdating(true);
      await teamsApi.updateTeam(id, teamName);
      setTeam({ ...team, name: teamName });
    } catch (err) {
      console.error("Error updating team name:", err);
      setError("Nie udało się zaktualizować nazwy drużyny.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveChanges = async () => {
    // Zapisz nazwę drużyny, jeśli się zmieniła
    if (teamName !== team?.name) {
      await updateTeamName();
    }

    navigate(`/teams/${id}`);
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
        <div
          className={`text-center p-8 ${
            darkMode ? "text-red-300" : "text-red-600"
          }`}
        >
          <p>{error || "Nie znaleziono drużyny"}</p>
          <Link
            to="/teams"
            className={`mt-4 inline-block px-4 py-2 rounded ${
              darkMode
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            Wróć do listy drużyn
          </Link>
        </div>
      </div>
    );
  }

  

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to={`/teams/${id}`}
        className={`${
          darkMode
            ? "text-blue-400 hover:text-blue-300"
            : "text-blue-600 hover:text-blue-700"
        }`}
      >
        &larr; Wróć do szczegółów drużyny
      </Link>

      <h1
        className={`text-3xl font-bold mt-4 mb-6 ${
          darkMode ? "text-white" : "text-gray-800"
        }`}
      >
        Edytuj drużynę
      </h1>

      <div
        className={`rounded-lg shadow-lg overflow-hidden mb-8 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="p-6">
          <h2
            className={`text-xl font-semibold mb-4 ${
              darkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Informacje o drużynie
          </h2>

          <div className="mb-4">
            <label
              className={`block mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Nazwa drużyny
            </label>
            <div className="flex">
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className={`flex-grow px-4 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
                    : "bg-white text-gray-800 border-gray-300 placeholder-gray-500"
                }`}
                required
              />
              <button
                onClick={updateTeamName}
                disabled={
                  !teamName.trim() || teamName === team.name || isUpdating
                }
                className={`ml-2 px-4 py-2 rounded-lg ${
                  darkMode
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                } ${
                  !teamName.trim() || teamName === team.name || isUpdating
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Aktualizuj nazwę
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`rounded-lg shadow-lg overflow-hidden ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="p-6">
          <h2
            className={`text-xl font-semibold mb-6 ${
              darkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Pokemony w drużynie
          </h2>

          {selectedPosition !== null ? (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3
                  className={`text-lg font-medium ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Wybierz Pokemona dla Slotu {selectedPosition + 1}
                </h3>
                <button
                  onClick={() => setSelectedPosition(null)}
                  className={`px-3 py-1 rounded ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-200 hover:bg-gray-300"
                  } text-sm`}
                >
                  Anuluj
                </button>
              </div>

              <SearchBar
                onSearch={handleSearchPokemon}
                onReset={handleResetSearch}
                darkMode={darkMode}
              />

              {searchLoading && (
                <div className="flex justify-center my-4">
                  <LoadingSpinner darkMode={darkMode} />
                </div>
              )}

              {searchError && (
                <p
                  className={`text-center my-4 ${
                    darkMode ? "text-red-400" : "text-red-600"
                  }`}
                >
                  {searchError}
                </p>
              )}

              {!searchLoading && searchResults.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
                  {searchResults.map((pokemon) => (
                    <div
                      key={pokemon.id}
                      onClick={() => addPokemonToTeam(pokemon)}
                      className={`rounded-lg p-4 flex flex-col items-center cursor-pointer border-2 ${
                        darkMode
                          ? "bg-gray-700 hover:bg-gray-600 border-gray-600 hover:border-blue-500"
                          : "bg-white hover:bg-gray-50 border-gray-200 hover:border-blue-400"
                      }`}
                    >
                      <img
                        src={
                          pokemon.sprites?.front_default ||
                          `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
                        }
                        alt={pokemon.name}
                        className="w-20 h-20 object-contain"
                      />
                      <p
                        className={`text-center capitalize mt-2 ${
                          darkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {pokemon.name}
                      </p>
                      <p
                        className={`text-center text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        #{String(pokemon.id).padStart(3, "0")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-6">
              {pokemons.map((pokemon, index) => (
                <div
                  key={`slot-${index}`}
                  className={`rounded-xl ${
                    darkMode ? "bg-gray-700" : "bg-gray-100"
                  } p-4 flex flex-col items-center relative`}
                  style={{ minHeight: "160px" }}
                >
                  <span
                    className={`absolute top-1 left-2 text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Slot {index + 1}
                  </span>

                  {pokemon ? (
                    <>
                      <div className="w-24 h-24 flex items-center justify-center">
                        <img
                          src={
                            pokemon.details?.sprites?.front_default ||
                            `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.pokemonId}.png`
                          }
                          alt={
                            pokemon.details?.name ||
                            `Pokemon #${pokemon.pokemonId}`
                          }
                          className="w-20 h-20 object-contain"
                        />
                      </div>
                      <h3
                        className={`text-center capitalize mt-1 ${
                          darkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {pokemon.details?.name ||
                          `Pokemon #${pokemon.pokemonId}`}
                      </h3>
                      <div className="mt-2 flex space-x-2">
                        <button
                          onClick={() => removePokemon(index)}
                          disabled={isUpdating}
                          className={`px-2 py-1 rounded text-sm ${
                            darkMode
                              ? "bg-red-900 text-red-300 hover:bg-red-800"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          } ${
                            isUpdating ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          Usuń
                        </button>
                        <button
                          onClick={() => selectPokemonForPosition(index)}
                          disabled={isUpdating}
                          className={`px-2 py-1 rounded text-sm ${
                            darkMode
                              ? "bg-blue-900 text-blue-300 hover:bg-blue-800"
                              : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                          } ${
                            isUpdating ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          Zmień
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <div
                        className={`text-5xl ${
                          darkMode ? "text-gray-600" : "text-gray-400"
                        }`}
                      >
                        ?
                      </div>
                      <p
                        className={`mt-2 text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Pusty slot
                      </p>
                      <button
                        onClick={() => selectPokemonForPosition(index)}
                        disabled={isUpdating}
                        className={`mt-4 px-3 py-1 rounded ${
                          darkMode
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-green-500 hover:bg-green-600 text-white"
                        } ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        Dodaj Pokemona
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {selectedPosition === null && (
            <div className="flex justify-center">
              <button
                onClick={handleSaveChanges}
                disabled={isUpdating}
                className={`px-6 py-3 rounded-lg ${
                  darkMode
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                } ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isUpdating ? "Zapisywanie..." : "Zapisz zmiany"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamEdit;
