import React from 'react';
import { useQuery, useMutation, useQueryCache, queryCache } from 'react-query'
import PokemonService from './PokemonService'
import jsonService from './jsonService'

function App() {
  return (
    <div className="app__container">
      <div className="main-section__container">
        <PokemonList />
      </div>
      <div className="team-section__container">
        <PokemonTeam />
      </div>
    </div>
  );
}

const PokemonList = () => {
  const { data, status, error } = useQuery('pokemon', PokemonService.getAllPokemon)
  const queryCache = useQueryCache()
  const [ mutate ] = useMutation(jsonService.addPokemon, {
    onSuccess: () => {
      queryCache.invalidateQueries('pokemon-team')
    }
  })

  if(status === 'loading') {
    return '...loading'
  }
  
  if(status === 'error') {
    console.log('error', error)
  }
  
  
  return (
    <div className='pokemon-grid'>
      {data.results.map(pokemon => <Pokemon id={pokemon.name} key={pokemon.name} onButtonClick={() => mutate(pokemon.name)} buttonValue='Add To Team'/> )}
    </div>
  )
}

const Pokemon = ({ id, buttonValue, onButtonClick }) => {
  const { data, isLoading, isError, error } = useQuery(['pokemon', id], () => PokemonService.getPokemon(id))

  if(isLoading) {
    return <div className='card'/>
  }

  if(isError) {
    console.log(error)
    return null
  }


  return (
    <div className='pokemon-card card'>
      <h4>{data.name.toUpperCase()}</h4>
      <img style={{height: '96px'}} src={data.sprites.front_default} alt='Pokemon Sprite' />
      <div>
        {
          data.types.map(type => <span>{type.type.name} </span>)
        }
      </div>
      <button className='add-pokemon' onClick={onButtonClick}>{buttonValue}</button>
    </div>
  )
}

const PokemonTeam = () => {
  const pokemonTeam = useQuery('pokemon-team', jsonService.getPokemonTeam)
  const queryCache = useQueryCache()
  const [ removeFromTeam ] = useMutation(jsonService.removePokemon, {
    onSuccess: () => {
      queryCache.invalidateQueries('pokemon-team')
    }
  })
  
  if(pokemonTeam.isLoading) {
    return null
  }

  return (
    <div>
      <h1>Your Pokemon Team</h1>
      {pokemonTeam.data.map(pokemon => <Pokemon id={pokemon.name} onButtonClick={() => removeFromTeam(pokemon.id)} buttonValue='Remove from team'/>)}
    </div>
  )
}

export default App;
