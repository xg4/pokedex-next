import ky from 'ky'

export const request = ky.create({
  prefixUrl: 'https://pokeapi.co/api/v2',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})
