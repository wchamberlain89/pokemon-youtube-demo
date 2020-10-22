import axios from 'axios'

const baseURL = 'http://localhost:3001'

const getPokemonTeam = () => {
  return axios.get(`${baseURL}/pokemon-team`).then(res => res.data)
}

const addPokemon = (name) => {
  return axios.post(`${baseURL}/pokemon-team`, { name, isShiny: false }).then(res => res.data).catch(err => console.log(err))
}

const removePokemon = (id) => {
  return axios.delete(`${baseURL}/pokemon-team/${id}`)
}

export default {
  addPokemon,
  getPokemonTeam,
  removePokemon
}