import React from "react";
import { useParams, Link } from "react-router-dom";
import usePokemonDetails from "../hooks/usePokemonDetails";
import TypeIcon from "../components/TypeIcon";
import EvolutionChain from "../components/EvolutionChain";

const PokemonDetails = ({ darkMode }) => {
  const { id } = useParams();
  const { pokemon, species, evolutionChain, loading, error } =
    usePokemonDetails(id);

  if (loading)
    return <p className="text-center text-xl">Loading Pokemons...</p>;
  if (error) return <p className="text-center text-red-500 text-xl">{error}</p>;
  if (!pokemon) return null;

  const description =
    species?.flavor_text_entries
      ?.find((entry) => entry.language.name === "en")
      ?.flavor_text.replace(/\f/g, " ") || "Brak dostępnego opisu.";

  const getStatColor = (statName, isDark) => {
    const colors = {
      hp: isDark ? "bg-red-500" : "bg-red-400",
      attack: isDark ? "bg-orange-500" : "bg-orange-400",
      defense: isDark ? "bg-yellow-500" : "bg-yellow-400",
      "special-attack": isDark ? "bg-blue-500" : "bg-blue-400",
      "special-defense": isDark ? "bg-green-500" : "bg-green-400",
      speed: isDark ? "bg-pink-500" : "bg-pink-400",
    };

    return colors[statName] || (isDark ? "bg-gray-500" : "bg-gray-400");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/"
        className={`inline-flex items-center mb-6 ${
          darkMode
            ? "text-blue-400 hover:text-blue-300"
            : "text-blue-600 hover:text-blue-700"
        }`}
      >
        ← Back to list
      </Link>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <img
            src={
              pokemon.sprites.other["official-artwork"].front_default ||
              pokemon.sprites.front_default
            }
            alt={pokemon.name}
            className="w-full rounded-lg shadow-md"
          />
        </div>

        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold capitalize mb-2">{pokemon.name}</h1>
          <p className="text-xl opacity-75 mb-4">#{pokemon.id}</p>
          <div className="flex gap-2 mb-6">
            {pokemon.types.map((typeInfo) => (
              <TypeIcon key={typeInfo.type.name} type={typeInfo.type.name} />
            ))}
          </div>

          <div
            className={`p-4 rounded-lg mb-6 ${
              darkMode ? "bg-gray-800" : "bg-gray-100"
            }`}
          >
            <h2 className="text-xl font-semibold mb-3">Basic Information</h2>
            <div className="grid grid-cols-2 gap-y-2">
              <span className="font-medium">Height:</span>
              <span>{pokemon.height / 10} m</span>
              <span className="font-medium">Weight:</span>
              <span>{pokemon.weight / 10} kg</span>

              <span className="font-medium">Abilities:</span>
              <span>
                {pokemon.abilities
                  .map((ability) => ability.ability.name.replace("-", " "))
                  .join(", ")}
              </span>
            </div>
          </div>

          {species && (
            <div
              className={`p-4 rounded-lg ${
                darkMode ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              <h2 className="text-xl font-semibold mb-3">About</h2>
              <p>{description}</p>

              {species.genera?.find((g) => g.language.name === "en") && (
                <p className="mt-3 italic">
                  {species.genera.find((g) => g.language.name === "en").genus}
                </p>
              )}
            </div>
          )}

          <div
            className={`p-4 rounded-lg mt-6 ${
              darkMode ? "bg-gray-800" : "bg-gray-100"
            }`}
          >
            <h2 className="text-xl font-semibold mb-3">Base Stats</h2>
            <div className="space-y-3">
              {pokemon.stats.map((stat) => (
                <div key={stat.stat.name} className="flex items-center">
                  <div className="w-32 font-medium capitalize">
                    {stat.stat.name.replace("-", " ")}:
                  </div>
                  <div className="w-16 text-right mr-3">{stat.base_stat}</div>
                  <div className="flex-grow">
                    <div
                      className={`h-2.5 rounded-full ${getStatColor(
                        stat.stat.name,
                        darkMode
                      )}`}
                      style={{
                        width: `${Math.min(100, stat.base_stat / 2.5)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        {evolutionChain && evolutionChain.chain && (
          <div
            className={`p-6 rounded-lg mb-6 ${
              darkMode ? "bg-gray-800" : "bg-gray-100"
            }`}
          >
            <h2 className="text-2xl font-semibold mb-4">Evolutions</h2>
            <div className="flex justify-center flex-wrap gap-4">
              <EvolutionChain
                chain={evolutionChain.chain}
                darkMode={darkMode}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PokemonDetails;
