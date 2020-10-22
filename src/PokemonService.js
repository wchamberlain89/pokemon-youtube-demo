import axios from 'axios'

const baseURL = 'https://pokeapi.co/api/v2'

const getAllPokemon = (key, offset = 0) => {
  console.log('offset is',(offset))

  return axios.get(`${baseURL}/pokemon/?offset=${offset}&limit=50`).then(res => res.data)
}

const getPokemon = (id) => {
  return axios.get(`${baseURL}/pokemon/${id}`).then(res => res.data)
}

export default {
  getAllPokemon,
  getPokemon
}