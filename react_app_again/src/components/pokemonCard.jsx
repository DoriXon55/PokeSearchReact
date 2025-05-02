import UsePokemonApi from '../hooks/usePokemonApi'
import TypeIcon from './TypeIcon';

const PokemonCard = () => {
    const {pokemon, loading, error} = UsePokemonApi()
  return (
    <>
      <div>
        {loading && <p className="text-2xl font-bold">Ładowanie danych...</p>}
        {error && <p className="text-2xl text-red-700 font-bold">{error}</p>}

        {pokemon && !loading && !error && (
          <div className="border border-gray-300 rounded-lg p-2 mx-auto my-4 max-w-3xs shadow-md flex flex-col items-center">
            

            <div className="flex gap-2">
                {pokemon.types.map(typeInfo => (
                    <TypeIcon 
                    key={typeInfo.type.name}
                    type={typeInfo.type.name}
                    />
                ))}
            </div>
            

            <img src={pokemon.sprites.front_default}
            alt={pokemon.name}
            /> 

            <h2 className="text-2xl uppercase">{pokemon.name}</h2>



          </div>
        )}
      </div>
    </>
  )
}

export default PokemonCard;
