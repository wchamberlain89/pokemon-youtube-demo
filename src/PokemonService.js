import axios from 'axios'

const baseURL = 'https://pokeapi.co/api/v2'

const getAllPokemon = () => {
  return axios.get(`${baseURL}/pokemon/?limit=250`).then(res => res.data)
}

const getPokemon = (id) => {
  return axios.get(`${baseURL}/pokemon/${id}`).then(res => res.data)
}

export default {
  getAllPokemon,
  getPokemon
}