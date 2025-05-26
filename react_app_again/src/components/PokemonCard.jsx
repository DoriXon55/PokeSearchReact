import TypeIcon from "./TypeIcon";
import {Link} from 'react-router-dom';
import placeholderImage from '../assets/pokemon-placeholder.png'; 

const PokemonCard = ({ pokemon, darkMode }) => {
  if (!pokemon || !pokemon.id) {
    return null; 
  }
  
  const imageUrl = pokemon.frontDefaultSprite || placeholderImage;
  
  return (
    <Link to={`/pokemon/${pokemon.id}`} className="block w-full no-underline">
      <div className={`border rounded-lg p-2 mx-auto shadow-md flex flex-col items-center 
        ${darkMode 
          ? 'border-gray-700 bg-gray-800 text-white hover:shadow-blue-500/70 hover:border-blue-500 hover:-translate-y-1' 
          : 'border-gray-300 bg-white text-black hover:shadow-lg hover:-translate-y-1'}
        transition-all duration-300`
      }>
        <div className="relative w-full">
          <span className={`absolute top-0 right-0 rounded-full px-2 py-1 text-xs
            ${darkMode 
              ? 'bg-gray-700 text-white' 
              : 'bg-gray-200 text-black'}`
          }>
            #{pokemon.id}
          </span>
          <img 
            src={imageUrl}
            alt={pokemon.name}
            className="w-32 h-32 mx-auto"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = placeholderImage;
            }}
          />
        </div>

        <h2 className="text-xl capitalize mt-2 font-medium">{pokemon.name}</h2>

        <div className="flex gap-2 mt-2">
          {pokemon.pokemon_v2_pokemontypes && pokemon.pokemon_v2_pokemontypes.map((typeEntry) => (
            <TypeIcon 
              key={typeEntry?.pokemon_v2_type?.name}
              type={typeEntry?.pokemon_v2_type?.name} 
            />
          ))}
        </div>
      </div>
    </Link>
  );
};

export default PokemonCard;