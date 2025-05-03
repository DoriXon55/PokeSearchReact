import React from "react";
import { Link } from "react-router-dom";

const EvolutionChain = ({ chain, darkMode }) => {
  if (!chain || !chain.species) return null;

  // Renderuje pojedynczy element ewolucji wraz z jego ewolucjami
  const renderEvolution = (evolutionData) => {
    const pokemonId = evolutionData.species.url
      .split('/')
      .filter(Boolean)
      .pop();

    return (
      <div className="flex flex-col items-center" key={evolutionData.species.name}>
        <Link to={`/pokemon/${pokemonId}`} className="flex flex-col items-center">
          <img 
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`}
            alt={evolutionData.species.name}
            className="w-20 h-20"
          />
          <p className={`capitalize text-center text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {evolutionData.species.name}
          </p>
        </Link>
      </div>
    );
  };

  // Renderuje strzałkę między ewolucjami
  const renderArrow = () => (
    <div className="flex items-center justify-center px-2">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={`h-6 w-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );

  // Funkcja rekurencyjna do tworzenia łańcucha ewolucji
  const buildEvolutionChain = (evolutionData) => {
    // Renderuj aktualny Pokémon
    const currentPokemon = renderEvolution(evolutionData);
    
    // Jeśli brak dalszych ewolucji, zwróć tylko aktualnego Pokémona
    if (!evolutionData.evolves_to || evolutionData.evolves_to.length === 0) {
      return currentPokemon;
    }
    
    // Utwórz tablicę zawierającą wszystkie ewolucje
    const evolutionComponents = evolutionData.evolves_to.map(nextEvolution => {
      return (
        <div className="flex items-center" key={nextEvolution.species.name}>
          {renderArrow()}
          {buildEvolutionChain(nextEvolution)}
        </div>
      );
    });
    
    // Zwróć obecnego Pokémona + wszystkie jego ewolucje
    return (
      <div className="flex items-center">
        {currentPokemon}
        <div className={`flex ${evolutionData.evolves_to.length > 1 ? 'flex-col' : 'flex-row'} items-center`}>
          {evolutionComponents}
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-center w-full overflow-x-auto py-4">
      <div className="flex items-center">
        {buildEvolutionChain(chain)}
      </div>
    </div>
  );
};

export default EvolutionChain;