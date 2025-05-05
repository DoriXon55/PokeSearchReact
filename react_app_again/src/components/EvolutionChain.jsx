import React from 'react';
import { Link } from 'react-router-dom';

const EvolutionChain = ({ chain, darkMode }) => {
  const renderEvolutionChain = (chain) => {
    if (!chain) return null;
    
    // Wyciągnij ID z URL (np. https://pokeapi.co/api/v2/pokemon-species/1/ -> 1)
    const getId = (url) => {
      const parts = url.split('/');
      return parts[parts.length - 2];
    };

    // Funkcja do transformacji drzewa ewolucji w płaską listę
    const flattenEvolutionChain = (node, result = []) => {
      if (!node) return result;
      
      // Dodaj aktualny node
      result.push({
        id: getId(node.species.url),
        name: node.species.name,
        details: node.evolution_details,
      });
      
      // Rekurencyjnie dodaj wszystkie ewolucje
      if (node.evolves_to && node.evolves_to.length > 0) {
        node.evolves_to.forEach(evolution => {
          flattenEvolutionChain(evolution, result);
        });
      }
      
      return result;
    };
    
    const evolutionList = flattenEvolutionChain(chain);
    
    return (
      <div className="flex flex-wrap justify-center items-center">
        {evolutionList.map((pokemon, index) => (
          <React.Fragment key={pokemon.id}>
            {/* Strzałka między pokemonami */}
            {index > 0 && (
              <div className="mx-4 flex flex-col items-center">
                <svg 
                  className={`w-6 h-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                {pokemon.details && pokemon.details.length > 0 && (
                  <div className={`text-xs text-center mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {pokemon.details.map((detail, idx) => (
                      <div key={idx}>
                        {detail.min_level ? `Poziom ${detail.min_level}` : ''}
                        {detail.item ? `${detail.item.name.replace('-', ' ')}` : ''}
                        {detail.trigger?.name === 'trade' ? 'Wymiana' : ''}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Pokemon */}
            <Link to={`/pokemon/${pokemon.id}`} className="group">
              <div className="flex flex-col items-center">
                <div className={`w-24 h-24 mx-auto rounded-full mb-2 flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} group-hover:bg-blue-100 transition-colors`}>
                  <img 
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                    alt={pokemon.name}
                    className="w-20 h-20 object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
                    }}
                  />
                </div>
                <p className={`text-center capitalize mb-1 ${darkMode ? 'text-white' : 'text-gray-800'} group-hover:text-blue-500`}>
                  {pokemon.name}
                </p>
              </div>
            </Link>
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="flex justify-center">
      {renderEvolutionChain(chain)}
    </div>
  );
};

export default EvolutionChain;