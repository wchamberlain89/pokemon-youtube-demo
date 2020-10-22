import React from 'react';
import { useQuery, useMutation, useQueryCache, useInfiniteQuery } from 'react-query'
import PokemonService from './PokemonService'
import jsonService from './jsonService'
import useIntersectionObserver from './useIntersectionObserver'

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
  const scrollContainerRef = React.useRef();

  const { data, status, error, isFetching, isFetchingMore, fetchMore, canFetchMore } = useInfiniteQuery('pokemon', PokemonService.getAllPokemon, {
    getFetchMore: (lastGroup, allGroups) => allGroups.reduce((acc, group) => acc += group.results.length, 0)
  })
  const pokemonTeam = useQuery('pokemon-team', jsonService.getPokemonTeam)
  const [ errorMessage, setErrorMessage ] = React.useState('')
  
  const queryCache = useQueryCache()
  const [ mutate ] = useMutation(jsonService.addPokemon, {
    onSuccess: () => {
      queryCache.invalidateQueries('pokemon-team')
    }
  })
  
  const setTimedMessage = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage('')
    }, 2000)
  }
  
  const handleButtonClick = (name) => {
    if(pokemonTeam.data.length < 6) {
      mutate(name)
    } else {
      setTimedMessage('Your Pokemon Team is full!')
    }
  }
  
  useIntersectionObserver({
    target: scrollContainerRef,
    onIntersect: fetchMore,
    enabled: canFetchMore,
    threshold: 0,
    margin: '-500px'
  })
  
  if(status === 'loading') {
    return '...loading'
  }
  
  if(status === 'error') {
    console.log('error', error)
  }
  
  return (
    <div className='pokemon-grid' >
      { errorMessage && <div className='error-message'>{errorMessage}</div> }
      {
        data.map(dataSet => (
          dataSet.results.map(pokemon => <Pokemon id={pokemon.name} key={pokemon.name} onButtonClick={() => handleButtonClick(pokemon.name)} buttonValue='Add To Team'/>
          )))
        }
      <button 
        onClick={() => fetchMore()}
        disabled={ isFetchingMore}
        ref={scrollContainerRef}
      >
        {isFetchingMore ? 'loading' : 'load more'}
      </button>
    </div>
  )
}

const Pokemon = ({ id, buttonValue, onButtonClick, shiny }) => {
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
      <img style={{height: '96px'}} src={shiny ? data.sprites.front_shiny : data.sprites.front_default} alt='Pokemon Sprite' />
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

  const [ updateShiny ] = useMutation(jsonService.updateShiny, {
    onSuccess: () => {
      queryCache.invalidateQueries('pokemon-team')
    }
  })
  
  if(pokemonTeam.isLoading) {
    return null
  }

  const handleChangeShinyStatus = (status, id) => {
    updateShiny({ id, isShiny: status })
  }

  return (
    <div className='pokemon-team__container'>
      <h1>Your Pokemon Team</h1>
      <div className='team-grid'>
        {pokemonTeam.data.map(pokemon => (
          <div key={pokemon.id}>
            <Pokemon shiny={pokemon.isShiny} id={pokemon.name} onButtonClick={() => removeFromTeam(pokemon.id)} buttonValue='Remove from team'/>
            <label for='shiny'>Shiny</label>
            <input name='shiny' style={{ marginTop: '20px' }} defaultChecked={pokemon.isShiny} onChange={(event) => handleChangeShinyStatus(event.target.checked, pokemon.id)} type='checkbox' />
          </div>
        ))}
      </div>
    </div>
  )
}

export default App;
